// app/api/cards/[id]/route.js

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

    const docRef = doc(db, 'cards', id);
    await deleteDoc(docRef);

    return NextResponse.json({ message: 'Card eliminada correctamente' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error al eliminar slide', error: error.message }, { status: 500 });
  }
};
