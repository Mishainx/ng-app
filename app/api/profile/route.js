import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { authAdmin } from "../../../src/firebase/authManager";


export const GET = async (req) => {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token');

    if (!token) {
      return NextResponse.json({ message: "Usuario no logueado" }, { status: 401 });
    }

    // Aquí deberías tener una función para verificar y decodificar el token
    const user = await authAdmin.verifyIdToken(token.value); // Esta función debería verificar y decodificar el token

    if (!user) {
      return NextResponse.json({ message: "Token inválido" }, { status: 401 });
    }

    return NextResponse.json({ 
      message: "Usuario autenticado",
      user: {
        uid: user.uid,
        email: user.email 
      }
    }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error al obtener la información del usuario" }, { status: 500 });
  }
};
