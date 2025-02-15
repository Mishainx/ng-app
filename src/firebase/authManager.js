import admin from "firebase-admin";
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
}

// Verificar si la inicialización fue exitosa
console.log("Firebase Admin SDK inicializado correctamente");

export const authAdmin = admin.auth();
