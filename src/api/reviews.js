// Define la URL base de la API usando la variable de entorno VITE_API_URL o localhost:3000 como valor por defecto, y añade la ruta /api
const API_URL = `${ import.meta.env.VITE_API_URL || "http://localhost:3000" }/api`

export async function getReviews(productId) { // Exporta una función asíncrona para consultar las reseñas de un producto concreto
  if (!productId) { // Comprueba si el ID del producto ha sido recibido
    throw new Error("El productId es obligatorio") // Si falta el ID, lanza un error para evitar una petición inválida
  }

  // Hace una petición GET al endpoint de reseñas de ese producto y envía cookies para respetar la sesión del usuario
  const response = await fetch(
    `${API_URL}/reviews/product/${productId}`,
    { credentials: "include" }
  )

  if (!response.ok) { // Si el servidor responde con un código fuera del rango 200-299, lanza un error
    throw new Error(`Error HTTP: ${response.status}`) // El error incluye el código HTTP para saber qué falló
  }

  const result = await response.json().catch(() => ({})) // Convierte la respuesta en JSON y, si falla, devuelve un objeto vacío para evitar romper la app

  return result.data ?? [] // Devuelve la lista de reseñas si existe; si no, devuelve un array vacío para evitar errores en UI
}

export async function createReview({ productId, rating, comment, }) { // Exporta una función asíncrona para crear una nueva reseña para un producto
  const rawToken = localStorage.getItem("token") // Lee el token guardado en localStorage para comprobar si hay sesión activa por Bearer
  const token = rawToken && rawToken !== "cookie-authenticated" ? rawToken : null // Ignora valores falsos o marcadores de autenticación por cookie para evitar enviar tokens no reales

  if (!token && !rawToken) { // Si no hay token real ni tampoco hay una cookie validada, bloquea la reseña por falta de autenticación
    throw new Error("Debes iniciar sesión para publicar una reseña") // Lanza un error claro para que la UI muestre un mensaje amigable al usuario
  }

  const response = await fetch(`${API_URL}/reviews`, { // Envía la reseña al endpoint principal de reseñas para almacenarla
    method: "POST", // Indica que la petición será de tipo POST, útil para crear recursos
    credentials: "include",
    headers: { // Define las cabeceras request para indicar formato y autenticación
      "Content-Type": "application/json", // Indica que el cuerpo está en formato JSON
      ...(token ? { Authorization: `Bearer ${token}` } : {}), // Si hay token real, lo envía como bearer; si no, no añade Authorization
    },
    body: JSON.stringify({ // Convierte el contenido de la reseña a texto JSON para enviarlo en el cuerpo de la petición
      productId,
      rating,
      comment,
    }),
  })

  const result = await response.json().catch(() => ({})) // Parsea la respuesta del servidor y, si falla, devuelve un objeto vacío para no romper la ejecución

  if (!response.ok) { // Si la respuesta HTTP indica error, lanza una excepción con el detalle del backend
    throw new Error( // Crea un error con el mensaje del backend o un fallback general
      result.message || result.error || "No se pudo crear la reseña"
    )
  }

  return result.data ?? result // Devuelve la data de la nueva reseña si existe; si no, devuelve el objeto completo de respuesta
}