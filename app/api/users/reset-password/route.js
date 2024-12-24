// pages/api/users/reset-password.js
import { auth } from "@/firebase/config";
import { sendPasswordResetEmail } from "firebase/auth";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ message: "El correo electrónico es obligatorio" }, { status: 400 });
    }

    // Enviar el correo para restablecer la contraseña
    await sendPasswordResetEmail(auth, email);

    return NextResponse.json({
      message: "Te hemos enviado un enlace para restablecer tu contraseña.",
    }, { status: 200 });
  } catch (error) {
    console.error("Error al enviar el enlace de restablecimiento: ", error);
    return NextResponse.json({
      message: "Error al enviar el enlace de restablecimiento. Intenta de nuevo más tarde.",
      error: error.message,
    }, { status: 500 });
  }
};
