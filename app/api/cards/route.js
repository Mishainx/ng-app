// app/api/cards/route.js

import { NextResponse } from 'next/server';
import { getDocs, collection, addDoc } from 'firebase/firestore';
import { db, storage } from '@/firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { authAdmin } from '@/firebase/authManager';
import { cookies } from 'next/headers';

// `GET` para obtener todas las cards
export const GET = async (req) => {
  try {
    const collectionRef = collection(db, 'cards');
    const cardsSnapshot = await getDocs(collectionRef);
    const cards = cardsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(
      { message: 'success', payload: cards },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching cards', error: error.message },
      { status: 500 }
    );
  }
};

// `POST` para crear una nueva card
export const POST = async (req) => {
  try {
    const cookieStore = await cookies();
    const cookie = cookieStore.get('ng-ct');

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

    if (!decodedToken.admin) {
      return NextResponse.json(
        { message: 'Unauthorized: Admin privileges required' },
        { status: 403 }
      );
    }

    // 🔍 Verificar límite de 5 cards
    const cardsRef = collection(db, 'cards');
    const cardsSnapshot = await getDocs(cardsRef);
    if (cardsSnapshot.size >= 20) {
      return NextResponse.json(
        { message: 'No se pueden crear más de 5 cards' },
        { status: 400 }
      );
    }

    const formData = await req.formData();
    const title = formData.get('title');
    const content = formData.get('content');
    const order = parseInt(formData.get('order'));
    const visible = formData.get('visible') === '1';
    const link = formData.get('link');
    const fullPage = formData.get('fullPage') === '1';
    const image1 = formData.get('image1');
    const image2 = formData.get('image2');

    // ✅ Validaciones
    if (!title || title.length < 3 || title.length > 70) {
      return NextResponse.json(
        { message: 'El título debe tener entre 3 y 70 caracteres' },
        { status: 400 }
      );
    }

    if (!content || content.length < 3) {
      return NextResponse.json(
        { message: 'El contenido debe tener al menos 3 caracteres' },
        { status: 400 }
      );
    }

    const isValidUrl = (url) => {
      const pattern = /^(https?:\/\/|\/)[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/;
      return pattern.test(url);
    };

    if (!link || !isValidUrl(link)) {
      return NextResponse.json(
        { message: 'El enlace no es válido' },
        { status: 400 }
      );
    }

    // 🖼️ Subir imagen 1 y verificar que tenga URL
    let image1Url = null;
    if (image1 && image1.name) {
      const timestamp = new Date().getTime(); // Obtener timestamp único
      const storageRef1 = ref(storage, `cardImages/${timestamp}_${image1.name}`);
      await uploadBytes(storageRef1, image1);
      image1Url = await getDownloadURL(storageRef1);
    }

    if (!image1Url) {
      return NextResponse.json(
        { message: 'La imagen principal es obligatoria' },
        { status: 400 }
      );
    }

    // 🖼️ Subir imagen 2 y verificar que tenga URL
    let image2Url = null;
    if (image2 && image2.name) {
      const timestamp = new Date().getTime(); // Obtener timestamp único
      const storageRef2 = ref(storage, `cardImages/${timestamp}_${image2.name}`);
      await uploadBytes(storageRef2, image2);
      image2Url = await getDownloadURL(storageRef2);
    }

    // Datos de la nueva card
    const cardData = {
      title,
      content,
      order,
      link,
      visible,
      fullPage,
      image1Url,
      image2Url,
    };

    // Crear la nueva card en la base de datos
    const newCard = await addDoc(cardsRef, cardData);

    return NextResponse.json(
      { message: 'Card creado correctamente', card: { id: newCard.id, ...cardData } },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: 'Error al crear la card', error: error.message },
      { status: 500 }
    );
  }
};
