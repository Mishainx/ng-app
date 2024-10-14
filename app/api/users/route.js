import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import { db } from "../../../src/firebase/config";
import { NextResponse } from "next/server";
import { auth } from "../../../src/firebase/config";
import { createUserWithEmailAndPassword } from "firebase/auth";
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

        const productosRef = collection(db, "users");
        const querySnapshot = await getDocs(productosRef);
        const docs = querySnapshot.docs.map(doc => doc.data());
        return NextResponse.json(docs);
    } catch (error) {
        console.log(error);
    }
}

export const POST = async (request) => {
    try {
        const userData = await request.json();
        const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
        const userUid = userCredential.user.uid;

        if (userCredential?.user?.email === userData.email) {
            // Eliminar campos no deseados
            delete userData.password; // Eliminar la contraseña
            delete userData.repeatPassword; // Eliminar el campo de repetición de contraseña si existe

            // Asignar datos adicionales
            userData.cart = [];
            userData.tickets = userUid; // Asignar el UID a tickets
            userData.role = "user"; // Asignar el rol

            // Crear documento de usuario con UID como ID
            const docRefUser = doc(db, "users", userUid);
            await setDoc(docRefUser, { ...userData }).then(() => console.log("Usuario creado"));

            return NextResponse.json({ message: "Usuario creado" }, { status: 201 });
        } else {
            return NextResponse.json({ message: "No se creó el usuario" }, { status: 400 });
        }

    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
};
