import { getDoc, doc,deleteDoc,setDoc } from "firebase/firestore"; // Import getDoc instead of getDocs
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

        const userRef = doc(db, "users", userId); // Get a reference to the user document
        const userSnapshot = await getDoc(userRef); // Use getDoc instead of getDocs

        if (!userSnapshot.exists()) {
            return NextResponse.json(
                { message: 'User not found' },
                { status: 404 }
            );
        }

        const userData = userSnapshot.data(); // Access data from the snapshot
        return NextResponse.json(userData); // Return the user data
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
};

// Actualizar un usuario por ID
export const PUT = async (request, { params }) => {
    const { userId } = params; // Obtener el userId de los parámetros de la URL
    try {
        const userData = await request.json();
        const userRef = doc(db, "users", userId);

        // Actualizar los datos del usuario
        await setDoc(userRef, { ...userData }, { merge: true });
        return NextResponse.json({ message: "Usuario actualizado" }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
};

// Eliminar un usuario por ID
export const DELETE = async (request, { params }) => {
    const { userId } = params;
    console.log(userId); // Obtener el userId de los parámetros de la URL

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