import apiClient from './axios'; //Importa el cliente de Axios preconfigurado desde un archivo local

export async function registerRequest(formData) { //Función asíncrona para enviar los datos de registro de un nuevo usuario al servidor
  const response = await apiClient.post('/auth/register', formData); //Realiza una petición POST a la ruta enviando el formulario
  return response.data.data; //Devuelve solo el objeto 'data' anidado dentro de la respuesta del servidor
}

export async function loginRequest(credentials) { //Función asíncrona para autenticar (iniciar sesión) a un usuario existente
  const response = await apiClient.post('/auth/login', credentials); //Realiza una petición POST a la ruta enviando las credenciales (email y contraseña)
  return response.data.data; //Devuelve la información obtenida del servidor (token o datos del usuario)
}

export async function meRequest() { //Función asíncrona para obtener el perfil o información del usuario actualmente autenticado
  const response = await apiClient.get('/me'); //Realiza una petición GET a la ruta (requerir token de autenticación en la cabecera)
  return response.data.data; //Devuelve la información del usuario obtenida de la API
}