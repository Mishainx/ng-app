// app/api/slides/route.js
import { NextResponse } from 'next/server';
import { getDocs, collection, addDoc } from 'firebase/firestore';
import { db, storage } from '@/firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { authAdmin } from '@/firebase/authManager';
import { cookies } from 'next/headers';

// `GET` para obtener todas las slides
export const GET = async (req) => {
  try {
    const collectionRef = collection(db, 'cards'); // Cambiado de 'slides' a 'cards'
    const slidesSnapshot = await getDocs(collectionRef);
    const slides = slidesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(
      { message: 'success', payload: slides },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching cards', error: error.message }, // Cambiado el mensaje de error
      { status: 500 }
    );
  }
};

// `POST` para crear una nueva slide
export const POST = async (req) => {
  try {
    const cookieStore = await cookies();
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

    if (!decodedToken.admin) {
      return NextResponse.json(
        { message: 'Unauthorized: Admin privileges required' },
        { status: 403 }
      );
    }

    // 🔍 Verificar límite de 5 slides
    const cardsRef = collection(db, 'cards'); // Cambiado de 'slides' a 'cards'
    const cardsSnapshot = await getDocs(cardsRef);
    if (cardsSnapshot.size >= 5) {
      return NextResponse.json(
        { message: 'No se pueden crear más de 5 cards' }, // Cambiado el mensaje
        { status: 400 }
      );
    }

    const formData = await req.formData();
    const title = formData.get('title');
    const content = formData.get('content');  // Cambiado 'subtitle' a 'content'
    const order = parseInt(formData.get('order'));
    const visible = (formData.get('visible') === 'true');
    const link = formData.get('link');
    const fullPage = formData.get('fullPage') === 'true';
    const image1 = formData.get('image1');     // Cambiado 'img1' a 'image1'
    const image2 = formData.get('image2');     // Cambiado 'img2' a 'image2'


    // ✅ Validaciones
    if (!title || title.length < 3 || title.length > 70) {
      return NextResponse.json(
        { message: 'El título debe tener entre 3 y 70 caracteres' },
        { status: 400 }
      );
    }

    if (!content || content.length < 3) {  // Cambiado 'subtitle' a 'content'
      return NextResponse.json(
        { message: 'El contenido debe tener al menos 3 caracteres' }, // Cambiado el mensaje
        { status: 400 }
      );
    }

    const isValidUrl = (url) => {
      const pattern = /^(https?:\/\/|\/)[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/;
      return pattern.test(url);
    };

    if (!link || !isValidUrl(link)) {  // Cambiado 'ctaLink' a 'link'
      return NextResponse.json(
        { message: 'El enlace no es válido' },  // Cambiado el mensaje
        { status: 400 }
      );
    }
    // 🖼️ Subir imagen y verificar que tenga URL
    let image1Url = null;
    if (image1 && image1.name) {
      const storageRef1 = ref(storage, `cardImages/${image1.name}`); //cambiado
      await uploadBytes(storageRef1, image1);
      image1Url = await getDownloadURL(storageRef1);
    }

    if (!image1Url) {
      return NextResponse.json(
        { message: 'La imagen principal es obligatoria' }, // Cambiado el mensaje
        { status: 400 }
      );
    }
    let image2Url = null;
    if (image2 && image2.name) {
      const storageRef2 = ref(storage, `cardImages/${image2.name}`); //cambiado
      await uploadBytes(storageRef2, image2);
      image2Url = await getDownloadURL(storageRef2);
    }

    const cardData = {  // Cambiado 'slideData' a 'cardData'
      title,
      content, // Cambiado 'subtitle' a 'content'
      order,
      link,
      visible,
      fullPage,    // Cambiado 'ctaLink' a 'link'
      image1Url: image1Url, // Cambiado 'img1' a 'image1Url' y asignado image1Url
      image2Url: image2Url, // Cambiado 'img2' a 'image2' y asignado image2Url
    };

    const newCard = await addDoc(cardsRef, cardData);  // Cambiado 'newSlide' a 'newCard' y 'slidesRef' a 'cardsRef'

    return NextResponse.json(
      { message: 'Card creado correctamente', card: { id: newCard.id, ...cardData } }, // Cambiado el mensaje y 'slide' a 'card'
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: 'Error al crear la card', error: error.message }, // Cambiado el mensaje
      { status: 500 }
    );
  }
};
