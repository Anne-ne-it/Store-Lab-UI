import api from "./axios.js" //Importa la instancia configurada de Axios para enviar peticiones HTTP

function unwrap(response) { //Función auxiliar que extrae y simplifica la respuesta de la API,
  return response.data?.data ?? response.data //Devuelve 'response.data.data' si existe o 'response.data' como alternativa
}

function normalizeRating(product) {
  if (!product || typeof product !== "object") return product

  const rawRating =
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
    0

  const normalized =
    typeof rawRating === "object" && rawRating !== null
      ? rawRating.value ?? rawRating.average ?? rawRating.rating ?? 0
      : rawRating

  const numericRating = Number(normalized)

  return {
    ...product,
    rating: Number.isFinite(numericRating) ? numericRating : 0,
  }
}

function normalizeProductsPayload(payload) {
  if (!payload || typeof payload !== "object") {
    return payload
  }

  if (Array.isArray(payload)) {
    return payload.map(normalizeRating)
  }

  if (payload.product && typeof payload.product === "object") {
    return normalizeRating(payload.product)
  }

  if (payload.data && typeof payload.data === "object") {
    if (Array.isArray(payload.data)) {
      return payload.data.map(normalizeRating)
    }

    if (payload.data.product && typeof payload.data.product === "object") {
      return normalizeRating(payload.data.product)
    }

    return normalizeRating(payload.data)
  }

  if (Array.isArray(payload.products)) {
    return payload.products.map(normalizeRating)
  }

  return normalizeRating(payload)
}

function getAverageRatingFromReviews(reviews) {
  const reviewList = Array.isArray(reviews)
    ? reviews
    : Array.isArray(reviews?.data)
      ? reviews.data
      : []

  if (!reviewList.length) return 0

  const total = reviewList.reduce((sum, review) => sum + Number(review?.rating || 0), 0)
  return total / reviewList.length
}

async function hydrateProductRating(product) {
  if (!product || typeof product !== "object") return product

  const currentRating = Number(product.rating ?? 0)

  if (Number.isFinite(currentRating) && currentRating > 0) {
    return product
  }

  try {
    const response = await api.get(`/api/reviews/product/${product.id}`)
    const reviews = response.data?.data ?? response.data ?? []
    const averageRating = getAverageRatingFromReviews(reviews)

    if (averageRating > 0) {
      return {
        ...product,
        rating: Number(averageRating.toFixed(1)),
        reviewCount: Array.isArray(reviews) ? reviews.length : Number(product.reviewCount ?? 0),
      }
    }
  } catch {
    // Se mantiene el rating original si no hay reseñas disponibles o falla la petición.
  }

  return product
}

async function hydrateProductList(products) {
  if (!Array.isArray(products)) return products

  const hydratedProducts = await Promise.all(products.map((product) => hydrateProductRating(product)))
  return hydratedProducts
}

export async function getProducts(params = {}) { //Obtiene el catálogo de productos permitiendo filtros o paginación mediante parámetros
  const response = await api.get("/api/products", { params }) //Realiza una petición GET a la ruta '/api/products' enviando los parámetros opcionales
  const normalizedProducts = normalizeProductsPayload(unwrap(response))
  return hydrateProductList(normalizedProducts)
}

export async function getProductById(id) { //Obtiene la información detallada de un producto específico mediante su ID
  const response = await api.get(`/api/products/${id}`) //Realiza una petición GET a la ruta '/api/products/{id}'
  const normalizedProduct = normalizeProductsPayload(unwrap(response))
  return hydrateProductRating(normalizedProduct)
}

export async function createProduct(productData) { //Crea un nuevo producto enviando sus datos al servidor
  const response = await api.post("/api/products", productData) //Realiza una petición POST a la ruta '/api/products' con los datos del nuevo producto
  return unwrap(response) //Devuelve la información del producto creado extraída de la respuesta
}

export async function updateProduct(id, productData) { //Actualiza los datos de un producto existente identificado por su ID
  const response = await api.put(`/api/products/${id}`, productData) //Realiza una petición PUT a la ruta '/api/products/{id}' enviando los datos actualizados del producto
  return unwrap(response) //Devuelve la información del producto actualizado extraída de la respuesta
}

export async function deleteProduct(id) { //Elimina un producto de la base de datos según su ID
  const response = await api.delete(`/api/products/${id}`) //Realiza una petición DELETE a la ruta '/api/products/{id}'
  return unwrap(response) //Devuelve la información de la eliminación extraída de la respuesta
}