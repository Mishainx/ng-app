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

    // Extraer datos de la categoría desde FormData
    const title = formData.get('title');
    const description = formData.get('description'); // Nuevo campo
    const imgFile = formData.get('img');
    const iconFile = formData.get('icon');
    let createdAt = formData.get('createdAt');
    const showInMenu = formData.get('showInMenu') === 'true';

    // Validar los datos
    if (!title || typeof title !== 'string' || title.length > 40) {
      return NextResponse.json(
        { message: 'Validation errors: Title is required, must be a string, and cannot exceed 40 characters' },
        { status: 400 }
      );
    }

    if (description && typeof description !== 'string') {
      return NextResponse.json(
        { message: 'Validation error: Description must be a string' },
        { status: 400 }
      );
    }

    if (description && description.length > 100) {
      return NextResponse.json(
        { message: 'Validation error: Description cannot exceed 100 characters' },
        { status: 400 }
      );
    }

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
      createdAt = new Date().toISOString();
    }

    // Generar el slug a partir del título y verificar si ya existe
    const slugExists = async (slug) => {
      const categoryQuerySnapshot = await getDocs(collection(db, 'categories'));
      const categoryDocs = categoryQuerySnapshot.docs;
      return categoryDocs.some(doc => doc.data().slug === slug);
    };

    const uniqueSlug = await createSlug(title, slugExists);
    if (!uniqueSlug) {
      return NextResponse.json({ message: 'Slug already exists, please choose a different title' }, { status: 400 });
    }

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
      title,
      description: description || '', // Guardar descripción o valor por defecto
      img: imgUrl,
      icon: iconUrl,
      slug: uniqueSlug,
      subcategories: [],
      createdAt,
      showInMenu,
    });

    // Obtener los datos del documento creado
    const newCategory = {
      id: docRef.id,
      title,
      description: description || '',
      img: imgUrl,
      icon: iconUrl,
      slug: uniqueSlug,
      subcategories: [],
      createdAt,
      showInMenu,
    };

    return NextResponse.json(
      { message: 'Category created successfully', category: newCategory },
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
