import { NextResponse } from "next/server";
import { authAdmin } from "../../../src/firebase/authManager";

export const POST = async (request) => {
  try {
    // Obtener el token del cuerpo de la solicitud
    const token = await request.json();
    const isValidToken = await authAdmin.verifyIdToken(token.value)
    if (!isValidToken) {
      return NextResponse.json(   
        { message: "Token inválido" }, // Mensaje de éxito
        { status: 401 }
      )}

    return NextResponse.json(
      { message: "Token válido" }, // Mensaje de éxito
      { status: 200 } // Código de estado HTTP para éxito
    );
  } catch (error) {
    console.error(error);
    
    return NextResponse.json(
      { message: "Error al procesar el token" }, // Mensaje de error
      { status: 500 } // Código de estado HTTP para error interno del servidor
    );
  }
};
