import { NextResponse } from "next/server";
import { auth } from "../../../src/firebase/config";
import { signInWithEmailAndPassword} from "firebase/auth";
import { cookies } from "next/headers";

export const POST = async (req) => {
  try {
    const body = await req.json();
    const userCredential = await signInWithEmailAndPassword(auth, body.email, body.password);
    const user = userCredential.user;

    if (user) {
      const token = await user.getIdToken();

      // Set cookie securely
      const cookieStore = cookies();
      cookieStore.set('ng-ct', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
        sameSite: 'strict',
      });

      return NextResponse.json({ 
        message: "Usuario logueado",
        user: {
          uid: user.uid,
          email: user.email 
              }
      }, { status: 200 });
    } else {
      return NextResponse.json({ message: "Usuario no logueado" });
    }
  } catch (error) {
    return NextResponse.json({ message: "Error al loguear" }, { status: 401 });
  }
};