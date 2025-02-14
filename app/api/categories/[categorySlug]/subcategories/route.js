import { NextResponse } from "next/server";
import { db, storage } from "@/firebase/config";
import { doc, getDoc, updateDoc, arrayUnion, query, where, collection, getDocs } from 'firebase/firestore';
import { cookies } from "next/headers";
import { authAdmin } from "@/firebase/authManager";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Función para validar que el slug sigue el formato adecuado (solo minúsculas, números, y guiones)
const isValidSlug = (slug) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);

export const POST = async (req, { params }) => {
  const { categorySlug } = await params;

  // Verificar si el slug es válido antes de continuar
  if (!isValidSlug(categorySlug)) {
    return NextResponse.json(
      { message: 'Slug inválido proporcionado' },
      { status: 400 }
    );
  }

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
    console.error('Error al verificar el token:', error);
    return NextResponse.json(
      { message: 'Unauthorized: Invalid token' },
      { status: 401 }
    );
  }

  // Obtener el FormData de la solicitud
  const formData = await req.formData();

  // Extraer datos de la subcategoría desde FormData
  const title = formData.get('title')?.trim(); // Asegúrate de quitar espacios en blanco
  const img = formData.get('img'); // Archivo de imagen principal (opcional)
  const icon = formData.get('icon'); // Archivo del ícono (opcional)
  let createdAt = formData.get('createdAt');
  const showInMenu = formData.get('showInMenu') === 'true';

  // Validar los datos
  if (!title || typeof title !== 'string' || title.length > 40) {
    return NextResponse.json(
      { message: 'Validation errors: Title is required, must be a string, and cannot exceed 40 characters' },
      { status: 400 }
    );
  }

  // Validar la imagen si está presente
  const validMimeTypes = ['image/jpeg', 'image/png'];
  if (img) {
    if (!(img instanceof Blob)) {
      return NextResponse.json(
        { message: 'Validation error: Image file must be a valid file' },
        { status: 400 }
      );
    }
    if (!validMimeTypes.includes(img.type) || img.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { message: 'Invalid image file: Must be a JPEG or PNG and less than 5MB' },
        { status: 400 }
      );
    }
  }

  // Validar el ícono si está presente
  if (icon) {
    if (!(icon instanceof Blob)) {
      return NextResponse.json(
        { message: 'Validation error: Icon file must be a valid file' },
        { status: 400 }
      );
    }
    if (!validMimeTypes.includes(icon.type) || icon.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { message: 'Invalid icon file: Must be a JPEG or PNG and less than 5MB' },
        { status: 400 }
      );
    }
  }

  // Si no se proporciona la fecha, usar la fecha actual
  if (!createdAt) {
    createdAt = new Date().toISOString(); // Formato ISO
  }

  try {
    // Buscar la categoría por su slug en Firestore
    const categoryQuery = query(collection(db, 'categories'), where('slug', '==', categorySlug));
    const categorySnapshot = await getDocs(categoryQuery);

    if (categorySnapshot.empty) {
      return NextResponse.json(
        { message: 'Category not found' },
        { status: 404 }
      );
    }

    // Tomamos el primer documento que coincide con el slug
    const categoryDoc = categorySnapshot.docs[0];
    const categoryData = categoryDoc.data();
    const categoryRef = doc(db, 'categories', categoryDoc.id); // Referencia al documento en Firestore

    // Generar el slug para la subcategoría
    let subcategorySlug = `${categorySlug}-${title.replace(/\s+/g, '-').toLowerCase()}`;

    // Comprobar si ya existe una subcategoría con el mismo slug
    const existingSubcategories = categoryData.subcategories || [];
    const duplicateSubcategory = existingSubcategories.find(subcat => subcat.slug === subcategorySlug);

    if (duplicateSubcategory) {
      return NextResponse.json(
        { message: 'Ya existe una subcategoria con el slug' },
        { status: 400 }
      );
    }

    // Subir la imagen principal a Firebase Storage si está presente
    let imgUrl = null;
    if (img) {
      const imgStorageRef = ref(storage, `subcategories/${img.name}`);
      await uploadBytes(imgStorageRef, img);
      imgUrl = await getDownloadURL(imgStorageRef);
    }

    // Subir el ícono a Firebase Storage si está presente
    let iconUrl = null;
    if (icon) {
      const iconStorageRef = ref(storage, `subcategories/_icon_${icon.name}`);
      await uploadBytes(iconStorageRef, icon);
      iconUrl = await getDownloadURL(iconStorageRef);
    }

    // Crear la subcategoría en Firestore
    const newSubcategory = {
      title,
      slug: subcategorySlug, // Guardar el slug
      img: imgUrl || null, // Solo se añade si img existe
      icon: iconUrl || null, // Solo se añade si icon existe
      createdAt,
      showInMenu: showInMenu
    };

    // Actualizar el documento para añadir la nueva subcategoría
    await updateDoc(categoryRef, {
      subcategories: arrayUnion(newSubcategory),
    });

    // Devolver la subcategoría creada en la respuesta
    return NextResponse.json(
      { message: 'Subcategory created successfully', subcategory: newSubcategory },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error al crear la subcategoría:', error);
    return NextResponse.json(
      { message: 'Error creating subcategory', error: error.message },
      { status: 500 }
    );
  }
};
