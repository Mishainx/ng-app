import { NextResponse } from 'next/server';
import { getDocs, collection, addDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { cookies } from "next/headers";
import { createSlug, slugExists } from '@/utils/createSlug';
import { generateSequentialSku } from '@/utils/createSku';
import { storage } from '@/firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { authAdmin } from '@/firebase/authManager';
import { categoryExists } from '@/utils/categoryExists'; 
import { subcategoryExists } from '@/utils/subcategoryExits'; 
import { productExists } from '@/utils/productExits';

// `GET` para obtener los valores actuales de las categorías
export const GET = async () => {
  try {
    const productsSnapshot = await getDocs(collection(db, 'products'));
    const products = productsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(
      { message: 'success', payload: products },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching products', error: error.message },
      { status: 500 }
    );
  }
};

export const POST = async (req) => {
  try {
    const cookieStore = cookies();
    const cookie = cookieStore.get("ng-ct");
    
    if (!cookie || !cookie.value) {
      return NextResponse.json(
        { message: 'Unauthorized: No token provided' },
        { status: 401 }
      );
    }
    
    const token = cookie.value;
    
    let decodedToken;
    try {
      decodedToken = await authAdmin.verifyIdToken(token);
    } catch (error) {
      return NextResponse.json(
        { message: 'Unauthorized: Invalid token' },
        { status: 401 }
      );
    }

    // Obtener datos del producto del cuerpo de la solicitud
    const formData = await req.formData();
    const title = formData.get('title');
    const category = formData.get('category');
    const subcategories = formData.getAll('subcategory'); // Obtener un array de subcategorías
    const price = formData.get('price');
    const discount = formData.get('discount');
    const shortDescription = formData.get('shortDescription');
    const longDescription = formData.get('longDescription');
    const featured = formData.get('featured') === 'true';
    const visible = formData.get('visible') === 'true';
    const stock = formData.get('stock') === 'true';
    let img = formData.get('imgFile');
    const brand = formData.get('brand');

    // Obtener los SKU de productos relacionados desde el formulario
    const relatedSkus = formData.getAll('relatedSkus') || []; // Cambia 'relatedSkus' según tu input

    // Verificar si la categoría existe
    const categoryExistsCheck = await categoryExists(category);
    if (!categoryExistsCheck) {
      return NextResponse.json(
        { message: 'Error: La categoría no existe' },
        { status: 400 }
      );
    }

    // Verificar la existencia de cada subcategoría y almacenar solo las válidas
    const validSubcategories = [];
    for (const subcategory of subcategories) {
      const exists = await subcategoryExists(subcategory);
      if (exists) {
        validSubcategories.push(subcategory); // Solo agregar subcategorías válidas
      }
    }

    // Validar que los productos relacionados existan
    const validRelatedSkus = [];
    for (const sku of relatedSkus) {
      const exists = await productExists(sku);
      if (exists) {
        validRelatedSkus.push(sku); // Solo agregar SKUs válidos
      }
    }

    // Si no hay SKUs válidos, devolver un error
    if (validRelatedSkus.length !== relatedSkus.length) {
      return NextResponse.json(
        { message: 'Error: Algunos productos relacionados no existen' },
        { status: 400 }
      );
    }

    if (img) {
      const storageRef = ref(storage, `ProductImg/${img.name}`);
      await uploadBytes(storageRef, img);
      img = await getDownloadURL(storageRef);
    }

    // Crear un slug único
    const uniqueSlug = await createSlug(title, slugExists);

    const productData = {
      title,
      category,
      subcategories: validSubcategories, // Usar el array de subcategorías válidas
      price: parseFloat(price),
      discount,
      shortDescription,
      longDescription,
      featured,
      visible,
      stock,
      img,
      brand,
      slug: uniqueSlug, // Usar el slug único
      sku: await generateSequentialSku("products"),
      relatedProds: validRelatedSkus.length > 0 ? validRelatedSkus : [],
      gallery: [] // Asignar SKU de productos relacionados, o array vacío
    };

    // Verificar que existan subcategorías válidas antes de crear el producto
    if (validSubcategories.length === 0) {
      return NextResponse.json(
        { message: 'Error: No hay subcategorías válidas' },
        { status: 400 }
      );
    }

    // Crear el producto en Firestore
    await addDoc(collection(db, 'products'), productData);

    return NextResponse.json(
      { message: 'Product created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: 'Error creating product', error: error.message },
      { status: 500 }
    );
  }
};
