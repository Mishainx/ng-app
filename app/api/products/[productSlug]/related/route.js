import { NextResponse } from 'next/server';
import { db } from '@/firebase/config';
import { collection, query, where, getDocs, updateDoc, doc,deleteDoc } from 'firebase/firestore';
import { createSlug,slugExists } from '@/utils/createSlug';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/firebase/config';
import { cookies } from 'next/headers';
import { authAdmin } from '@/firebase/authManager';

export const GET = async (req, { params }) => {
  const { productSlug } = await params;

  try {
    // Crear una consulta para buscar el documento con el SKU especificado
    const productsRef = collection(db, 'products');
    const q = query(productsRef, where('slug', '==', productSlug));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Si se encuentra el producto, devolver los datos del primer documento encontrado
      const productData = querySnapshot.docs[0].data();
      return NextResponse.json(
        { payload: productData },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: 'Producto no encontrado' },
        { status: 404 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: 'Error al recuperar el producto', error: error.message },
      { status: 500 }
    );
  }
};

export const DELETE = async (req, { params }) => {
  const { productSlug } = await params;
  try {

        const cookieStore = await cookies();
        const cookie = cookieStore.get("ng-ct");
    
        if (!cookie || !cookie.value) {

          return NextResponse.json(
            { message: 'Unauthorized: No token provided' },
            { status: 401 }
          );
        }
    
        const token = cookie.value;
    
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
    // Crear una consulta para buscar el documento con el slug especificado
    const productsRef = collection(db, 'products');
    const q = query(productsRef, where('slug', '==', productSlug));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Si se encuentra el producto, obtener la referencia del primer documento encontrado
      const productDoc = querySnapshot.docs[0];
      const productDocRef = doc(db, 'products', productDoc.id);

      // Eliminar el documento
      await deleteDoc(productDocRef);

      return NextResponse.json(
        { message: 'Producto eliminado correctamente' },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: 'Producto no encontrado' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.log(error)

    return NextResponse.json(
      { message: 'Error al eliminar el producto', error: error.message },
      { status: 500 }
    );
  }
};

export const PUT = async (req, { params }) => {
  const { productSlug } = await params;

  try {
    const cookieStore = await cookies();
        const cookie = cookieStore.get("ng-ct");
    
        if (!cookie || !cookie.value) {
          return NextResponse.json(
            { message: 'Unauthorized: No token provided' },
            { status: 401 }
          );
        }
    
        const token = cookie.value;
    
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


    const formData = await req.formData();
    console.log(formData.get("relatedProducts"));
    const updatedData = {};
    let file = null;
    formData.forEach((value, key) => {
      if (key === "img") {
        file = value; // Asumimos que es un archivo
      } else if (key === "subcategory") {
        if (!updatedData[key]) {
          updatedData[key] = [];
        }
        updatedData[key].push(value); // Manejar múltiples subcategorías
      } else {
        // Para los campos booleanos, convertir "true" y "false" a valores booleanos
        if (key === "stock" || key === "visible" || key === "featured") {
          updatedData[key] = value === "true"; // Convertir a booleano
        } 
        // Para los campos numéricos, convertir a número
        else if (key === "price" || key === "discount") {
          updatedData[key] = parseFloat(value); // Convertir a número flotante
        } 
        else if (key === "relatedProducts") {
            // Asegurarnos de que relatedProducts sea un array de cadenas
            const relatedProducts = updatedProduct[key];
            if (!Array.isArray(relatedProducts)) {
              // Si no es un array, convertirlo a un array de una sola cadena
              formData.append(key, relatedProducts);
            } else {
              // Verificamos que todos los elementos sean cadenas
              relatedProducts.forEach((sku) => {
                if (typeof sku === 'string') {
                  formData.append(key, sku); // Agregar cada SKU por separado
                } else {
                  console.error("relatedProducts contiene un valor que no es una cadena de texto:", sku);
                }
              });
            }
          }
        // Para todos los demás, asignar directamente
        else {
          updatedData[key] = value;
        }
      }
    });
    


    const productsRef = collection(db, "products");
    const q = query(productsRef, where("slug", "==", productSlug));
    const querySnapshot = await getDocs(q);



    if (!querySnapshot.empty) {
      const productDoc = querySnapshot.docs[0];
      const productDocRef = doc(db, "products", productDoc.id);

      // Manejar cambios de slug
      if (updatedData.name && updatedData.name !== productDoc.data().name) {
        const uniqueSlug = await createSlug(updatedData.name, slugExists);
        updatedData.slug = uniqueSlug;
      }

// Subir el archivo si existe
if (file && file.size > 0) {
  const storageRef = ref(storage, `ProductImg/${file.name}`);
  await uploadBytes(storageRef, file);
  updatedData.img = await getDownloadURL(storageRef);
  console.log("Imagen subida:", updatedData.img);
} else {
  // Verificar si no se proporciona un archivo, entonces mantener la imagen actual
  const productImg = productDoc.data().img;
  if (!updatedData.img && productImg) {
    updatedData.img = productImg; // Mantener la imagen anterior si no se sube nueva
  }
  console.log("Imagen no subida, manteniendo la imagen anterior:", updatedData.img);
}   

      await updateDoc(productDocRef, updatedData);

      return NextResponse.json(
        { message: "Producto actualizado correctamente", payload: updatedData },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Producto no encontrado" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error al actualizar el producto", error: error.message },
      { status: 500 }
    );
  }
};
