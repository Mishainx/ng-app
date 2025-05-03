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
    const collectionRef = collection(db, 'slides');
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
      { message: 'Error fetching slides', error: error.message },
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
    const slidesRef = collection(db, 'slides');
    const slidesSnapshot = await getDocs(slidesRef);
    if (slidesSnapshot.size >= 5) {
      return NextResponse.json(
        { message: 'No se pueden crear más de 5 slides' },
        { status: 400 }
      );
    }

    const formData = await req.formData();
    const title = formData.get('title');
    const subtitle = formData.get('subtitle');
    const order = parseInt(formData.get('order'));
    const visible = formData.get('visible') === 'true';
    const ctaLink = formData.get('ctaLink');
    const ctaText = formData.get('ctaText');
    const ctaColor = formData.get('ctaColor');
    const overlay = formData.get('overlay');
    const image = formData.get('imagen');

    // ✅ Validaciones
    if (!title || title.length < 3 || title.length > 70) {
      return NextResponse.json(
        { message: 'El título debe tener entre 3 y 70 caracteres' },
        { status: 400 }
      );
    }

    if (!subtitle || subtitle.length < 3) {
      return NextResponse.json(
        { message: 'El subtítulo debe tener al menos 3 caracteres' },
        { status: 400 }
      );
    }

    if (!ctaText || ctaText.length < 2) {
      return NextResponse.json(
        { message: 'El texto del botón debe tener al menos 2 caracteres' },
        { status: 400 }
      );
    }

    const isValidUrl = (url) => {
      const pattern = /^(https?:\/\/|\/)[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/;
      return pattern.test(url);
    };

    if (!ctaLink || !isValidUrl(ctaLink)) {
      return NextResponse.json(
        { message: 'El enlace del botón no es válido' },
        { status: 400 }
      );
    }
    // 🖼️ Subir imagen y verificar que tenga URL
    let imgUrl = null;
    if (image && image.name) {
      const storageRef = ref(storage, `SlideImages/${image.name}`);
      await uploadBytes(storageRef, image);
      imgUrl = await getDownloadURL(storageRef);
    }

    if (!imgUrl) {
      console.log("error")
      return NextResponse.json(
        { message: 'La imagen es obligatoria' },
        { status: 400 }
      );
    }

    const slideData = {
      title,
      subtitle,
      order,
      visible,
      ctaLink,
      ctaText,
      ctaColor,
      imgUrl,
      overlay,
    };

    const newSlide = await addDoc(slidesRef, slideData);

    return NextResponse.json(
      { message: 'Slide creado correctamente', slide: { id: newSlide.id, ...slideData } },
      { status: 201 }
    );
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { message: 'Error al crear la slide', error: error.message },
      { status: 500 }
    );
  }
};

