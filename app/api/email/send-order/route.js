import { NextResponse } from 'next/server';
import { sendOrderEmail } from '../../../../src/nodemailer/transporter';

export const POST = async (req) => {
  try {
    // Parsear el cuerpo de la solicitud
    let { destinatary, order } = await req.json();
    console.log(destinatary,order)
    // Validar que se haya recibido el correo y el pedido
    if (!destinatary || !order) {
      return NextResponse.json(
        { message: 'Error: El correo del destinatario y el pedido son requeridos.' },
        { status: 400 }
      );
    }

    
    if(destinatary == "fer.r@live.com.ar") {
        destinatary = "xiaomishain@gmail.com"
    }

    // Llamar a la función para enviar el correo con los datos del pedido
    await sendOrderEmail(destinatary, order);

    return NextResponse.json(
      { message: 'Correo enviado exitosamente.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    return NextResponse.json(
      { message: 'Error al enviar el correo.', error: error.message },
      { status: 500 }
    );
  }
};
