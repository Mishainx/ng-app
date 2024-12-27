// pages/api/logout.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const POST = async (req) => {
  try {
    // Elimina la cookie de autenticación
    const cookieStore = cookies();
    cookieStore.set('ng-ct', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: 0, // Establecer maxAge a 0 para eliminar la cookie
      path: '/',
      sameSite: 'strict',
    });
    
    return NextResponse.json({ message: "Usuario desconectado" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error al desconectar" }, { status: 500 });
  }
};
