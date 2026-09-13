import api from "./axios.js" // Importa la instancia de Axios configurada para conectarse con el backend y manejar cookies/autenticación

function unwrap(response) { // Define una función auxiliar para extraer la parte útil de la respuesta del backend
  return response.data?.data ?? response.data // Devuelve response.data.data si existe; si no, usa response.data como alternativa
}

function normalizeRating(product) { // Normaliza la propiedad rating para que siempre tenga un valor numérico consistente
  if (!product || typeof product !== "object") return product // Si el producto no existe o no es un objeto, devuelve el valor tal cual

  const rawRating = // Intenta leer la valoración desde varios nombres posibles que puede devolver la API
    product.rating ??
    product.averageRating ??
    product.avgRating ??
    product.average_rating ??
    product.avg_rating ??
    product.promedio ??
    product.score ??
    product.averageScore ??
    product.reviewAverage ??
    product.reviews?.averageRating ??
    product.reviews?.[0]?.rating ??
    product.reviewSummary?.averageRating ??
    product.reviewSummary?.average ??
    product.reviewSummary?.rating ??
    product.metadata?.averageRating ??
    product.data?.rating ??
    product.data?.averageRating ??
    product.data?.avgRating ??
    0 // Si no hay ninguna clave válida, usa 0 como valor por defecto

  const normalized = // Normaliza objetos anidados que puedan traer la valoración dentro de un campo como { value, average, rating }
    typeof rawRating === "object" && rawRating !== null
      ? rawRating.value ?? rawRating.average ?? rawRating.rating ?? 0
      : rawRating

  const numericRating = Number(normalized) // Convierte el valor a número para poder operar con él

  return { // Devuelve el producto con el rating ya normalizado
    ...product,
    rating: Number.isFinite(numericRating) ? numericRating : 0,
  }
}

function normalizeProductsPayload(payload) { // Normaliza distintos formatos de respuesta que puede devolver la API para productos
  if (!payload || typeof payload !== "object") { // Si el payload no existe o no es un objeto, lo retorna tal cual
    return payload
  }

  if (Array.isArray(payload)) { // Si el payload es un array, normaliza cada producto del array
    return payload.map(normalizeRating)
  }

  if (payload.product && typeof payload.product === "object") { // Si la API devuelve { product: {...} }, normaliza ese producto
    return normalizeRating(payload.product)
  }

  if (payload.data && typeof payload.data === "object") { // Si la respuesta viene anidada dentro de data
    if (Array.isArray(payload.data)) { // Si data es un array, normaliza la lista completa
      return payload.data.map(normalizeRating)
    }

    if (payload.data.product && typeof payload.data.product === "object") { // Si data contiene un producto anidado
      return normalizeRating(payload.data.product)
    }

    return normalizeRating(payload.data) // Si data es un único producto, lo normaliza directamente
  }

  if (Array.isArray(payload.products)) { // Si la API devuelve { products: [...] }, normaliza esa colección
    return payload.products.map(normalizeRating)
  }

  return normalizeRating(payload) // En cualquier otro caso, normaliza el payload como si fuera un producto único
}

function getAverageRatingFromReviews(reviews) { // Calcula la media de valoraciones a partir de una lista de reseñas
  const reviewList = Array.isArray(reviews)
    ? reviews
    : Array.isArray(reviews?.data)
      ? reviews.data
      : []

  if (!reviewList.length) return 0 // Si no hay reseñas, devuelve 0 para no dividir entre cero

  const total = reviewList.reduce((sum, review) => sum + Number(review?.rating || 0), 0) // Suma todas las valoraciones
  return total / reviewList.length // Divide la suma entre el número de reseñas para obtener la media
}

async function hydrateProductRating(product) { // Completa la valoración de un producto consultando sus reseñas si el rating no viene informado
  if (!product || typeof product !== "object") return product // Si no hay producto, no hace nada

  const currentRating = Number(product.rating ?? 0) // Intenta convertir la valoración actual a número

  if (Number.isFinite(currentRating) && currentRating > 0) { // Si ya tiene un rating válido, no hace falta pedirlo otra vez
    return product
  }

  try {
    const response = await api.get(`/api/reviews/product/${product.id}`) // Consulta la API de reseñas para ese producto concreto
    const reviews = response.data?.data ?? response.data ?? [] // Normaliza la estructura de la respuesta
    const averageRating = getAverageRatingFromReviews(reviews) // Calcula la media de reseñas

    if (averageRating > 0) { // Si la media es válida, la guarda dentro del producto
      return {
        ...product,
        rating: Number(averageRating.toFixed(1)), // Redondea la nota a 1 decimal para mostrarla más limpia
        reviewCount: Array.isArray(reviews) ? reviews.length : Number(product.reviewCount ?? 0), // Guarda cuántas reseñas tiene el producto
      }
    }
  } catch {
    // Si falla la petición o no hay reseñas, simplemente se conserva el producto original.
  }

  return product // Devuelve el producto con la valoración ya sea original o recién calculada
}

async function hydrateProductList(products) { // Aplaza la hidratación de valoración para una lista de productos
  if (!Array.isArray(products)) return products // Si no es un array, devuelve tal cual

  const hydratedProducts = await Promise.all(products.map((product) => hydrateProductRating(product))) // Procesa cada producto en paralelo para calcular su rating
  return hydratedProducts // Devuelve la lista con rating actualizado si era necesario
}

export async function getProducts(params = {}) { // Exporta una función para obtener el catálogo de productos con filtros o paginación opcional
  const response = await api.get("/api/products", { params }) // Hace la petición GET a /api/products enviando parámetros de filtro si existen
  const normalizedProducts = normalizeProductsPayload(unwrap(response)) // Normaliza la respuesta para que todos los productos tengan la misma estructura
  return hydrateProductList(normalizedProducts) // Si los productos no tienen rating, lo calcula antes de devolverlos
}

export async function getProductById(id) { // Exporta una función para obtener un producto concreto a partir de su ID
  const response = await api.get(`/api/products/${id}`) // Hace una petición GET a /api/products/:id
  const normalizedProduct = normalizeProductsPayload(unwrap(response)) // Normaliza la respuesta del producto
  return hydrateProductRating(normalizedProduct) // Añade la media de valoraciones si falta
}

export async function createProduct(productData) { // Exporta una función para crear un nuevo producto en el backend
  const response = await api.post("/api/products", productData) // Envía un POST con los datos del nuevo producto
  return unwrap(response) // Devuelve la respuesta del backend ya normalizada
}

export async function updateProduct(id, productData) { // Exporta una función para actualizar un producto existente
  const response = await api.put(`/api/products/${id}`, productData) // Hace un PUT con los nuevos datos para reemplazar los datos del producto
  return unwrap(response) // Devuelve la respuesta del backend con los cambios aplicados
}

export async function deleteProduct(id) { // Exporta una función para eliminar un producto del catálogo
  const response = await api.delete(`/api/products/${id}`) // Ejecuta DELETE para borrar el producto con ese ID
  return unwrap(response) // Devuelve la respuesta del backend tras la eliminación
}