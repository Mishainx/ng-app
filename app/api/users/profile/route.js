import { doc, getDoc } from "firebase/firestore"; // Importa getDoc para obtener un solo documento
import { db } from "@/firebase/config";
import { NextResponse } from "next/server";
import { authAdmin } from '@/firebase/authManager';
import { cookies } from 'next/headers';

export const GET = async () => {
        // Obtener las cookies y el token
        const cookieStore = await cookies();
        const cookie = cookieStore.get('ng-ct');

        if (!cookie || !cookie.value) {
            return NextResponse.json(
                { message: 'Unauthorized: No token provided' },
                { status: 401 }
            );
        }

        const token = cookie.value;

        // Verificar el token con Firebase Admin SDK
        let decodedToken;
        try {
            decodedToken = await authAdmin.verifyIdToken(token);
        } catch (error) {
            console.error("Token verification error:", error);
            return NextResponse.json(
                { message: 'Unauthorized: Invalid token' },
                { status: 401 }
            );
        }
        try {

        // Obtener el UID del usuario del token
        const uid = decodedToken.uid;
        // Obtener el documento específico del usuario usando el UID
        const userDocRef = doc(db, "users", uid);
        const userDocSnapshot = await getDoc(userDocRef);

        if (!userDocSnapshot.exists()) {
            return NextResponse.json(
                { message: 'User not found' },
                { status: 404 }
            );
        }

        const userData = { id: userDocSnapshot.id, ...userDocSnapshot.data() };
        return NextResponse.json(userData); // Devuelve solo los datos del usuario

    } catch (error) {
        // Registra el error completo para depuración
        console.error("Error fetching user:", error);
        
        // Devuelve una respuesta de error genérica
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
};
