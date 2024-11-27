import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { NextResponse } from "next/server";

export const DELETE = async (request, { params }) => {
  try {
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
