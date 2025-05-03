// pages/api/admin/create-code.js
import { NextResponse } from 'next/server';
import { doc, setDoc,getDoc } from 'firebase/firestore';
import { db } from '@/firebase/config'; // Ajusta la ruta si es necesario
import { authAdmin } from '@/firebase/authManager'; // Asumiendo que tienes esto para proteger la ruta
import { cookies } from 'next/headers';

const CODE_COLLECTION = 'codes';
const CODE_DOCUMENT_ID = 'currentCode'; // Un único documento para el código actual

export const GET = async (req) => {
    try {

      // Autenticación de administrador
      const cookieStore = await cookies();
      const token = cookieStore.get('ng-ct')?.value;
  
      if (!token) {
        return NextResponse.json({ message: 'Unauthorized: No token provided' }, { status: 401 });
      }
  
      try {
        const decodedToken = await authAdmin.verifyIdToken(token);
        if (!decodedToken.admin) {
          return NextResponse.json({ message: 'Unauthorized: Admin privileges required' }, { status: 403 });
        }
      } catch (error) {
        return NextResponse.json({ message: 'Unauthorized: Invalid token' }, { status: 401 });
      }
      const docRef = doc(db, CODE_COLLECTION, CODE_DOCUMENT_ID);
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data && data.code) {
          return NextResponse.json({ code: data.code }, { status: 200 });
        } else {
          console.error('El documento no contiene el campo "code"');
          return NextResponse.json(
            { message: 'Error: El código no se encontró en el documento' },
            { status: 500 }
          );
        }
      } else {
        console.error('El documento del código no existe');
        return NextResponse.json({ message: 'Error: Código no encontrado' }, { status: 404 });
      }
    } catch (error) {
      console.error('Error al acceder a Firebase', error);
      return NextResponse.json(
        { message: 'Error al obtener el código desde Firebase', error: error.message },
        { status: 500 }
      );
    }
  };

  export const POST = async (req) => {
    try {
      // Autenticación de administrador
      const cookieStore = await cookies();
      const token = cookieStore.get('ng-ct')?.value;
  
      if (!token) {
        return NextResponse.json({ message: 'Unauthorized: No token provided' }, { status: 401 });
      }
  
      try {
        const decodedToken = await authAdmin.verifyIdToken(token);
        if (!decodedToken.admin) {
          return NextResponse.json({ message: 'Unauthorized: Admin privileges required' }, { status: 403 });
        }
      } catch (error) {
        return NextResponse.json({ message: 'Unauthorized: Invalid token' }, { status: 401 });
      }
  
      const { newCode } = await req.json();
  
      if (!newCode || typeof newCode !== 'string' || newCode.trim() === '') {
        return NextResponse.json({ message: 'Por favor, proporciona un código válido' }, { status: 400 });
      }
  
      const codeRef = doc(db, CODE_COLLECTION, CODE_DOCUMENT_ID);
      const docSnap = await getDoc(codeRef); // Obtener el documento
  
      if (docSnap.exists()) {
        return NextResponse.json({ message: 'Ya existe un código. No se puede crear otro.' }, { status: 409 }); //Devuelve 409 Conflict
      }
  
      await setDoc(codeRef, { code: newCode });
  
      return NextResponse.json({ message: 'Código creado correctamente', code: newCode }, { status: 201 }); //Devuelve 201 Created
    } catch (error) {
      console.error('Error al crear el código', error);
      return NextResponse.json(
        { message: 'Error al crear el código', error: error.message },
        { status: 500 }
      );
    }
  };

  export const PATCH = async (req) => {
    try {
      // Autenticación de administrador
      const cookieStore = await cookies();
      const token = cookieStore.get('ng-ct')?.value;
  
      if (!token) {
        return NextResponse.json({ message: 'Unauthorized: No token provided' }, { status: 401 });
      }
  
      try {
        const decodedToken = await authAdmin.verifyIdToken(token);
        if (!decodedToken.admin) {
          return NextResponse.json({ message: 'Unauthorized: Admin privileges required' }, { status: 403 });
        }
      } catch (error) {
        return NextResponse.json({ message: 'Unauthorized: Invalid token' }, { status: 401 });
      }
  
      const { newCode } = await req.json();
  
      if (!newCode || typeof newCode !== 'string' || newCode.trim() === '') {
        return NextResponse.json({ message: 'Por favor, proporciona un código válido para actualizar' }, { status: 400 });
      }
  
      const codeRef = doc(db, CODE_COLLECTION, CODE_DOCUMENT_ID);
      const docSnap = await getDoc(codeRef);
  
      if (!docSnap.exists()) {
        return NextResponse.json({ message: 'No existe un código para actualizar. Usa POST para crear uno.' }, { status: 404 });
      }
  
      await setDoc(codeRef, { code: newCode });
  
      return NextResponse.json({ message: 'Código actualizado correctamente', code: newCode }, { status: 200 });
    } catch (error) {
      console.error('Error al actualizar el código', error);
      return NextResponse.json(
        { message: 'Error al actualizar el código', error: error.message },
        { status: 500 }
      );
    }
  };