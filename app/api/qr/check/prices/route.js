// pages/api/qr/check.js
import { NextResponse } from 'next/server';

import { query, where,getDocs, collection } from 'firebase/firestore';
import { db } from '@/firebase/config'; // A


export async function POST(request) {
    const codesCollection = collection(db, 'codes');
    const twoHoursInSeconds = 7200;
  
    try {
      const { code } = await request.json();
  
      if (!code) {
        return NextResponse.json({ error: 'Se requiere el código QR.' }, { status: 400 });
      }
  
      const q = query(codesCollection, where('code', '==', code));
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        // Código correcto, establecemos la cookie y redirigimos
        const response = NextResponse.json({ valid: true, redirectTo: '/catalogo' });
  
        // Establecer la cookie HTTP-only y segura con una duración de 2 horas
        response.cookies.set({
          name: 'qrAccessCode',
          value: 'true', // No necesitamos un valor específico, solo su presencia
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production', // Solo segura en producción
          path: '/',
          maxAge: twoHoursInSeconds,
        });
  
        return response;
      } else {
        return NextResponse.json({ valid: false, error: 'Código QR incorrecto.' }, { status: 401 });
      }
  
    } catch (error) {
      console.error('Error al verificar el código QR en Firebase:', error);
      return NextResponse.json({ error: 'Error interno del servidor al verificar el código.' }, { status: 500 });
    }
  }