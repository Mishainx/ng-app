// pages/api/tickets/[ticketId]/archive.js

import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/config"; // Firebase config importada
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { authAdmin } from "@/firebase/authManager"; // Verificación de token para autorización

export const PATCH = async (request, { params }) => {
  const { ticketId } = params;
  console.log(ticketId)

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

    // Obtener el ticket por su ID
    const ticketRef = doc(db, "tickets", ticketId);
    const ticketSnapshot = await getDoc(ticketRef);

    if (!ticketSnapshot.exists()) {
      return NextResponse.json(
        { message: 'Ticket not found' },
        { status: 404 }
      );
    }

    const ticketData = ticketSnapshot.data();

    // Cambiar el estado de "processed"
    const newProcessedValue = ticketData.processed === true ? false : true;

    // Actualizar el estado del ticket
    await updateDoc(ticketRef, {
      processed: newProcessedValue, // Invertir el valor de processed
      updatedAt: new Date() // Fecha de actualización
    });

    return NextResponse.json({ message: `Ticket marked as ${newProcessedValue ? 'archived' : 'unarchived'}` }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
};
