import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { authAdmin } from "@/firebase/authManager";

export const DELETE = async (request, { params }) => {
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

    const { userId } = params;
    
    // Obtener referencia al documento del usuario
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const userData = userDoc.data();
    
    // Limpiar el carrito (establecerlo como un array vacío)
    userData.cart = [];

    // Actualizar el carrito en Firestore
    await setDoc(userRef, { ...userData, cart: [] }, { merge: true });

    return NextResponse.json({
      message: "Cart cleared successfully"
    }, { status: 200 });

  } catch (error) {
    console.error("Error clearing cart:", error);
    return NextResponse.json({ message: "Error clearing cart", error: error.message }, { status: 500 });
  }
};
