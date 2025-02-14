// pages/api/tickets/[ticketId]/payment-status.js

import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/config"; // Firebase config importada
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { authAdmin } from "@/firebase/authManager"; // Verificación de token para autorización

export const PATCH = async (request, { params }) => {
  const { ticketId } = await params;

  try {
    // Obtener las cookies y el token
    const cookieStore = await cookies();
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

    // Verifica si el usuario tiene privilegios de admin
    if (!decodedToken.admin) {
      return NextResponse.json(
        { message: 'Unauthorized: Admin privileges required' },
        { status: 403 } // 403 Forbidden es adecuado para una solicitud que no tiene permiso
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

    // Obtener el nuevo estado de pago desde el cuerpo de la solicitud
    const { paymentStatus } = await request.json(); // Asegúrate de que la solicitud incluya el estado de pago

    if (typeof paymentStatus !== 'boolean') {
      return NextResponse.json(
        { message: 'Invalid paymentStatus value. It should be a boolean.' },
        { status: 400 }
      );
    }

    // Actualizar el estado de pago (paymentStatus) en el ticket
    await updateDoc(ticketRef, {
      paymentStatus, // Actualiza el estado de pago
      updatedAt: new Date() // Fecha de actualización
    });

    return NextResponse.json({ message: `Ticket payment status updated to ${paymentStatus ? 'paid' : 'unpaid'}` }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
};
