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
export const GET = async (req) => {
  try {
    const collectionRef = collection(db, 'products');
    const productsSnapshot = await getDocs(collectionRef);
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

    const formData = await req.formData();
    const name = formData.get('name');
    const category = formData.get('category');
    const subcategories = formData.getAll('subcategory');
    let price = parseFloat(formData.get('price'));
    let discount = parseFloat(formData.get('discount')) || 0;
    const shortDescription = formData.get('shortDescription');
    const longDescription = formData.get('longDescription');
    const featured = formData.get('featured') === 'true';
    const visible = formData.get('visible') === 'true';
    const stock = formData.get('stock') === 'true';
    let img = formData.get('img');
    const brand = formData.get('brand');
    const relatedSkus = formData.getAll('relatedSkus') || [];
    console.log(subcategories)

    // Validaciones
    if (!name || name.length < 3 || name.length > 70) {
      return NextResponse.json(
        { message: 'Error: El nombre debe tener entre 3 y 70 caracteres' },
        { status: 400 }
      );
    }

    if (shortDescription && shortDescription.length > 30) {
      return NextResponse.json(
        { message: 'Error: La descripción corta no puede superar los 30 caracteres' },
        { status: 400 }
      );
    }

    if (longDescription && longDescription.length > 500) {
      return NextResponse.json(
        { message: 'Error: La descripción larga no puede superar los 500 caracteres' },
        { status: 400 }
      );
    }

    if (typeof featured !== 'boolean' || typeof visible !== 'boolean' || typeof stock !== 'boolean') {
      return NextResponse.json(
        { message: 'Error: Los valores de featured, visible y stock deben ser booleanos' },
        { status: 400 }
      );
    }

    if (isNaN(price) || price <= 0) {
      return NextResponse.json(
        { message: 'Error: El precio es requerido y debe ser un número mayor a 0' },
        { status: 400 }
      );
    }

    if (isNaN(discount) || discount < 0) {
      discount = 0;
    }

    // Ajustar precio y descuento a formato decimal
    price = parseFloat(price.toFixed(2));
    discount = parseFloat(discount.toFixed(2));

    const categoryExistsCheck = await categoryExists(category);
    if (!categoryExistsCheck) {
      return NextResponse.json(
        { message: 'Error: La categoría no existe' },
        { status: 400 }
      );
    }

    const validSubcategories = [];
    for (const subcategory of subcategories) {
      const exists = await subcategoryExists(category, subcategory);
      if (exists) {
        validSubcategories.push(subcategory);
      }
    }

    const validRelatedSkus = [];
    for (const sku of relatedSkus) {
      const exists = await productExists(sku);
      if (exists) {
        validRelatedSkus.push(sku);
      }
    }

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

    const uniqueSlug = await createSlug(name, slugExists);

    const productData = {
      name,
      category,
      subcategory: validSubcategories,
      price,
      discount,
      shortDescription,
      longDescription,
      featured,
      visible,
      stock,
      img,
      brand,
      slug: uniqueSlug,
      sku: await generateSequentialSku("products"),
      relatedProds: validRelatedSkus.length > 0 ? validRelatedSkus : [],
      gallery: []
    };

    const newProduct = await addDoc(collection(db, 'products'), productData);

    return NextResponse.json(
      { 
        message: 'Product created successfully', 
        product: { id: newProduct.id, ...productData } // Incluye el ID y los datos del producto
      },
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
