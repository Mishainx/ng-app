import { cookies } from 'next/headers';
import { authAdmin } from '@/firebase/authManager';
import { NextResponse } from 'next/server';
import { db } from '@/firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export const PATCH = async (request, { params }) => {
    try {
        // Obtener las cookies y el token
        const cookieStore = cookies();
        const cookie = cookieStore.get('ng-ct');

        // Verificar si la cookie existe
        if (!cookie) {
            return NextResponse.json(
                { message: 'Unauthorized: No token cookie found' },
                { status: 401 }
            );
        }

        // Verificar si la cookie tiene un valor
        if (!cookie.value) {
            return NextResponse.json(
                { message: 'Unauthorized: Empty token cookie' },
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

        // Verificar si el usuario tiene privilegios de admin
        if (!decodedToken.admin) {
            return NextResponse.json(
                { message: 'Unauthorized: Admin privileges required' },
                { status: 403 }
            );
        }

        // Si la autenticación y autorización son válidas, continúa con la lógica del endpoint
        const { ticketId } = params;

        // Verificar que el ID del ticket se proporcione
        if (!ticketId) {
            return NextResponse.json(
                { message: 'Ticket ID is required' },
                { status: 400 }
            );
        }

        // Referencia al ticket en Firestore
        const ticketRef = doc(db, "tickets", ticketId);

        // Verificar que el ticket exista
        const ticketSnap = await getDoc(ticketRef);
        if (!ticketSnap.exists()) {
            return NextResponse.json(
                { message: "Ticket not found" },
                { status: 404 }
            );
        }

        // Verificar si el ticket está cancelado
        const ticketData = ticketSnap.data();
        const {reason} = await request.json()

        // Si está cancelado, restaurarlo. Si no está cancelado, marcarlo como cancelado.
        await updateDoc(ticketRef, {
            canceled: !ticketData.canceled,
            cancelReason: ticketData.canceled ? null : reason || "" // Si el ticket no está cancelado, el motivo se establece a null
        });

        return NextResponse.json(
            { message: ticketData.canceled ? "Ticket successfully restored" : "Ticket successfully canceled" },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
};
