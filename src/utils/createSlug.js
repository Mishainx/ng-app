import { getDocs, collection } from 'firebase/firestore';
import { db } from '@/firebase/config';

/**
 * Convierte un título en un slug amigable para URLs.
 * @param {string} title - El título a convertir.
 * @param {function} slugExists - Función que verifica si un slug ya existe en la base de datos.
 * @returns {string} - El slug generado.
 */
export const createSlug = async (title, slugExists) => {
    if (!title) return '';

    // Convierte el título en un slug base
    const baseSlug = title
      .toLowerCase() // Convierte a minúsculas
      .trim() // Elimina espacios al principio y al final
      .replace(/\s+/g, '-') // Reemplaza espacios por guiones
      .replace(/[^\w\-]+/g, '') // Elimina caracteres no alfanuméricos
      .replace(/\-\-+/g, '-') // Reemplaza múltiples guiones por uno solo
      .replace(/^-+/, '') // Elimina guiones al inicio
      .replace(/-+$/, ''); // Elimina guiones al final

    // Verifica si el slug base ya existe
    let uniqueSlug = baseSlug;
    let count = 1;

    while (await slugExists(uniqueSlug)) {
        uniqueSlug = `${baseSlug}-${count}`; // Incrementa el slug
        count++;
    }

    return uniqueSlug;
};

// Función para verificar si el slug ya existe en la base de datos
export const slugExists = async (slug) => {
    const productsSnapshot = await getDocs(collection(db, 'products'));
    const existingSlugs = productsSnapshot.docs.map(doc => doc.data().slug);
    return existingSlugs.includes(slug);
};
