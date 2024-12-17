import { collection, query, where, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from "@/firebase/config"; // Configuración de Firebase
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { authAdmin } from "@/firebase/authManager"; // Verificación del token

export const GET = async (request, { params }) => {
  const { userId } = params;

  try {
    // Obtener las cookies y el token
    const cookieStore = cookies();
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

    // Validar que el `userId` pertenece al usuario autenticado
    if (decodedToken.uid !== userId) {
      return NextResponse.json(
        { message: "Unauthorized: Access denied" },
        { status: 403 }
      );
    }

    // Consultar los tickets del usuario en Firestore
    const ticketsRef = collection(db, "tickets");
    const q = query(ticketsRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    // Mapear los tickets obtenidos
    const tickets = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(tickets, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};


export const DELETE = async (request, { params }) => {
  const { userId, ticketId } = params; // Obtenemos el userId y ticketId de los parámetros de la URL

  try {
    // Obtener las cookies y el token
    const cookieStore = cookies();
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

    // Validar que el `userId` pertenece al usuario autenticado
    if (decodedToken.uid !== userId) {
      return NextResponse.json(
        { message: "Unauthorized: Access denied" },
        { status: 403 }
      );
    }

    // Referencia al ticket a eliminar en Firestore
    const ticketRef = doc(db, "tickets", ticketId);

    // Eliminar el ticket
    await deleteDoc(ticketRef);

    return NextResponse.json({ message: "Ticket deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};