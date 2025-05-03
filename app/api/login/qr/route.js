import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { logSuccessfulLogin, logFailedLogin } from "@/logger/transporter";
import { authAdmin } from "@/firebase/authManager"


export const POST = async (req) => {
    try {
        const { qrCode } = await req.json(); // Obtiene el qrCode del cuerpo de la petición

        // 1. Verifica el QR Code con /api/qr/check
        const qrCheckResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/qr/check`, { // Asumo que tienes NEXT_PUBLIC_API_URL configurado
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ qrCode }),
        });

        if (!qrCheckResponse.ok) {
            const qrCheckError = await qrCheckResponse.json();
            logFailedLogin('anonymous', req.ip, qrCheckError.message || 'Error al verificar QR Code');
            return NextResponse.json({ message: "Código QR inválido", error: qrCheckError.message || "Código QR inválido" }, { status: 400 });
        }

        // Si la verificación del QR es exitosa, continúa con el proceso de login
        // 2. Crea un nuevo usuario anónimo en Firebase Authentication
        const userRecord = await authAdmin.createUser({
            disabled: false,
            emailVerified: false,
        });

        const user = { uid: userRecord.uid, isAnonymous: true };

        // 3. Genera un Custom Token para el usuario anónimo
        const token = await authAdmin.createCustomToken(user.uid);

        // 4. Establece la cookie 'ng-ct'
        const cookieStore = cookies();
        cookieStore.set('ng-ct', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            maxAge: 7200,
            path: '/',
            sameSite: 'strict',
        });

        // 5. Registra el login exitoso
        logSuccessfulLogin(user.uid, req.ip, 'anonymous');

        // 6. Devuelve el token y el usuario
        return NextResponse.json({
            message: "Acceso anónimo concedido",
            user: { uid: user.uid, isAnonymous: true },
            token: token,
        }, { status: 200 });
    } catch (error) {
        console.error("Error al procesar el acceso anónimo:", error);
        logFailedLogin('anonymous', req.ip, error.message);
        return NextResponse.json({ message: "Error al conceder acceso anónimo", error: error.message }, { status: 500 });
    }
};
