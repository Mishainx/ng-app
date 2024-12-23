import nodemailer from 'nodemailer';

// Crear el transporte SMTP
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST, // Host SMTP (por ejemplo: smtp.gmail.com, smtp.mailtrap.io)
  port: parseInt(process.env.EMAIL_PORT, 10), // Puerto SMTP (normalmente 587 para TLS)
  secure: 'true', // Usar SSL/TLS si se especifica
  auth: {
    user: process.env.EMAIL_USER, // Correo electrónico autenticado
    pass: process.env.EMAIL_PASS, // Contraseña del correo
  },
});

// Probar la conexión SMTP
transporter.verify((error, success) => {
  if (error) {
    console.error('Error al conectar con el servidor SMTP:', error);
  } else {
    console.log('Conexión SMTP exitosa:', success);
  }
});

// Función para enviar un correo de prueba
export const sendTestEmail = async (destinatary) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER, // Dirección de remitente
      to: destinatary, // Dirección del destinatario
      bcc: 'promociones@nippongame.com.ar',
      subject: 'Correo de prueba desde Nodemailer',
      text: '¡Hola! Este es un correo de prueba enviado usando Nodemailer con tu configuración personalizada.',
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Correo enviado:', info.response);
  } catch (error) {
    console.error('Error al enviar el correo:', error);
  }
};

export const sendRepentanceEmail = async (destinatary, { name, orderNumber, orderDate, comment }) => {
  try {
    // Configuración del correo
    const mailOptions = {
      from: process.env.EMAIL_USER, // Dirección de correo desde la que se enviará
      to: destinatary, // Dirección del destinatario principal
      bcc: destinatary, // Copia oculta al mismo destinatario
      subject: `Solicitud de Arrepentimiento - Pedido ${orderNumber}`, // Asunto del correo
      text: `Detalles de la solicitud de arrepentimiento:\n\nNombre: ${name}\nNúmero de pedido: ${orderNumber}\nFecha de pedido: ${orderDate}\nComentario: ${comment || 'No se ha proporcionado ningún comentario.'}\n\nAtención: Nos comunicaremos con usted a la brevedad para resolver su solicitud.`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
          <p style="text-align: center; font-size: 26px; color: #EB3324; font-weight: bold;">Nippongame</p>
          <h2 style="text-align: center; font-weight: bold;">Detalles de la solicitud de arrepentimiento</h2>
          <p>Hola <strong>${name}</strong>,</p>
          <p>Gracias por contactarnos. Hemos recibido tu solicitud de arrepentimiento, y a continuación te proporcionamos los detalles:</p>

          <h3>Detalles del Pedido:</h3>
          <ul>
            <li><strong>Nombre:</strong> ${name}</li>
            <li><strong>Número de pedido:</strong> ${orderNumber}</li>
            <li><strong>Fecha de pedido:</strong> ${orderDate}</li>
            <li><strong>Comentario:</strong> ${comment || 'No se ha proporcionado ningún comentario.'}</li>
          </ul>

          <p>Atención: Nos comunicaremos con usted a la brevedad para resolver su solicitud.</p>

          <div style="text-align: center; font-size: 14px; color: #6B7280; margin-top: 30px;">
            <p>Gracias por elegir <strong>NipponGame</strong></p>
            <p>Si tienes alguna consulta, no dudes en ponerte en contacto con nosotros.</p>
            <p>Dirección: Av. Corrientes 2416, C1046AAP, Ciudad de Buenos Aires, Argentina</p>
            <p>Teléfono: +54 11 1234-5678 | Email: <a href="mailto:soporte@nippongame.com" style="color: #EB3324; text-decoration: none;">soporte@nippongame.com</a></p>
          </div>
        </div>
      `, // Cuerpo del correo en formato HTML
    };

    // Enviar el correo
    await transporter.sendMail(mailOptions);

    console.log('Correo de arrepentimiento enviado exitosamente.');
  } catch (error) {
    console.error('Error al enviar el correo de arrepentimiento:', error);
    throw new Error('No se pudo enviar el correo de arrepentimiento.');
  }
};



// Función para enviar un correo con detalles de pedido
export const sendOrderEmail = async (customerEmail, order) => {
    try {
      const { userName, products, total, userInfo } = order;
  
      // Crear el contenido del correo en formato HTML
      const productsTable = products
        .map(
          (product) => `
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">${product.name}</td>
            <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${product.quantity}</td>
            <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">USD$${product.price}</td>
            <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">  ${product.discount ? `USD$${product.discount}` : "-"}
</td>
            <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">USD$${product.subtotal}</td>
          </tr>
        `
        )
        .join('');
  
      const emailHTML = `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
          <p style="text-align: center; font-size: 26px; color: #EB3324; font-weight: bold;">Nippongame</p>
          <h2 style="text-align: center; font-weight: bold;">¡Nuevo Pedido Realizado!</h2>
          <p>Hola <strong>${userName}</strong>,</p>
          <p>Gracias por realizar tu pedido. Aquí están los detalles:</p>
  
          <h3>Datos del Cliente:</h3>
          <ul>
            <li><strong>Nombre:</strong> ${userInfo.name} ${userInfo.surname}</li>
            <li><strong>Email:</strong> ${userInfo.email}</li>
            <li><strong>WhatsApp:</strong> ${userInfo.whatsapp}</li>
            <li><strong>Dirección:</strong> ${userInfo.address}</li>
            <li><strong>CUIT:</strong> ${userInfo.cuit}</li>
            <li><strong>Razón Social:</strong> ${userInfo.businessName}</li>
          </ul>
  
          <h3>Productos del Pedido:</h3>
          <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
            <thead>
              <tr style="background-color: #f4f4f4;">
                <th style="padding: 8px; border: 1px solid #ddd;">Producto</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Cantidad</th>
                <th style="padding: 8px; border: 1px solid #ddd; text-align: right;">Precio Unitario</th>
                <th style="padding: 8px; border: 1px solid #ddd; text-align: right;">Precio con Descuento</th>
                <th style="padding: 8px; border: 1px solid #ddd; text-align: right;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${productsTable}
            </tbody>
<tfoot>
  <tr style="background-color: #f4f4f4;">
    <td colspan="4" style="padding: 8px; border: 1px solid #ddd; text-align: right; font-weight: bold;">
      Total
    </td>
    <td style="padding: 8px; border: 1px solid #ddd; text-align: right; font-weight: bold;">
      USD$${total}
    </td>
  </tr>
</tfoot>
          </table>
  
          <p style="margin-top: 20px;">Si tienes alguna pregunta sobre tu pedido, no dudes en contactarnos.</p>
          <p><a href="https://wa.me/5491164316975" target="_blank">WhatsApp: 5491164316975</a></p>
          <p>¡Gracias por confiar en nosotros!</p>
          <p style="font-style: italic;">Este es un correo generado automáticamente. Por favor, no respondas a este correo.</p>
        </div>
      `;
  
      // Configuración del correo
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: customerEmail,
        bcc: 'promociones@nippongame.com.ar',
        subject: 'Confirmación de Pedido',
        html: emailHTML,
      };
  
      // Enviar el correo
      const info = await transporter.sendMail(mailOptions);
      console.log('Correo de pedido enviado:', info.response);
    } catch (error) {
      console.error('Error al enviar el correo:', error);
    }
  };
  

export default transporter;
