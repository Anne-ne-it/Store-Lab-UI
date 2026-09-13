import api from "./axios.js" // Importa la instancia centralizada de Axios para reutilizar la configuración de la API y la autenticación

function unwrap(response) { // Define una función auxiliar para extraer la parte útil de la respuesta del backend y normalizarla
  return response.data?.data ?? response.data ?? [] // Devuelve response.data.data si existe; si no, usa response.data; si no hay nada, devuelve []
}

export async function getUsers() { // Exporta una función asíncrona para obtener la lista completa de usuarios
  const response = await api.get("/api/users") // Hace una petición GET al endpoint /api/users para pedir todos los usuarios
  const payload = unwrap(response) // Normaliza la respuesta para dejarla en un formato más manejable

  if (Array.isArray(payload)) return payload // Si la respuesta ya es un array, lo devuelve tal cual
  if (Array.isArray(payload.users)) return payload.users // Si la API devuelve { users: [...] }, devuelve ese array
  if (Array.isArray(payload.data)) return payload.data // Si la API envuelve la lista dentro de data, devuelve la data

  return [] // Si no encuentra una lista válida, devuelve una lista vacía para evitar errores en la UI
}

export async function updateUser(id, userData) { // Exporta una función para actualizar un usuario existente por su ID
  try {
    const response = await api.put(`/api/users/${id}`, userData) // Intenta actualizar con PUT al endpoint del usuario
    return unwrap(response) // Devuelve la respuesta del backend ya normalizada
  } catch (error) {
    if (error.response?.status === 404 || error.response?.status === 405) { // Si el backend no acepta PUT o no encuentra la ruta, intenta con PATCH
      const response = await api.patch(`/api/users/${id}`, userData) // Hace una actualización parcial con PATCH
      return unwrap(response) // Devuelve la respuesta del backend
    }
    throw error // Si el error no es 404 ni 405, lo reenvía para que la UI lo maneje adecuadamente
  }
}

export async function deleteUser(id) { // Exporta una función para eliminar un usuario mediante su ID
  const response = await api.delete(`/api/users/${id}`) // Ejecuta DELETE en /api/users/:id para borrar el registro
  return unwrap(response) // Devuelve la respuesta del backend, normalmente con información del borrado
}
