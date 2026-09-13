import apiClient from './axios'; // Importa la instancia de Axios ya configurada con la URL base, cookies y el interceptor de autenticación

function unwrapData(response) { // Define una función auxiliar para normalizar la respuesta del backend y evitar repetir lógica en cada llamada
  return response?.data?.data ?? response?.data ?? {} // Devuelve response.data.data si existe; si no, usa response.data; si tampoco existe, devuelve un objeto vacío
}

export async function registerRequest(formData) { // Exporta una función asíncrona para registrar un usuario nuevo en la API
  const response = await apiClient.post('/auth/register', formData); // Envía el formulario de registro al endpoint /auth/register con los datos del usuario
  return unwrapData(response); // Devuelve la respuesta ya normalizada para que la vista pueda usarla sin preocuparse del formato
}

export async function loginRequest(credentials) { // Exporta una función asíncrona para iniciar sesión con email y contraseña
  const response = await apiClient.post('/auth/login', credentials); // Envía las credenciales al endpoint /auth/login para autenticar al usuario
  return unwrapData(response); // Devuelve la respuesta limpia del backend, normalmente con el usuario y/o el token de sesión
}

export async function meRequest() { // Exporta una función asíncrona para obtener el perfil del usuario autenticado
  const response = await apiClient.get('/me'); // Realiza una petición GET a /me para pedir la información del usuario activo
  return unwrapData(response); // Devuelve la información del usuario ya normalizada para seguir con la lógica de la app
}