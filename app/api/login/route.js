import { NextResponse } from "next/server";
import { auth } from "../../../src/firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { cookies } from "next/headers";
import { db } from "../../../src/firebase/config"; // Asegúrate de tener Firestore configurado
import { doc, getDoc } from "firebase/firestore";
import { logSuccessfulLogin,logFailedLogin } from "@/logger/transporter";

export const POST = async (req) => {
  const body = await req.json();

  try {
    const userCredential = await signInWithEmailAndPassword(auth, body.email, body.password);
    const user = userCredential.user;

    if (user) {
      const token = await user.getIdToken();

      // Set cookie securely
      const cookieStore = await cookies();
      cookieStore.set('ng-ct', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
        sameSite: 'strict',
      });

      // Obtener información adicional del usuario desde Firestore
      const docRef = doc(db, "users", user.uid); // Asumiendo que los perfiles de usuarios están en la colección "users"
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userProfile = docSnap.data();
        logSuccessfulLogin(user.uid, req.ip )
        return NextResponse.json({
          message: "Usuario logueado",
          user: {
            uid: user.uid,
            email: user.email,
            ...userProfile, // Combinar los datos de Firebase Auth con los del perfil
          }
        }, { status: 200 });
      } else {
        // Si el perfil del usuario no existe, manejar el error
        return NextResponse.json({ 
          message: "Perfil del usuario no encontrado", 
          user: { uid: user.uid, email: user.email } 
        }, { status: 200 });
      }
    } else {
      return NextResponse.json({ message: "Usuario no logueado" });
    }
  } catch (error) {
    logFailedLogin(body.email,req.ip)
    return NextResponse.json({ message: "Error al loguear", error: error.message }, { status: 401 });
  }
};
