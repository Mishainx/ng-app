import { NextResponse } from 'next/server';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db, storage } from '@/firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { cookies } from 'next/headers';
import { authAdmin } from '@/firebase/authManager';
import { createSlug, slugExists } from '@/utils/createSlug';

// `GET` para obtener los valores actuales de las categorías
export const GET = async () => {
  try {
    const categoriesSnapshot = await getDocs(collection(db, 'categories'));
    const categories = categoriesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(
      { message: 'success', payload: categories },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching categories', error: error.message },
      { status: 500 }
    );
  }
};

// `POST` para crear una nueva categoría
export const POST = async (req) => {
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
      return NextResponse.json(
        { message: 'Unauthorized: Invalid token' },
        { status: 401 }
      );
    }

    // Obtener el FormData de la solicitud
    const formData = await req.formData();

    // Extraer datos de la categoría desde FormData
    const title = formData.get('title');
    const imgFile = formData.get('img'); // Archivo de imagen principal
    const iconFile = formData.get('icon'); // Archivo del ícono
    let createdAt = formData.get('createdAt');
    const showInMenu = formData.get('showInMenu') // La fecha como string

    // Validar los datos
    if (!title || typeof title !== 'string' || title.length > 40) {
      return NextResponse.json(
        { message: 'Validation errors: Title is required, must be a string, and cannot exceed 40 characters' },
        { status: 400 }
      );
    }

      // Validar el campo showInMenu: debe ser "true" o "false"
  if (showInMenu !== 'true' && showInMenu !== 'false') {
    return NextResponse.json(
      { message: 'Validation error: showInMenu must be either "true" or "false"' },
      { status: 400 }
    );
  }

  // Convertir showInMenu a booleano
  const showInMenuBool = showInMenu === 'true';

    if (!imgFile || !(imgFile instanceof Blob)) {
      return NextResponse.json(
        { message: 'Validation error: Image file is required and must be a valid file' },
        { status: 400 }
      );
    }

    if (!iconFile || !(iconFile instanceof Blob)) {
      return NextResponse.json(
        { message: 'Validation error: Icon file is required and must be a valid file' },
        { status: 400 }
      );
    }

    // Validar el tipo y tamaño del archivo
    const validMimeTypes = ['image/jpeg', 'image/png'];
    if (!validMimeTypes.includes(imgFile.type) || imgFile.size > 5 * 1920 * 1080) {
      return NextResponse.json(
        { message: 'Invalid image file: Must be a JPEG or PNG and less than 5MB' },
        { status: 400 }
      );
    }

    if (!validMimeTypes.includes(iconFile.type) || iconFile.size > 5 * 400 * 400) {
      return NextResponse.json(
        { message: 'Invalid icon file: Must be a JPEG or PNG and less than 5MB' },
        { status: 400 }
      );
    }

    // Si no se proporciona la fecha, usar la fecha actual
    if (!createdAt) {
      createdAt = new Date().toISOString(); // Formato ISO
    }

    // Generar el slug a partir del título
    const uniqueSlug = await createSlug(title, slugExists);

    // Subir la imagen principal a Firebase Storage
    const imgStorageRef = ref(storage, `categories/${imgFile.name}`);
    await uploadBytes(imgStorageRef, imgFile);
    const imgUrl = await getDownloadURL(imgStorageRef);

    // Subir el icono a Firebase Storage
    const iconStorageRef = ref(storage, `categories/icon_${iconFile.name}`);
    await uploadBytes(iconStorageRef, iconFile);
    const iconUrl = await getDownloadURL(iconStorageRef);

    // Añadir el nuevo documento a la colección
    const docRef = await addDoc(collection(db, 'categories'), {
      title: title,
      img: imgUrl,
      icon: iconUrl,
      slug: uniqueSlug, // Añadir el slug al documento
      subcategories: [],
      createdAt: createdAt,
      showInMenu: showInMenuBool,
    });

    return NextResponse.json(
      { message: 'Category created successfully', id: docRef.id },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { message: 'Error creating category', error: error.message },
      { status: 500 }
    );
  }
};
