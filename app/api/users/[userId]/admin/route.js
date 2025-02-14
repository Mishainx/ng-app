import { authAdmin } from "@/firebase/authManager"; // Firebase Admin SDK ya inicializado
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// Obtener información de un usuario y verificar sus claims
export const GET = async (request, { params }) => {
    const { userId } = await params; // Obtener el userId de los parámetros de la URL
  
    try {
      // Obtener las cookies y el token
      const cookieStore = await cookies();
      const cookie = cookieStore.get("ng-ct");
  
      if (!cookie || !cookie.value) {
        return NextResponse.json(
          { message: "Unauthorized: No token provided" },
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
          { message: "Unauthorized: Invalid token" },
          { status: 401 }
        );
      }
  
      // Verificar si el usuario autenticado tiene permisos para leer datos de otros usuarios
      if (!decodedToken.admin) {
        return NextResponse.json(
          { message: "Forbidden: Insufficient permissions" },
          { status: 403 }
        );
      }
  
      // Obtener información del usuario por su UID
      const userRecord = await authAdmin.getUser(userId);
  
      // Retornar la información del usuario y sus claims
      return NextResponse.json({
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        phoneNumber: userRecord.phoneNumber,
        photoURL: userRecord.photoURL,
        disabled: userRecord.disabled,
        claims: userRecord.customClaims || {}, // Custom claims del usuario
      });
    } catch (error) {
      console.error("Error al obtener información del usuario:", error);
      return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
      );
    }
  };

// Asignar el claim de admin a un usuario
export const PUT = async (request, { params }) => {
  const { userId } = await params; // Obtener el userId de los parámetros de la URL

  try {
    // Obtener las cookies y el token
    const cookieStore = await cookies();
    const cookie = cookieStore.get("ng-ct");

    if (!cookie || !cookie.value) {
      return NextResponse.json(
        { message: "Unauthorized: No token provided" },
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
        { message: "Unauthorized: Invalid token" },
        { status: 401 }
      );
    }

    // Verificar si el usuario autenticado tiene permisos para asignar roles
    if (!decodedToken.admin) {
      return NextResponse.json(
        { message: "Forbidden: Insufficient permissions" },
        { status: 403 }
      );
    }

    // Asignar el claim de admin al usuario especificado
    await authAdmin.setCustomUserClaims(userId, { admin: true });

    return NextResponse.json(
      { message: `El usuario con UID ${userId} ahora es administrador.` },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al asignar claim de administrador:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};

// Eliminar el claim de admin de un usuario
export const DELETE = async (request, { params }) => {
  const { userId } = await params;

  try {
    // Obtener las cookies y el token
    const cookieStore = await cookies();
    const cookie = cookieStore.get("ng-ct");

    if (!cookie || !cookie.value) {
      return NextResponse.json(
        { message: "Unauthorized: No token provided" },
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
        { message: "Unauthorized: Invalid token" },
        { status: 401 }
      );
    }

    // Verificar si el usuario autenticado tiene permisos para eliminar roles
    if (!decodedToken.admin) {
      return NextResponse.json(
        { message: "Forbidden: Insufficient permissions" },
        { status: 403 }
      );
    }

    // Eliminar el claim de admin del usuario especificado
    await authAdmin.setCustomUserClaims(userId, { admin: null });

    return NextResponse.json(
      { message: `El claim de administrador fue eliminado para el usuario con UID ${userId}.` },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al eliminar claim de administrador:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
