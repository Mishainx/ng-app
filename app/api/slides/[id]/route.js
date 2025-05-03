// app/api/slides/[id]/route.js

import { NextResponse } from 'next/server';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { authAdmin } from '@/firebase/authManager';
import { cookies } from 'next/headers';
import { db, storage } from '@/firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const DELETE = async (req, { params }) => {
  try {
    const cookieStore = cookies();
    const cookie = cookieStore.get('ng-ct');

    if (!cookie?.value) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = cookie.value;
    const decoded = await authAdmin.verifyIdToken(token);

    if (!decoded.admin) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const { id } = params;

    const docRef = doc(db, 'slides', id);
    await deleteDoc(docRef);

    return NextResponse.json({ message: 'Slide eliminada correctamente' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error al eliminar slide', error: error.message }, { status: 500 });
  }
};

// app/api/slides/[id]/route.js


export const PATCH = async (req, { params }) => {
  try {
    const cookieStore = cookies();
    const cookie = cookieStore.get('ng-ct');

    if (!cookie?.value) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = cookie.value;
    const decoded = await authAdmin.verifyIdToken(token);

    if (!decoded.admin) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const formData = await req.formData();
    const { id } = params;

    const updates = {};

    const title = formData.get('title');
    if (title !== null) {
      if (title.length < 3 || title.length > 70) {
        return NextResponse.json({ message: 'El título debe tener entre 3 y 70 caracteres' }, { status: 400 });
      }
      updates.title = title;
    }

    const subtitle = formData.get('subtitle');
    if (subtitle !== null && subtitle.length < 3) {
      return NextResponse.json({ message: 'El subtítulo debe tener al menos 3 caracteres' }, { status: 400 });
    }
    if (subtitle !== null) updates.subtitle = subtitle;

    const order = formData.get('order');
    if (order !== null) updates.order = parseInt(order);

    const visible = formData.get('visible');
    if (visible !== null) updates.visible = visible === 'true';

    const ctaText = formData.get('ctaText');
    if (ctaText !== null && ctaText.length < 2) {
      return NextResponse.json({ message: 'El texto del botón debe tener al menos 2 caracteres' }, { status: 400 });
    }
    if (ctaText !== null) updates.ctaText = ctaText;

    const ctaLink = formData.get('ctaLink');
    if (ctaLink !== null) {
      const isValidUrl = (url) => /^(https?:\/\/|\/)[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/.test(url);
      if (!isValidUrl(ctaLink)) {
        return NextResponse.json({ message: 'El enlace del botón no es válido' }, { status: 400 });
      }
      updates.ctaLink = ctaLink;
    }

    const ctaColor = formData.get('ctaColor');
    if (ctaColor !== null) updates.ctaColor = ctaColor;

    const overlay = formData.get('overlay');
    if (overlay !== null) updates.overlay = overlay;

    // Manejar imagen si se incluye
    const image = formData.get('image');
    if (image && image.name) {
      const storageRef = ref(storage, `SlideImages/${image.name}`);
      await uploadBytes(storageRef, image);
      const imgUrl = await getDownloadURL(storageRef);
      updates.imgUrl = imgUrl;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ message: 'No se enviaron cambios' }, { status: 400 });
    }

    const docRef = doc(db, 'carouselSlides', id);
    await updateDoc(docRef, updates);

    return NextResponse.json({ message: 'Slide actualizada correctamente', updates }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error al actualizar slide', error: error.message }, { status: 500 });
  }
};

