import { NextResponse } from 'next/server';
import { query, where, getDocs, collection } from 'firebase/firestore';
import { db } from '@/firebase/config'; // Asegúrate de que esta ruta es correcta

export async function POST(request) {
    const codesCollection = collection(db, 'codes');

    try {
        const { qrCode } = await request.json();

        if (!qrCode) {
            return NextResponse.json({ error: 'Se requiere el código QR.' }, { status: 400 });
        }

        const q = query(codesCollection, where('code', '==', qrCode));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            // Código correcto
            return NextResponse.json({ valid: true, redirectTo: '/catalogo' });
        } else {
            return NextResponse.json({ valid: false, error: 'Código QR incorrecto.' }, { status: 401 });
        }

    } catch (error) {
        console.error('Error al verificar el código QR en Firebase:', error);
        return NextResponse.json({ error: 'Error interno del servidor al verificar el código.' }, { status: 500 });
    }
}
