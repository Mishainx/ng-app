import { NextResponse } from 'next/server';
import { doc, deleteDoc, setDoc, getDoc } from 'firebase/firestore';  // Cambié updateDoc por setDoc
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

export const PUT = async (req, { params }) => {  // Cambié PATCH por PUT
  try {
    const cookieStore = await cookies();
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

    // Validación y procesamiento de los campos
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

    const position = formData.get('position');
if (position !== null) updates.position = position;

    // Manejo de imagen y icono (si se incluyen)
    const image = formData.get('image');
    if (image && image.name) {
      const storageRef = ref(storage, `SlideImages/${image.name}`);
      await uploadBytes(storageRef, image);
      const imgUrl = await getDownloadURL(storageRef);
      updates.imgUrl = imgUrl;
    }

    const icon = formData.get('icon');
    if (icon && icon.name) {
      const storageRef = ref(storage, `SlideIcons/${icon.name}`);
      await uploadBytes(storageRef, icon);
      const iconUrl = await getDownloadURL(storageRef);
      updates.iconUrl = iconUrl;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ message: 'No se enviaron cambios' }, { status: 400 });
    }

    // Obtener el documento anterior para no sobrescribir valores que no se actualizaron
    const docRef = doc(db, 'slides', id);
    const existingDoc = await getDoc(docRef);
    if (!existingDoc.exists()) {
      return NextResponse.json({ message: 'Slide no encontrado' }, { status: 404 });
    }

    // Mantener los valores anteriores si no se enviaron actualizaciones para ciertos campos
    const previousData = existingDoc.data();
    const finalUpdates = { ...previousData, ...updates };
    console.log(finalUpdates)
    // Usar setDoc para reemplazar completamente el documento con los nuevos valores
    await setDoc(docRef, finalUpdates);

    // Obtener el documento actualizado y devolverlo en la respuesta
    const updatedDoc = await getDoc(docRef);
    const updatedSlide = { id: updatedDoc.id, ...updatedDoc.data() };

    return NextResponse.json({ message: 'Slide actualizada correctamente', slide: updatedSlide }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: 'Error al actualizar slide', error: error.message }, { status: 500 });
  }
};

