// app/api/cards/[id]/route.js

import { NextResponse } from 'next/server';
import { doc, deleteDoc, updateDoc,getDoc } from 'firebase/firestore';
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

    const docRef = doc(db, 'cards', id);
    await deleteDoc(docRef);

    return NextResponse.json({ message: 'Card eliminada correctamente' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error al eliminar slide', error: error.message }, { status: 500 });
  }
};

export const PUT = async (req, { params }) => {
  try {
    const cookieStore = await await cookies();
    const cookie = cookieStore.get('ng-ct');

    if (!cookie?.value) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = cookie.value;
    const decoded = await authAdmin.verifyIdToken(token);

    if (!decoded.admin) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params; // Cambié para obtener 'id' directamente de params
    const formData = await req.formData();

    const title = formData.get('title');
    const content = formData.get('content');
    const link = formData.get('link');
    const order = parseInt(formData.get('order'), 10);
    const visible = formData.get('visible') === '1';
    const fullPage = formData.get('fullPage') === '1';

    const image1 = formData.get('image1');
    const image2 = formData.get('image2');

    // Recupera los datos actuales de la card
    const cardRef = doc(db, 'cards', id);
    const currentCardDoc = await getDoc(cardRef);

    if (!currentCardDoc.exists()) {
      return NextResponse.json({ message: 'Card no encontrada' }, { status: 404 });
    }

    const currentCard = currentCardDoc.data();

    // Verifica si ya existen imágenes en la card actual
    let image1Url = currentCard?.image1Url;
    let image2Url = currentCard?.image2Url;

    // Subir nuevas imágenes si se proporcionaron
    if (image1 && typeof image1 === 'object' && image1.size > 0) {
      const img1Ref = ref(storage, `cardImages/${Date.now()}_1.png`);
      await uploadBytes(img1Ref, image1);
      image1Url = await getDownloadURL(img1Ref);
    }

    if (image2 && typeof image2 === 'object' && image2.size > 0) {
      const img2Ref = ref(storage, `cardImages/${Date.now()}_2.png`);
      await uploadBytes(img2Ref, image2);
      image2Url = await getDownloadURL(img2Ref);
    }

    const updateData = {
      title,
      content,
      link,
      order,
      visible,
      fullPage,
    };

    // Solo agregar las URLs de imagen si se han actualizado
    if (image1Url !== currentCard?.image1Url) updateData.image1Url = image1Url;
    if (image2Url !== currentCard?.image2Url) updateData.image2Url = image2Url;

    // Actualizar la card en Firestore
    await updateDoc(cardRef, updateData);

    const responseCard = {
      id,
      title,
      content,
      link,
      order,
      visible,
      fullPage,
      image1Url,
      image2Url,
    };

    return NextResponse.json({ message: 'Card actualizada correctamente', card: responseCard  }, { status: 200 });
  } catch (error) {
    console.error(error); // Para depuración
    return NextResponse.json({ message: 'Error al actualizar la card', error: error.message }, { status: 500 });
  }
};
