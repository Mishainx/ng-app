import { NextResponse } from "next/server";
import { db } from "@/firebase/config";
import { doc, getDoc, updateDoc,  query, where, getDocs, collection } from "firebase/firestore";
import { cookies } from "next/headers";
import { authAdmin } from "@/firebase/authManager";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Asegúrate de tener estos métodos importados
import { storage } from "@/firebase/config";

// Función para validar que el id y el slug son válidos
const isValidFirestoreId = (id) => /^[a-zA-Z0-9]{20}$/.test(id);
const isValidSlug = (slug) => /^[a-zA-Z0-9\-]+$/.test(slug);  // slug puede contener letras, números y guiones

// Endpoint GET para obtener una subcategoría específica por slug
export const GET = async (req, { params }) => {
  const { id, slug } = await params;

  if (!isValidFirestoreId(id) || !isValidSlug(slug)) {
    return NextResponse.json({ message: 'ID o slug inválido proporcionado' }, { status: 400 });
  }

  try {
    // Obtener la categoría
    const categoryRef = doc(db, 'categories', id);
    const categoryDoc = await getDoc(categoryRef);

    if (!categoryDoc.exists()) {
      return NextResponse.json({ message: 'Categoría no encontrada' }, { status: 404 });
    }

    const categoryData = categoryDoc.data();
    const subcategories = categoryData.subcategory;
    console.log(categoryData)
    console.log(subcategories)
    // Buscar la subcategoría con el slug especificado
    const subcategory = subcategories.find((sub) => sub.slug === slug);

    if (!subcategory) {
      return NextResponse.json({ message: 'Subcategoría no encontrada' }, { status: 404 });
    }

    return NextResponse.json({ message: 'success', payload: subcategory }, { status: 200 });
  } catch (error) {
    console.error('Error al obtener la subcategoría:', error);
    return NextResponse.json({ message: 'Error al obtener la subcategoría', error: error.message }, { status: 500 });
  }
};

// Endpoint POST para crear una subcategoría dentro de `subcategory2`
// Endpoint POST para crear una subcategoría dentro de `subcategory2`
export const POST = async (req, { params }) => {
  const { id, slug } = await params;

  // Validar ID de Firestore y slug
  if (!isValidFirestoreId(id) || !isValidSlug(slug)) {
    return NextResponse.json({ message: 'ID o slug inválido proporcionado' }, { status: 400 });
  }

  // Obtener las cookies y el token
  const cookieStore = await cookies();
  const cookie = cookieStore.get('ng-ct');

  if (!cookie || !cookie.value) {
    return NextResponse.json({ message: 'Unauthorized: No token provided' }, { status: 401 });
  }

  const token = cookie.value;

  // Verificar el token con Firebase Admin SDK
  let decodedToken;
  try {
    decodedToken = await authAdmin.verifyIdToken(token);
  } catch (error) {
    console.error('Error al verificar el token:', error);
    return NextResponse.json({ message: 'Unauthorized: Invalid token' }, { status: 401 });
  }

  // Verificar si el usuario tiene privilegios de admin
  if (!decodedToken.admin) {
    return NextResponse.json(
      { message: 'Unauthorized: Admin privileges required' },
      { status: 403 } // 403 Forbidden es adecuado para una solicitud que no tiene permiso
    );
  }

  // Obtener el FormData de la solicitud
  const formData = await req.formData();
  const title = formData.get('title');
  let createdAt = formData.get('createdAt');

  // Validar los datos
  if (!title || typeof title !== 'string' || title.length > 40) {
    return NextResponse.json({ message: 'Validation errors: Title is required, must be a string, and cannot exceed 40 characters' }, { status: 400 });
  }

  // Si no se proporciona la fecha, usar la fecha actual
  if (!createdAt) {
    createdAt = new Date().toISOString(); // Formato ISO
  }

  try {
    // Referencia a la categoría en Firestore
    const categoryRef = doc(db, 'categories', id);
    const categoryDoc = await getDoc(categoryRef);

    if (!categoryDoc.exists()) {
      return NextResponse.json({ message: 'Categoría no encontrada' }, { status: 404 });
    }

    const categoryData = categoryDoc.data();
    const subcategories = categoryData.subcategory;

    // Buscar la subcategoría principal por slug
    const subcategory = subcategories.find((sub) => sub.slug === slug);
    if (!subcategory) {
      return NextResponse.json({ message: 'Subcategoría no encontrada' }, { status: 404 });
    }

    // Generar el slug para la subcategoría secundaria
    const subcategory2Slug = `${slug}-${title.replace(/\s+/g, '-').toLowerCase()}`;

    // Verificar si ya existe una subcategoría secundaria con el mismo slug
    const existingSubcategory2 = subcategory.subcategory2?.find((sub) => sub.slug === subcategory2Slug);
    if (existingSubcategory2) {
      return NextResponse.json({ message: 'Subcategoría secundaria con el mismo slug ya existe' }, { status: 400 });
    }

    // Crear la subcategoría secundaria
    const newSubcategory2 = {
      title,
      slug: subcategory2Slug,
      createdAt,
    };

    // Actualizar la subcategoría existente con la nueva subcategoría secundaria
    const updatedSubcategories = subcategories.map((sub) =>
      sub.slug === slug
        ? { ...sub, subcategory2: [...(sub.subcategory2 || []), newSubcategory2] }
        : sub
    );

    await updateDoc(categoryRef, {
      subcategory: updatedSubcategories,
    });

    return NextResponse.json({ message: 'Subcategoría secundaria creada con éxito' }, { status: 201 });
  } catch (error) {
    console.error('Error al crear la subcategoría secundaria:', error);
    return NextResponse.json({ message: 'Error al crear la subcategoría secundaria', error: error.message }, { status: 500 });
  }
};

// Endpoint DELETE para eliminar una subcategoría
export const DELETE = async (req, { params }) => {
  const { categorySlug, subcategorySlug } = params;

  // Validar slug de categoría y subcategoría
  if (!isValidSlug(categorySlug) || !isValidSlug(subcategorySlug)) {
    return NextResponse.json({ message: 'Slug de categoría o subcategoría inválido' }, { status: 400 });
  }

  // Obtener las cookies y el token
  const cookieStore = await cookies();
  const cookie = cookieStore.get('ng-ct');

  if (!cookie || !cookie.value) {
    return NextResponse.json({ message: 'Unauthorized: No token provided' }, { status: 401 });
  }

  const token = cookie.value;

  // Verificar el token con Firebase Admin SDK
  let decodedToken;
  try {
    decodedToken = await authAdmin.verifyIdToken(token);
  } catch (error) {
    console.error('Error al verificar el token:', error);
    return NextResponse.json({ message: 'Unauthorized: Invalid token' }, { status: 401 });
  }

  // Verificar si el usuario tiene privilegios de admin
  if (!decodedToken.admin) {
    return NextResponse.json(
      { message: 'Unauthorized: Admin privileges required' },
      { status: 403 } // 403 Forbidden es adecuado para una solicitud que no tiene permiso
    );
  }

  try {
    // Crear la consulta para obtener la categoría por su slug
    const categoryQuery = query(
      collection(db, 'categories'),
      where('slug', '==', categorySlug)
    );

    // Ejecutar la consulta
    const categorySnapshot = await getDocs(categoryQuery);

    if (categorySnapshot.empty) {
      return NextResponse.json({ message: 'Categoría no encontrada' }, { status: 404 });
    }

    // Obtener el primer documento de la categoría, ya que esperamos que el slug sea único
    const categoryDoc = categorySnapshot.docs[0];
    const categoryData = categoryDoc.data();
    const subcategories = categoryData.subcategories; // Accedemos a las subcategorías

    // Buscar la subcategoría que corresponde al slug
    const subcategoryIndex = subcategories.findIndex((sub) => sub.slug === subcategorySlug);
    if (subcategoryIndex === -1) {
      return NextResponse.json({ message: 'Subcategoría no encontrada' }, { status: 404 });
    }

    // Eliminar la subcategoría del array
    subcategories.splice(subcategoryIndex, 1);

    // Actualizar el documento de la categoría con la subcategoría eliminada
    await updateDoc(categoryDoc.ref, {
      subcategories, // Actualizamos el array de subcategorías con el cambio
    });

    return NextResponse.json({ message: 'Subcategoría eliminada con éxito' }, { status: 200 });
  } catch (error) {
    console.error('Error al eliminar la subcategoría:', error);
    return NextResponse.json({ message: 'Error al eliminar la subcategoría', error: error.message }, { status: 500 });
  }
};

// Endpoint PUT para actualizar una subcategoría específica dentro de una categoría
export const PUT = async (req, { params }) => {
  const { categorySlug, subcategorySlug } = params;

  // Validar slugs
  if (!isValidSlug(categorySlug) || !isValidSlug(subcategorySlug)) {
    return NextResponse.json({ message: 'Slugs inválidos proporcionados' }, { status: 400 });
  }

  // Obtener las cookies y el token
  const cookieStore = await cookies();
  const cookie = cookieStore.get('ng-ct');

  if (!cookie || !cookie.value) {
    return NextResponse.json({ message: 'Unauthorized: No token provided' }, { status: 401 });
  }

  const token = cookie.value;

  // Verificar el token con Firebase Admin SDK
  let decodedToken;
  try {
    decodedToken = await authAdmin.verifyIdToken(token);
  } catch (error) {
    console.error('Error al verificar el token:', error);
    return NextResponse.json({ message: 'Unauthorized: Invalid token' }, { status: 401 });
  }

  // Verificar si el usuario tiene privilegios de admin
  if (!decodedToken.admin) {
    return NextResponse.json(
      { message: 'Unauthorized: Admin privileges required' },
      { status: 403 }
    );
  }

  try {
    // Obtener el FormData de la solicitud
    const formData = await req.formData();
    const title = formData.get('title');
    const showInMenu = formData.has('showInMenu') ? formData.get('showInMenu') === 'true' : undefined;
    const img = formData.get('img');
    const icon = formData.get('icon');

    // Validar los datos
    if (title && (typeof title !== 'string' || title.length > 40)) {
      return NextResponse.json(
        { message: 'Title must be a string and cannot exceed 40 characters' },
        { status: 400 }
      );
    }

    // Buscar la categoría por su slug
    const categoryQuery = query(
      collection(db, 'categories'),
      where('slug', '==', categorySlug)
    );

    const categorySnapshot = await getDocs(categoryQuery);

    if (categorySnapshot.empty) {
      return NextResponse.json({ message: 'Categoría no encontrada' }, { status: 404 });
    }

    // Suponemos que el slug de la categoría es único, así que tomamos el primer documento
    const categoryDoc = categorySnapshot.docs[0];
    const categoryRef = categoryDoc.ref;
    const categoryData = categoryDoc.data();
    const subcategories = categoryData.subcategories || [];

    // Buscar la subcategoría por slug
    const subcategoryIndex = subcategories.findIndex((sub) => sub.slug === subcategorySlug);

    if (subcategoryIndex === -1) {
      return NextResponse.json({ message: 'Subcategoría no encontrada' }, { status: 404 });
    }

    // Obtener la subcategoría actual
    const updatedSubcategory = { ...subcategories[subcategoryIndex] };

    // Solo actualiza los campos si tienen un valor válido
    if (title) updatedSubcategory.title = title;
    if (showInMenu !== undefined) updatedSubcategory.showInMenu = showInMenu;

    // Subir imagen o ícono si están presentes en el formulario
    if (img !== null && img !== 'null') {
      const imgStorageRef = ref(storage, `subcategories/${img.name}`);
      await uploadBytes(imgStorageRef, img);
      const imgUrl = await getDownloadURL(imgStorageRef);
      updatedSubcategory.img = imgUrl; // Guardamos la URL de la imagen
    }

    if (icon !== null && icon !== 'null') {
      const iconStorageRef = ref(storage, `subcategories/icons/${icon.name}`);
      await uploadBytes(iconStorageRef, icon);
      const iconUrl = await getDownloadURL(iconStorageRef);
      updatedSubcategory.icon = iconUrl; // Guardamos la URL del ícono
    }

    // Reemplazar la subcategoría actualizada
    const updatedSubcategories = [...subcategories];
    updatedSubcategories[subcategoryIndex] = updatedSubcategory;

    // Actualizar en Firestore
    await updateDoc(categoryRef, {
      subcategories: updatedSubcategories,
    });

    return NextResponse.json(
      { message: 'Subcategoría actualizada con éxito', payload: updatedSubcategory },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al actualizar la subcategoría:', error);
    return NextResponse.json(
      { message: 'Error al actualizar la subcategoría', error: error.message },
      { status: 500 }
    );
  }
};
