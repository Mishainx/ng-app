export function validateProductData(product) {
    const errors = [];

    if (!product.name || typeof product.name !== 'string' || product.name.trim() === '') {
        errors.push('El nombre de producto es obligatorio y debe ser una cadena no vacía.');
    } else if (product.name.length > 70) {
        errors.push('El nombre de producto no debe exceder los 70 caracteres.');
    } else if (product.name.length < 3) {
        errors.push('El nombre de producto debe tener al menos 3 caracteres.');
    } else if (!/^[a-zA-Z0-9\s\-(),.'"]+$/.test(product.name)) {
        errors.push('El nombre de producto contiene caracteres inválidos.');
    } else if (/\s{2,}/.test(product.name)) {
        errors.push('El nombre de producto no debe contener espacios múltiples consecutivos.');
    } else if (!isNaN(product.name)) {
        errors.push('El nombre de producto no puede ser solo números.');
    }

    // Validar shortDescription
if (!product.brand || typeof product.brand !== 'string' || product.brand.trim() === '') {
    errors.push('La marca es obligatoria y debe ser una cadena no vacía.');
} else if (product.brand.length > 30) {
    errors.push('La marca no debe exceder los 70 caracteres.');
} else if (product.brand.length < 3) {
    errors.push('La marca debe tener al menos 3 caracteres.');
} else if (!/^[a-zA-Z0-9\s\-(),.'"]+$/.test(product.brand)) {
    errors.push('La marca contiene caracteres inválidos.');
} else if (/\s{2,}/.test(product.brand)) {
    errors.push('La marca no debe contener espacios múltiples consecutivos.');
}
    
// Validar shortDescription
if (!product.shortDescription || typeof product.shortDescription !== 'string' || product.shortDescription.trim() === '') {
    errors.push('La descripción corta es obligatoria y debe ser una cadena no vacía.');
} else if (product.shortDescription.length > 30) {
    errors.push('La descripción corta no debe exceder los 70 caracteres.');
} else if (product.shortDescription.length < 3) {
    errors.push('La descripción corta debe tener al menos 3 caracteres.');
} else if (!/^[a-zA-Z0-9\s\-(),.'"]+$/.test(product.shortDescription)) {
    errors.push('La descripción corta contiene caracteres inválidos.');
} else if (/\s{2,}/.test(product.shortDescription)) {
    errors.push('La descripción corta no debe contener espacios múltiples consecutivos.');
} else if (!isNaN(product.shortDescription)) {
    errors.push('La descripción corta no puede ser solo números.');
}


// Validar longDescription
if (!product.longDescription || typeof product.longDescription !== 'string' || product.longDescription.trim() === '') {
    errors.push('La descripción larga es obligatoria y debe ser una cadena no vacía.');
} else if (product.longDescription.length > 300) {
    errors.push('La descripción larga no debe exceder los 300 caracteres.');
} else if (product.longDescription.length < 3) {
    errors.push('La descripción larga debe tener al menos 3 caracteres.');
} else if (!/^[a-zA-Z0-9\s\-(),.'"]+$/.test(product.longDescription)) {
    errors.push('La descripción larga contiene caracteres inválidos.');
} else if (/\s{2,}/.test(product.longDescription)) {
    errors.push('La descripción larga no debe contener espacios múltiples consecutivos.');
} else if (!isNaN(product.longDescription)) {
    errors.push('La descripción larga no puede ser solo números.');
}

    // Validar categoría
    if (!product.category || typeof product.category !== 'string' || product.category.trim() === '') {
        errors.push('La categoría es obligatoria y debe ser una cadena no vacía.');
    }

// Validar precio
if (typeof product.price !== 'number' || isNaN(product.price)) {
    errors.push('El precio debe ser un número válido.');
} else if (product.price <= 0) {
    errors.push('El precio debe ser un número positivo.');
} else if (!/^\d+(\.\d{1,2})?$/.test(product.price.toString())) {
    errors.push('El precio puede tener hasta dos decimales.');
} else if (product.price > 100000) {
    errors.push('El precio no debe exceder los 100,000.');
}


// Validar stock
// Convertir stock a número para la validación
const stockValue = typeof product.stock === 'string' ? Number(product.stock) : product.stock;

// Validar stock
if (typeof stockValue !== 'number' || isNaN(stockValue)) {
    errors.push('El stock debe ser un número válido.');
} else if (!Number.isInteger(stockValue) || stockValue < 0) {
    errors.push('El stock debe ser un número entero no negativo.');
}


    // Validar featured
    if (typeof product.featured !== 'boolean') {
        errors.push('El campo "featured" debe ser un booleano.');
    }

    // Validar visible
    if (typeof product.visible !== 'boolean') {
        errors.push('El campo "visible" debe ser un booleano.');
    }

    const discountValue = typeof product.discount === 'string' ? Number(product.discount) : product.discount;

    // Validar discount
    if (typeof discountValue !== 'number' || isNaN(discountValue)) {
        errors.push('El descuento debe ser un número válido.');
    } else if (!Number.isInteger(discountValue) || discountValue < 0) {
        errors.push('El descuento debe ser 0 o un número entero positivo.');
    }
    

    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

/* Ejemplo de uso
const product = {
    title: 'Producto 1',
    description: 'Descripción del producto 1',
    category: 'Categoría 1',
    price: 100,
    stock: 50
};

const validationResult = validateProductData(product);

if (!validationResult.isValid) {
    console.error('Errores de validación:', validationResult.errors);
} else {
    console.log('Los datos del producto son válidos.');
}*/
