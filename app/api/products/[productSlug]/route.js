import { NextResponse } from 'next/server';
import { db } from '@/firebase/config';
import { collection, query, where, getDocs, updateDoc, doc,deleteDoc } from 'firebase/firestore';
import { createSlug,slugExists } from '@/utils/createSlug';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/firebase/config';

export const GET = async (req, { params }) => {
  const { productSlug } = params;

  try {
    // Crear una consulta para buscar el documento con el SKU especificado
    const productsRef = collection(db, 'products');
    const q = query(productsRef, where('slug', '==', productSlug));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Si se encuentra el producto, devolver los datos del primer documento encontrado
      const productData = querySnapshot.docs[0].data();
      return NextResponse.json(
        { payload: productData },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: 'Producto no encontrado' },
        { status: 404 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: 'Error al recuperar el producto', error: error.message },
      { status: 500 }
    );
  }
};

export const DELETE = async (req, { params }) => {
  const { productSlug } = params;

  try {
    // Crear una consulta para buscar el documento con el slug especificado
    const productsRef = collection(db, 'products');
    const q = query(productsRef, where('slug', '==', productSlug));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Si se encuentra el producto, obtener la referencia del primer documento encontrado
      const productDoc = querySnapshot.docs[0];
      const productDocRef = doc(db, 'products', productDoc.id);

      // Eliminar el documento
      await deleteDoc(productDocRef);

      return NextResponse.json(
        { message: 'Producto eliminado correctamente' },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: 'Producto no encontrado' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.log(error)

    return NextResponse.json(
      { message: 'Error al eliminar el producto', error: error.message },
      { status: 500 }
    );
  }
};

export const PUT = async (req, { params }) => {
  const { productSlug } = params;

  try {
    const formData = await req.formData(); // Leer FormData de la solicitud
    const updatedData = {};
    let file = null;

    // Iterar sobre los campos de FormData
    formData.forEach((value, key) => {
      if (key === "img") {
        file = value; // Asumimos que es un archivo
      } else if (key === "subcategory") {
        if (!updatedData[key]) {
          updatedData[key] = [];
        }
        updatedData[key].push(value); // Manejar múltiples subcategorías
      } else {
        updatedData[key] = value;
      }
    });

    const productsRef = collection(db, "products");
    const q = query(productsRef, where("slug", "==", productSlug));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const productDoc = querySnapshot.docs[0];
      const productDocRef = doc(db, "products", productDoc.id);

      // Manejar cambios de slug
      if (updatedData.name && updatedData.name !== productDoc.data().name) {
        const uniqueSlug = await createSlug(updatedData.name, slugExists);
        updatedData.slug = uniqueSlug;
      }

      // Subir el archivo si existe
      if (file) {
        console.log(file)
        const storageRef = ref(storage, `ProductImg/${file.name}`);
        await uploadBytes(storageRef, file);
        updatedData.img = await getDownloadURL(storageRef);
      }

      // Actualizar documento
      await updateDoc(productDocRef, updatedData);

      return NextResponse.json(
        { message: "Producto actualizado correctamente", payload: updatedData },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Producto no encontrado" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error al actualizar el producto", error: error.message },
      { status: 500 }
    );
  }
};