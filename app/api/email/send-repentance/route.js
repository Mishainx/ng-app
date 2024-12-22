import { NextResponse } from 'next/server';
import { sendRepentanceEmail } from '../../../../src/nodemailer/transporter'; // Asegúrate de que esta función esté definida

export const POST = async (req) => {
  try {
    // Parsear el cuerpo de la solicitud
    const { name, email, orderNumber, orderDate, comment } = await req.json();

    // Validar que se haya recibido el correo y la información necesaria
    if (!email || !orderNumber || !orderDate) {
      return NextResponse.json(
        { message: 'Error: El email, número de pedido y fecha de pedido son requeridos.' },
        { status: 400 }
      );
    }

    // Validar email (usando expresión regular)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.match(emailRegex)) {
      return NextResponse.json(
        { message: 'Error: El email debe ser válido.' },
        { status: 400 }
      );
    }

    // Validar longitud del nombre
    if (name && name.length > 100) {
      return NextResponse.json(
        { message: 'Error: El nombre o razón social no puede exceder los 100 caracteres.' },
        { status: 400 }
      );
    }

    // Validar número de pedido (longitud entre 20 y 40 caracteres)
    if (orderNumber.length < 20 || orderNumber.length > 40) {
      return NextResponse.json(
        { message: 'Error: El ID de pedido debe tener entre 20 y 40 caracteres.' },
        { status: 400 }
      );
    }

    // Validar formato de la fecha de pedido (asegurarse que sea una fecha válida)
    const parsedOrderDate = new Date(orderDate);
    if (isNaN(parsedOrderDate)) {
      return NextResponse.json(
        { message: 'Error: La fecha de pedido debe ser una fecha válida.' },
        { status: 400 }
      );
    }

    // Llamar a la función para enviar el correo con los detalles del arrepentimiento
    await sendRepentanceEmail(email, { name, orderNumber, orderDate, comment });

    // Enviar respuesta de éxito
    return NextResponse.json(
      { message: 'Correo de arrepentimiento enviado exitosamente.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al enviar el correo de arrepentimiento:', error);
    return NextResponse.json(
      { message: 'Error al enviar el correo de arrepentimiento.', error: error.message },
      { status: 500 }
    );
  }
};
