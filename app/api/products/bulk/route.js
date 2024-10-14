// app/api/products/bulk/route.js

import { NextResponse } from 'next/server';
import { getDocs, collection, addDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { cookies } from "next/headers";
import { authAdmin } from '@/firebase/authManager';
import { categoryExists } from '@/utils/categoryExists'; 
import { subcategoryExists } from '@/utils/subcategoryExits'; 
import { productExists } from '@/utils/productExits';
import { createSlug, slugExists } from '@/utils/createSlug';
import { generateSequentialSku } from '@/utils/createSku';

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

    // Obtener datos de la solicitud
    const products = await req.json();

    // Recorrer la lista de productos y agregarlos a Firestore
    for (const product of products) {
      // Validar si la categoría existe
      const category = product.category;

      if (!await categoryExists(category)) {
        return NextResponse.json(
          { message: `Category ${category} does not exist` },
          { status: 400 }
        );
      }

      // Validar si todas las subcategorías existen
      const subcategories = product.subcategory || [];
      for (const subcategory of subcategories) {
        if (!await subcategoryExists(subcategory)) {
          return NextResponse.json(
            { message: `Subcategory ${subcategory} does not exist in ${category}` },
            { status: 400 }
          );
        }
      }

      // Validar si el producto ya existe
      if (await productExists(product.slug)) {
        return NextResponse.json(
          { message: `Product ${product.slug} already exists` },
          { status: 400 }
        );
      }

      // Crear slug a partir del título
      const uniqueSlug = await createSlug(product.name, slugExists);
      const productSku = await generateSequentialSku("products")
      product.slug = uniqueSlug;
      product.sku = productSku;
      const newProduct = { ...product };

      // Agregar el producto a Firestore
      await addDoc(collection(db, 'products'), newProduct);
    }

    return NextResponse.json({ message: 'Products added successfully' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
};
