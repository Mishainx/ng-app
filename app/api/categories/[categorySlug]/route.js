import { NextResponse } from "next/server";
import { db, storage } from "@/firebase/config";
import { collection, getDocs, query, where, deleteDoc,doc, updateDoc, getDoc } from 'firebase/firestore';
import { cookies } from "next/headers";
import { authAdmin } from "@/firebase/authManager";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Función para validar que el slug es una cadena válida
const isValidSlug = (categorySlug) => typeof categorySlug === 'string' && categorySlug.length > 0;

export const GET = async (req, { params }) => {
  const { categorySlug } = await params;  // Obtén el slug del objeto params
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
  const { categorySlug } = await params;

  // Verificar si el slug es válido antes de continuar
  if (!isValidSlug(categorySlug)) {
    return NextResponse.json(
      { message: 'Slug inválido proporcionado' },
      { status: 400 }
    );
  }

  try {
    // Obtener las cookies y el token
    const cookieStore = await cookies();
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
  const { categorySlug } = await params; // Obtén el slug del objeto params
  // Verifica si el slug es válido antes de continuar
  if (!isValidSlug(categorySlug)) {
    return NextResponse.json(
      { message: 'Slug inválido proporcionado' },
      { status: 400 }
    );
  }

  try {
    // Obtener las cookies y el token
    const cookieStore = await cookies();
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
    const description = formData.get('description'); // Nuevo campo de descripción
    const img = formData.get('img'); // Archivo de imagen principal
    const icon = formData.get('icon'); // Archivo del ícono
    const showInMenu = formData.get('showInMenu') === 'true';

    // Validar los datos
    if (!title || typeof title !== 'string' || title.length > 100) {
      return NextResponse.json(
        { message: 'Validation errors: Title is required, must be a string, and cannot exceed 100 characters' },
        { status: 400 }
      );
    }

    if (description && typeof description !== 'string') {
      return NextResponse.json(
        { message: 'Validation errors: Description must be a string' },
        { status: 400 }
      );
    }

    if (description && description.length > 100) {
      return NextResponse.json(
        { message: 'Validation errors: Description cannot exceed 100 characters' },
        { status: 400 }
      );
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

    const categoryId = categorySnapshot.docs[0].id; // Guardamos el ID del documento
    const categoryRef = doc(db, 'categories', categoryId);

    // Construir el objeto de actualización solo con campos proporcionados
    const updatedCategory = {
      ...(title && { title }),
      ...(description && { description }), // Incluir descripción si está presente
      ...(showInMenu !== undefined && { showInMenu }),
      updatedAt: new Date().toISOString(),
    };

    // Subir las imágenes a Firebase Storage si están presentes
    if (img && img instanceof Blob && img.size > 0) {
      const imgStorageRef = ref(storage, `categories/${img.name}`);
      await uploadBytes(imgStorageRef, img);
      const imgUrl = await getDownloadURL(imgStorageRef);
      updatedCategory.img = imgUrl; // Guardar la URL en el documento
    }

    if (icon && icon instanceof Blob && icon.size > 0) {
      const iconStorageRef = ref(storage, `categories/icons/${icon.name}`);
      await uploadBytes(iconStorageRef, icon);
      const iconUrl = await getDownloadURL(iconStorageRef);
      updatedCategory.icon = iconUrl; // Guardar la URL en el documento
    }

    // Actualizar el documento en Firestore con los campos que realmente han cambiado
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
