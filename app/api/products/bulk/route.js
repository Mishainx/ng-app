import { NextResponse } from 'next/server';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { cookies } from 'next/headers';
import { authAdmin } from '@/firebase/authManager';
import { categoryExists } from '@/utils/categoryExists';
import { subcategoryExists } from '@/utils/subcategoryExits';
import { productExists } from '@/utils/productExits';
import { createSlug, slugExists } from '@/utils/createSlug';
import { generateSequentialSku } from '@/utils/createSku';
import { read, utils } from 'xlsx';

export const POST = async (req) => {
  try {
    // Obtener los datos del formulario (incluido el archivo)
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
    }

    // Convertir el archivo en un buffer
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Parsear el archivo Excel
    const workbook = read(fileBuffer);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = utils.sheet_to_json(sheet, { defval: '' });

    // Mapear y validar los datos del archivo
    const products = jsonData.map((row) => {
      // Si no hay categoría, usar 'otros' como categoría
      const category = row.categoria ? row.categoria.trim() : 'otros';

      // Convertir la subcategoría en un array si está separada por comas
      const subcategories = row.subcategoria ? row.subcategoria.split(',').map(sub => sub.trim()) : [];

      // Crear los slugs de subcategorías basados en la categoría
      const subcategorySlugs = subcategories.map(sub => `${category.toLowerCase()}-${sub.toLowerCase()}`);

      // Convertir los valores de featured, visible, y stock a booleanos
      const featured = row.destacado === 'true' || row.destacado === true;
      const visible = row.visible === 'true' || row.visible === true;
      const stock = row.stock === 'true' || row.stock === true;

      return {
        name: row.nombre,
        category, // Usar la categoría ya validada
        subcategory: subcategorySlugs, // Aquí usamos los slugs de las subcategorías
        brand: row.marca,
        price: row.precio,
        discount: row.descuento,
        shortDescription: row.descripcionCorta,
        longDescription: row.descripcionLarga,
        stock, // Usamos el valor booleano de stock
        featured, // Usamos el valor booleano de featured
        visible, // Usamos el valor booleano de visible
        img: row.img,
      };
    });

    // Verificar el token de autorización
    const cookieStore = cookies();
    const cookie = cookieStore.get('ng-ct');
    if (!cookie || !cookie.value) {
      return NextResponse.json({ message: 'Unauthorized: No token provided' }, { status: 401 });
    }

    const token = cookie.value;
    let decodedToken;
    try {
      decodedToken = await authAdmin.verifyIdToken(token);
    } catch {
      return NextResponse.json({ message: 'Unauthorized: Invalid token' }, { status: 401 });
    }

    // Procesar los productos
    const errors = [];

    for (const product of products) {
      try {
        // Validar la categoría
        if (!(await categoryExists(product.category))) {
          errors.push(`Category ${product.category} does not exist`);
          continue;
        }

        // Validar cada subcategoría
        for (const subcategorySlug of product.subcategory) {
          if (!(await subcategoryExists(product.category, subcategorySlug))) {
            errors.push(`Subcategory ${subcategorySlug} does not exist in ${product.category}`);
            continue;
          }
        }

        const slug = await createSlug(product.name, slugExists);
        if (await productExists(slug)) {
          errors.push(`Product ${slug} already exists`);
          continue;
        }

        const sku = await generateSequentialSku('products');
        const newProduct = { ...product, slug, sku };

        // Añadir el producto a Firestore
        await addDoc(collection(db, 'products'), newProduct);
      } catch (error) {
        errors.push(`Error processing product ${product.name}: ${error.message}`);
      }
    }

    // Manejo de errores y éxito
    if (errors.length) {
      return NextResponse.json({ message: 'Some products could not be added', errors }, { status: 400 });
    }

    return NextResponse.json({ message: 'Products added successfully' }, { status: 200 });

  } catch (error) {
    console.error('Error processing the request:', error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
};
