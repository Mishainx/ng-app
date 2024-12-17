import { NextResponse } from "next/server";
import { db } from "@/firebase/config";
import { collection, getDocs, query, where, deleteDoc,doc, updateDoc, getDoc } from 'firebase/firestore';
import { cookies } from "next/headers";
import { authAdmin } from "@/firebase/authManager";

// Función para validar que el slug es una cadena válida
const isValidSlug = (categorySlug) => typeof categorySlug === 'string' && categorySlug.length > 0;

export const GET = async (req, { params }) => {
  const { categorySlug } = params;  // Obtén el slug del objeto params
  // Verifica si el slug es válido antes de continuar
  if (!isValidSlug(categorySlug)) {
    return NextResponse.json(
      { message: 'Slug inválido proporcionado' },
      { status: 400 }
    );
  }
  
  try {
    // Crear una consulta para buscar la categoría por slug
    const categoryQuery = query(collection(db, 'categories'), where('slug', '==', categorySlug));
    const categorySnapshot = await getDocs(categoryQuery);

    if (categorySnapshot.empty) {  // Verifica si la categoría existe
      return NextResponse.json(
        { message: 'Categoría no encontrada' },
        { status: 404 }
      );
    }

    const categoryData = categorySnapshot.docs[0].data();  // Obtén los datos de la categoría
    const categoryId = categorySnapshot.docs[0].id; // Guardamos el ID del documento

    return NextResponse.json(
      { message: 'success', payload: { id: categoryId, ...categoryData } },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al obtener la categoría:', error);  // Manejo de errores
    return NextResponse.json(
      { message: 'Error al obtener la categoría', error: error.message },
      { status: 500 }
    );
  }
};

// `DELETE` para eliminar una categoría recibiendo el slug en los params
export const DELETE = async (req, { params }) => {
  const { categorySlug } = params;

  // Verificar si el slug es válido antes de continuar
  if (!isValidSlug(categorySlug)) {
    return NextResponse.json(
      { message: 'Slug inválido proporcionado' },
      { status: 400 }
    );
  }

  try {
    // Obtener las cookies y el token
    const cookieStore = cookies();
    const cookie = cookieStore.get('ng-ct');

    if (!cookie || !cookie.value) {
      return NextResponse.json(
        { message: 'Unauthorized: No token provided' },
        { status: 401 }
      );
    }

    const token = cookie.value;

    // Verificar el token con Firebase Admin SDK
    let decodedToken;
    try {
      decodedToken = await authAdmin.verifyIdToken(token);
    } catch (error) {
      console.log(error);
      return NextResponse.json(
        { message: 'Unauthorized: Invalid token' },
        { status: 401 }
      );
    }

                // Verifica si el usuario tiene privilegios de admin
                if (!decodedToken.admin) {
                  return NextResponse.json(
                    { message: 'Unauthorized: Admin privileges required' },
                    { status: 403 } // 403 Forbidden es adecuado para una solicitud que no tiene permiso
                  );
                }

    // Crear una consulta para buscar la categoría por slug
    const categoryQuery = query(collection(db, 'categories'), where('slug', '==', categorySlug));
    const categorySnapshot = await getDocs(categoryQuery);

    if (categorySnapshot.empty) {  // Verifica si la categoría existe
      return NextResponse.json(
        { message: 'Categoría no encontrada' },
        { status: 404 }
      );
    }

    const categoryId = categorySnapshot.docs[0].id; // Guardamos el ID del documento

    // Eliminar la categoría
    await deleteDoc(doc(db, 'categories', categoryId));

    return NextResponse.json(
      { message: 'Categoría eliminada con éxito' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al eliminar la categoría:', error);  // Manejo de errores
    return NextResponse.json(
      { message: 'Error al eliminar la categoría', error: error.message },
      { status: 500 }
    );
  }
};


export const PUT = async (req, { params }) => {
  const { categorySlug } = params;  // Obtén el slug del objeto params

  // Verifica si el slug es válido antes de continuar
  if (!isValidSlug(categorySlug)) {
    return NextResponse.json(
      { message: 'Slug inválido proporcionado' },
      { status: 400 }
    );
  }

  try {
    // Obtener las cookies y el token
    const cookieStore = cookies();
    const cookie = cookieStore.get('ng-ct');

    if (!cookie || !cookie.value) {
      return NextResponse.json(
        { message: 'Unauthorized: No token provided' },
        { status: 401 }
      );
    }

    const token = cookie.value;

    // Verificar el token con Firebase Admin SDK
    let decodedToken;
    try {
      decodedToken = await authAdmin.verifyIdToken(token);
    } catch (error) {
      console.log(error);
      return NextResponse.json(
        { message: 'Unauthorized: Invalid token' },
        { status: 401 }
      );
    }

    // Verifica si el usuario tiene privilegios de admin
    if (!decodedToken.admin) {
      return NextResponse.json(
        { message: 'Unauthorized: Admin privileges required' },
        { status: 403 }
      );
    }

    // Obtener el FormData de la solicitud
    const formData = await req.formData();
    const title = formData.get('title');
    const imgFile = formData.get('img'); // Archivo de imagen principal
    const iconFile = formData.get('icon'); // Archivo del ícono Opcional, solo si deseas actualizar la descripción
    const showInMenu = formData.get('showInMenu') === 'true';

    // Validar los datos
    if (!title || typeof title !== 'string' || title.length > 100) {
      return NextResponse.json({ message: 'Validation errors: Title is required, must be a string, and cannot exceed 100 characters' }, { status: 400 });
    }

    // Crear una consulta para buscar la categoría por slug
    const categoryQuery = query(collection(db, 'categories'), where('slug', '==', categorySlug));
    const categorySnapshot = await getDocs(categoryQuery);

    if (categorySnapshot.empty) {
      return NextResponse.json(
        { message: 'Categoría no encontrada' },
        { status: 404 }
      );
    }

    const categoryId = categorySnapshot.docs[0].id;  // Guardamos el ID del documento

    // Referencia al documento de la categoría
    const categoryRef = doc(db, 'categories', categoryId);
    const categoryDoc = await getDoc(categoryRef);

    if (!categoryDoc.exists()) {
      return NextResponse.json({ message: 'Categoría no encontrada' }, { status: 404 });
    }

    // Construir el objeto de actualización
    const updatedCategory = {
      title,
      updatedAt: new Date().toISOString(),
      showInMenu,
    };

    // Solo actualizamos el imgFile si se proporcionó
    if (imgFile) {
      updatedCategory.imgFile = imgFile;
    }

    // Solo actualizamos el iconFile si se proporcionó
    if (iconFile) {
      updatedCategory.iconFile = iconFile;
    }

    // Actualizar el documento en Firestore
    await updateDoc(categoryRef, updatedCategory);

    return NextResponse.json(
      { message: 'Categoría actualizada con éxito' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al actualizar la categoría:', error);
    return NextResponse.json(
      { message: 'Error al actualizar la categoría', error: error.message },
      { status: 500 }
    );
  }
};
