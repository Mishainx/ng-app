import { getDoc, doc, deleteDoc, setDoc } from "firebase/firestore"; // Import getDoc instead of getDocs
import { db } from "@/firebase/config";
import { NextResponse } from "next/server";
import { authAdmin } from '@/firebase/authManager';
import { cookies } from 'next/headers';

// Obtener un usuario por ID
export const GET = async (request, { params }) => {
    const { userId } = params;
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

        // Verifica si el usuario tiene privilegios de admin
        if (!decodedToken.admin) {
            return NextResponse.json(
                { message: 'Unauthorized: Admin privileges required' },
                { status: 403 } // 403 Forbidden es adecuado para una solicitud que no tiene permiso
            );
        }

        const userRef = doc(db, "users", userId); // Obtener referencia al documento del usuario
        const userSnapshot = await getDoc(userRef); // Usar getDoc en lugar de getDocs

        if (!userSnapshot.exists()) {
            return NextResponse.json(
                { message: 'User not found' },
                { status: 404 }
            );
        }

        const userData = userSnapshot.data(); // Acceder a los datos del snapshot
        return NextResponse.json(userData); // Retornar los datos del usuario
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
};

// Actualizar un usuario por ID
// Actualizar un usuario por ID
export const PUT = async (request, { params }) => {
    const { userId } = params; // Obtener el userId de los parámetros de la URL
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

        // Verifica si el usuario tiene privilegios de admin o si el ID del usuario coincide con el del token
        if (decodedToken.admin || decodedToken.uid === userId) {
            const userData = await request.json();
            const userRef = doc(db, "users", userId);

            // Actualizar los datos del usuario
            await setDoc(userRef, { ...userData }, { merge: true });
            return NextResponse.json({ message: "Usuario actualizado" }, { status: 200 });
        } else {
            return NextResponse.json(
                { message: 'Unauthorized: Admin privileges or user matching ID required' },
                { status: 403 } // 403 Forbidden es adecuado para una solicitud que no tiene permiso
            );
        }
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
};


// Eliminar un usuario por ID
export const DELETE = async (request, { params }) => {
    const { userId } = params;

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

        // Verifica si el usuario tiene privilegios de admin
        if (!decodedToken.admin) {
            return NextResponse.json(
                { message: 'Unauthorized: Admin privileges required' },
                { status: 403 } // 403 Forbidden es adecuado para una solicitud que no tiene permiso
            );
        }

        // Obtener referencia al usuario en Firestore
        const userRef = doc(db, "users", userId);
        const userSnapshot = await getDoc(userRef);

        if (!userSnapshot.exists()) {
            return NextResponse.json(
                { message: 'User not found' },
                { status: 404 }
            );
        }

        // Eliminar el documento del usuario de Firestore
        await deleteDoc(userRef);

        // Eliminar el usuario de Firebase Authentication
        await authAdmin.deleteUser(userId); // Asegúrate de que userId sea el UID correcto

        return NextResponse.json({ message: "Usuario eliminado" }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
};
