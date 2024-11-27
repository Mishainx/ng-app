import { doc, getDoc, setDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase/config";
import { NextResponse } from "next/server";


export const GET = async (request, { params }) => {
    try {
      const { userId } = params;
      // Obtener referencia al documento del usuario
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);
  
      if (!userDoc.exists()) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
      }
  
      const userData = userDoc.data();
      const cart = userData.cart || []; // Obtener el carrito del usuario
  
      return NextResponse.json({
        message: "Cart retrieved successfully",
        cart
      }, { status: 200 });
  
    } catch (error) {
      console.error("Error retrieving cart:", error);
      return NextResponse.json({ message: "Error retrieving cart", error: error.message }, { status: 500 });
    }
  };

export const POST = async (request, { params }) => {
  try {
    const { userId } = params;
    const { sku, quantity } = await request.json();

    // Validar formato del SKU (ejemplo: PRO-XXXXX donde XXXXX son números)
    const skuRegex = /^PRO-\d{5}$/;
    if (!sku || !skuRegex.test(sku)) {
      return NextResponse.json(
        { message: "Invalid product SKU format" },
        { status: 400 }
      );
    }

    // Validar cantidad (debe ser un número entero positivo)
    if (!quantity || isNaN(quantity) || quantity < 1 || !Number.isInteger(quantity)) {
      return NextResponse.json(
        { message: "Invalid quantity" },
        { status: 400 }
      );
    }

    // Comprobar si el producto existe en la colección de productos
    const productsRef = collection(db, "products"); // Asegúrate de que esta sea la colección correcta
    const productQuery = query(productsRef, where("sku", "==", sku));
    const productSnapshot = await getDocs(productQuery);

    if (productSnapshot.empty) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    // Obtener referencia al documento del usuario
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const userData = userDoc.data();
    let cart = userData.cart || [];

    // Buscar si el producto ya está en el carrito
    const existingProductIndex = cart.findIndex(item => item.sku === sku);

    if (existingProductIndex > -1) {
      // Actualizar la cantidad si el producto ya existe en el carrito
      cart[existingProductIndex].quantity += quantity;
    } else {
      // Agregar un nuevo producto al carrito
      cart.push({
        sku,
        quantity,
      });
    }

    // Actualizar el carrito en Firestore
    await setDoc(userRef, { ...userData, cart }, { merge: true });

    return NextResponse.json({
      message: "Product added to cart successfully",
      cart
    }, { status: 200 });

  } catch (error) {
    console.error("Error updating cart:", error);
    return NextResponse.json({ message: "Error adding product to cart", error: error.message }, { status: 500 });
  }
};

export const PATCH = async (request, { params }) => {
    try {
      const { userId } = params;
      const { sku, quantity } = await request.json();
  
      // Validar SKU del producto
      const skuRegex = /^PRO-\d{5}$/;
      if (!sku || !skuRegex.test(sku)) {
        return NextResponse.json(
          { message: "Invalid product SKU format" },
          { status: 400 }
        );
      }
  
      // Validar cantidad (debe ser un número entero positivo)
      if (quantity === undefined || !Number.isInteger(quantity) || quantity < 1) {
        return NextResponse.json(
          { message: "Invalid quantity" },
          { status: 400 }
        );
      }
  
      // Obtener referencia al documento del usuario
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);
  
      if (!userDoc.exists()) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
      }
  
      const userData = userDoc.data();
      let cart = userData.cart || [];
  
      // Buscar el índice del producto en el carrito
      const productIndex = cart.findIndex(item => item.sku === sku);
  
      if (productIndex === -1) {
        return NextResponse.json({ message: "Product not found in cart" }, { status: 404 });
      }
  
      // Actualizar la cantidad del producto
      cart[productIndex].quantity = quantity;
  
      // Actualizar el carrito en Firestore
      await setDoc(userRef, { cart }, { merge: true });
  
      return NextResponse.json({
        message: "Product quantity updated successfully",
        cart
      }, { status: 200 });
  
    } catch (error) {
      console.error("Error updating product quantity:", error);
      return NextResponse.json({ message: "Error updating product quantity", error: error.message }, { status: 500 });
    }
  };

export const DELETE = async (request, { params }) => {
    try {
      const { userId } = params;
      const { sku } = await request.json();
  
      // Validar formato del SKU (ejemplo: PRO-XXXXX donde XXXXX son números)
      const skuRegex = /^PRO-\d{5}$/;
      if (!sku || !skuRegex.test(sku)) {
        return NextResponse.json(
          { message: "Invalid product SKU format" },
          { status: 400 }
        );
      }
  
      // Obtener referencia al documento del usuario
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);
  
      if (!userDoc.exists()) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
      }
  
      const userData = userDoc.data();
      let cart = userData.cart || [];
  
      // Buscar si el producto está en el carrito
      const productIndex = cart.findIndex(item => item.sku === sku);
  
      if (productIndex === -1) {
        return NextResponse.json(
          { message: "Product not found in cart" },
          { status: 404 }
        );
      }
  
      // Eliminar el producto del carrito
      cart.splice(productIndex, 1);
  
      // Actualizar el carrito en Firestore
      await setDoc(userRef, { ...userData, cart }, { merge: true });
  
      return NextResponse.json({
        message: "Product removed from cart successfully",
        cart
      }, { status: 200 });
  
    } catch (error) {
      console.error("Error removing product from cart:", error);
      return NextResponse.json({ message: "Error removing product from cart", error: error.message }, { status: 500 });
    }
  };
