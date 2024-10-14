import { doc, getDoc } from "firebase/firestore"; // Importa getDoc para obtener un solo documento
import { db } from "@/firebase/config";
import { NextResponse } from "next/server";
import { authAdmin } from '@/firebase/authManager';
import { cookies } from 'next/headers';

export const GET = async () => {
    try {

        // Obtener las cookies y el token
        const cookieStore = cookies();
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
            return NextResponse.json(
                { message: 'Unauthorized: Invalid token' },
                { status: 401 }
            );
        }

        // Obtener el UID del usuario del token
        const uid = decodedToken.uid;
        console.log(uid);
        // Obtener el documento específico del usuario usando el UID
        const userDocRef = doc(db, "users", uid); // Asumiendo que el ID de usuario es el mismo que el UID
        const userDocSnapshot = await getDoc(userDocRef);
        if (!userDocSnapshot.exists()) {
            return NextResponse.json(
                { message: 'User not found' },
                { status: 404 }
            );
        }

        const userData = { id: userDocSnapshot.id, ...userDocSnapshot.data() };
        console.log(userData)
        return NextResponse.json(userData); // Devuelve solo los datos del usuario

    } catch (error) {
        console.error("Error fetching user:", error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
};
