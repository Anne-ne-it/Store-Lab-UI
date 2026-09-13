//Define la URL base de la API usando una variable de entorno de Vite o "http://localhost:3000" por defecto, añadiendo la ruta "/api"
const API_URL = `${ import.meta.env.VITE_API_URL || "http://localhost:3000" }/api` 

export async function getReviews(productId) { //Función asíncrona para obtener las reseñas de un producto específico mediante su ID
  if (!productId) { //Comprueba si se proporcionó un ID de producto
    throw new Error("El productId es obligatorio") //Si no, lanza un error explicativo
  }

  //Realiza una petición GET a la API para obtener las reseñas correspondientes al producto
  const response = await fetch(
    `${API_URL}/reviews/product/${productId}`,
    { credentials: "include" }
  )

  if (!response.ok) { //Verifica si la respuesta HTTP fue exitosa (código 200-299)
    throw new Error(`Error HTTP: ${response.status}`) //Si no, lanza un error con el código de estado HTTP
  }

  const result = await response.json().catch(() => ({})) //Convierte la respuesta recibida en formato JSON a un objeto de JavaScript

  return result.data ?? [] //Devuelve la lista de reseñas (result.data) o un arreglo vacío ([]) si result.data es null o undefined
}

export async function createReview({ productId, rating, comment, }) { //Función asíncrona para enviar/crear una nueva reseña de un producto
  const rawToken = localStorage.getItem("token") //Lee el token guardado, si el backend lo usa como bearer además de cookie
  const token = rawToken && rawToken !== "cookie-authenticated" ? rawToken : null

  if (!token && !rawToken) { //Si no existe un token real ni sesión cookie activa
    throw new Error("Debes iniciar sesión para publicar una reseña") //Interrumpe el proceso lanzando un error porque se requiere sesión activa
  }

  const response = await fetch(`${API_URL}/reviews`, { //Realiza una petición HTTP POST a la API para guardar la reseña
    method: "POST", //Especifica que el método HTTP es POST
    credentials: "include",
    headers: { //Define las cabeceras de la petición HTTP
      "Content-Type": "application/json", //Indica que los datos enviados van en formato JSON
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ //Convierte los datos de la reseña a una cadena JSON para transmitirlos en el cuerpo de la petición
      productId,
      rating,
      comment,
    }),
  })

  const result = await response.json().catch(() => ({})) //Convierte la respuesta recibida del servidor a formato JSON

  if (!response.ok) { //Si la petición falla (código de estado no exitoso)
    throw new Error( //Lanza un error con el mensaje de la API o uno genérico
      result.message || result.error || "No se pudo crear la reseña"
    )
  }

  return result.data ?? result //Devuelve los datos de la reseña creada retornados por la API
}