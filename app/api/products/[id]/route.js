import { NextResponse } from 'next/server';
import { db } from '@/firebase/config';
import { doc, deleteDoc,getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/firebase/config';

export const GET = async (req, { params }) => {
  const { id } = params;

  try {
    // Obtiene el documento de la colección 'products'
    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return NextResponse.json(
        { product: docSnap.data() },
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

export const PATCH = async (req, { params }) => {
  const { id } = params;
  const formData = await req.formData();

  try {
    // Obtener el documento del producto actual
    const productDoc = await getDoc(doc(db, 'products', id));
    if (!productDoc.exists()) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }

    console.log(formData)

    const updates = {};
    const name = formData.get('name');
    const category = formData.get('category');
    const price = formData.get('price');
    const description = formData.get('description');
    const featured = formData.get('featured') === 'true';
    const visible = formData.get('visible') === 'true';
    const stock = formData.get('stock') === 'true';
    const file = formData.get('thumbnail');

    // Solo añadir al objeto de actualizaciones si existe el campo
    if (name) updates.name = name;
    if (category) updates.category = category;
    if (price) updates.price = parseFloat(price);
    if (description) updates.description = description;
    if (featured !== undefined) updates.featured = featured;
    if (visible !== undefined) updates.visible = visible;
    if (stock !== undefined) updates.stock = stock;

    console.log(updates)
    console.log(file)
    // Subir la imagen a Firebase Storage si existe
    if (file && file.size > 0) { // Verificar si se ha seleccionado un archivo válido
      const storageRef = ref(storage, `ProductImg/${file.name}`);
      await uploadBytes(storageRef, file);
      const img = await getDownloadURL(storageRef);
      updates.img = img; // Añadir la URL de la imagen a las actualizaciones
    }
    console.log(updates)
    // Actualizar el documento en Firestore
    await updateDoc(doc(db, 'products', id), updates);

    return NextResponse.json(
      { message: 'Product updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.log(error)

    return NextResponse.json(
      { message: 'Error updating product', error: error.message },
      { status: 500 }
    );
  }
};

export const DELETE = async (req, { params }) => {
  const { id } = params;

  try {
    // Elimina el documento de la colección 'products'
    await deleteDoc(doc(db, 'products', id));

    return NextResponse.json(
      { message: 'Producto eliminado exitosamente' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Error al eliminar el producto', error: error.message },
      { status: 500 }
    );
  }
};
