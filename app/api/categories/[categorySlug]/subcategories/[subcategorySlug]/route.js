import { NextResponse } from "next/server";
import { db } from "@/firebase/config";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { cookies } from "next/headers";
import { authAdmin } from "@/firebase/authManager";

// Función para validar que el id y el SKU son válidos
const isValidFirestoreId = (id) => /^[a-zA-Z0-9]{20}$/.test(id);
const isValidSku = (sku) => /^[a-zA-Z0-9\-]+$/.test(sku);  // SKU puede contener letras, números y guiones

// Endpoint GET para obtener una subcategoría específica por SKU
export const GET = async (req, { params }) => {
  const { id, sku } = params;

  if (!isValidFirestoreId(id) || !isValidSku(sku)) {
    return NextResponse.json({ message: 'ID o SKU inválido proporcionado' }, { status: 400 });
  }

  try {
    // Obtener la categoría
    const categoryRef = doc(db, 'categories', id);
    const categoryDoc = await getDoc(categoryRef);

    if (!categoryDoc.exists()) {
      return NextResponse.json({ message: 'Categoría no encontrada' }, { status: 404 });
    }

    const categoryData = categoryDoc.data();
    const subcategories = categoryData.subcategory;

    // Buscar la subcategoría con el SKU especificado
    const subcategory = subcategories.find((sub) => sub.sku === sku);

    if (!subcategory) {
      return NextResponse.json({ message: 'Subcategoría no encontrada' }, { status: 404 });
    }

    return NextResponse.json({ message: 'success', payload: subcategory }, { status: 200 });
  } catch (error) {
    console.error('Error al obtener la subcategoría:', error);
    return NextResponse.json({ message: 'Error al obtener la subcategoría', error: error.message }, { status: 500 });
  }
};

// Endpoint POST para crear una subcategoría dentro de `subcategory2`
export const POST = async (req, { params }) => {
  const { id, sku } = params;

  // Validar ID de Firestore y SKU
  if (!isValidFirestoreId(id) || !isValidSku(sku)) {
    return NextResponse.json({ message: 'ID o SKU inválido proporcionado' }, { status: 400 });
  }

  // Obtener las cookies y el token
  const cookieStore = cookies();
  const cookie = cookieStore.get('ng-ct');

  if (!cookie || !cookie.value) {
    return NextResponse.json({ message: 'Unauthorized: No token provided' }, { status: 401 });
  }

  const token = cookie.value;

  // Verificar el token con Firebase Admin SDK
  let decodedToken;
  try {
    decodedToken = await authAdmin.verifyIdToken(token);
  } catch (error) {
    console.error('Error al verificar el token:', error);
    return NextResponse.json({ message: 'Unauthorized: Invalid token' }, { status: 401 });
  }

  // Obtener el FormData de la solicitud
  const formData = await req.formData();
  const title = formData.get('title');
  let createdAt = formData.get('createdAt');

  // Validar los datos
  if (!title || typeof title !== 'string' || title.length > 40) {
    return NextResponse.json({ message: 'Validation errors: Title is required, must be a string, and cannot exceed 40 characters' }, { status: 400 });
  }

  // Si no se proporciona la fecha, usar la fecha actual
  if (!createdAt) {
    createdAt = new Date().toISOString(); // Formato ISO
  }

  try {
    // Referencia a la categoría en Firestore
    const categoryRef = doc(db, 'categories', id);
    const categoryDoc = await getDoc(categoryRef);

    if (!categoryDoc.exists()) {
      return NextResponse.json({ message: 'Categoría no encontrada' }, { status: 404 });
    }

    const categoryData = categoryDoc.data();
    const subcategories = categoryData.subcategory;

    // Buscar la subcategoría principal por SKU
    const subcategory = subcategories.find((sub) => sub.sku === sku);
    if (!subcategory) {
      return NextResponse.json({ message: 'Subcategoría no encontrada' }, { status: 404 });
    }

    // Generar el SKU para la subcategoría secundaria
    const subcategory2Sku = `${sku}-${title.replace(/\s+/g, '-').toLowerCase()}`;

    // Validar que no exista otra subcategoría con el mismo SKU
    if (subcategory.subcategory2 && subcategory.subcategory2.some((sub) => sub.sku === subcategory2Sku)) {
      return NextResponse.json({ message: 'Subcategoría secundaria con el mismo SKU ya existe' }, { status: 400 });
    }

    // Crear la subcategoría secundaria
    const newSubcategory2 = {
      title,
      sku: subcategory2Sku,
      createdAt,
    };

    // Actualizar la subcategoría existente con la nueva subcategoría secundaria
    const updatedSubcategories = subcategories.map((sub) =>
      sub.sku === sku
        ? { ...sub, subcategory2: [...(sub.subcategory2 || []), newSubcategory2] }
        : sub
    );

    await updateDoc(categoryRef, {
      subcategory: updatedSubcategories,
    });

    return NextResponse.json({ message: 'Subcategoría secundaria creada con éxito' }, { status: 201 });
  } catch (error) {
    console.error('Error al crear la subcategoría secundaria:', error);
    return NextResponse.json({ message: 'Error al crear la subcategoría secundaria', error: error.message }, { status: 500 });
  }
};
