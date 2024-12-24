import { doc, getDoc, getDocs, updateDoc, deleteDoc, serverTimestamp, collection, addDoc, } from "firebase/firestore";
import { db } from "@/firebase/config";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { authAdmin } from "@/firebase/authManager";

// Función para validar el formato del email
const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
};

// Función para validar cada producto
const isValidProduct = (product) => {
    return (
        product &&
        typeof product.sku === "string" &&
        typeof product.quantity === "number" && product.quantity > 0 &&
        typeof product.price === "number" && product.price > 0
    );
};

// Crear un nuevo Ticket (POST)
export const POST = async (request) => {
    try {
        // Obtener los datos de la solicitud
        const { email, products } = await request.json();

        // Verificar que el email esté presente y sea válido
        if (!email || !isValidEmail(email)) {
            return NextResponse.json(
                { message: 'Invalid email address' },
                { status: 400 }
            );
        }

        // Verificar que los productos estén presentes y no sean vacíos
        if (!products || products.length === 0) {
            return NextResponse.json(
                { message: 'Products are required and cannot be empty' },
                { status: 400 }
            );
        }

        // Verificar cada producto
        for (const product of products) {
            if (!isValidProduct(product)) {
                return NextResponse.json(
                    { message: 'Invalid product data' },
                    { status: 400 }
                );
            }
        }

        // Calcular el monto total
        const totalAmount = products.reduce((acc, product) => {
            const amount = product.discount > 0
                ? product.discount * product.quantity // Si tiene descuento, usamos el descuento por cantidad
                : product.price * product.quantity; // Si no, usamos el precio por cantidad
            return acc + amount;
        }, 0);

        // Crear los datos del ticket
        const ticket = {
            date: serverTimestamp(), // Fecha de creación del ticket
            email, // Correo del usuario
            products, // Productos del carrito
            processed: false, // Estatus de procesamiento
            paymentStatus: false, // Estatus de pago
            totalAmount, // Monto total
            canceled: false, // Por defecto, el ticket no está cancelado
            cancelReason: null, // Por defecto, no hay motivo de cancelación
        };

        // Agregar el ticket a Firestore (crea un ID automático)
        const ticketRef = await addDoc(collection(db, "tickets"), ticket);

        return NextResponse.json({ message: "Ticket created", id: ticketRef.id }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
};


// Obtener un Ticket por ID (GET)
export const GET = async (request) => {
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

            // Verifica si el usuario tiene privilegios de admin
            if (!decodedToken.admin) {
                return NextResponse.json(
                  { message: 'Unauthorized: Admin privileges required' },
                  { status: 403 } // 403 Forbidden es adecuado para una solicitud que no tiene permiso
                );
              }
        // Obtiene todos los tickets de la colección
        const ticketsRef = collection(db, "tickets");
        const ticketsSnapshot = await getDocs(ticketsRef);

        if (ticketsSnapshot.empty) {
            return NextResponse.json(
                { message: 'No tickets found' },
                { status: 404 }
            );
        }

        // Mapea los datos de los tickets
        const tickets = ticketsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return NextResponse.json(tickets, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
};

// Actualizar un Ticket (PUT)
export const PUT = async (request, { params }) => {
    const { ticketId } = params;

    try {
        const updates = await request.json();

        if (!updates || Object.keys(updates).length === 0) {
            return NextResponse.json(
                { message: 'Invalid data: At least one field is required' },
                { status: 400 }
            );
        }

        const ticketRef = doc(db, "tickets", ticketId);
        await updateDoc(ticketRef, updates);

        return NextResponse.json({ message: "Ticket updated" }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
};

// Eliminar un Ticket por ID (DELETE)
export const DELETE = async (request, { params }) => {
    const { ticketId } = params;

    try {
        // Verificar autorización mediante token
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

        const ticketRef = doc(db, "tickets", ticketId);
        const ticketSnapshot = await getDoc(ticketRef);

        if (!ticketSnapshot.exists()) {
            return NextResponse.json(
                { message: 'Ticket not found' },
                { status: 404 }
            );
        }

        await deleteDoc(ticketRef);
        return NextResponse.json({ message: "Ticket deleted" }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
};
