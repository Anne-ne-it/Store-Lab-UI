import apiClient from './axios'; // Importa la instancia de Axios configurada para conectarse con el backend y manejar sesión/cookies

export async function getWishlist() { // Exporta una función asíncrona para obtener la lista de favoritos del usuario autenticado
  const response = await apiClient.get('/wishlist'); // Hace una petición GET al endpoint /wishlist para recuperar los productos guardados

    return response.data.data; // Devuelve la parte útil de la respuesta, que normalmente está dentro de response.data.data

}

export async function toggleWishlist(productId) { // Exporta una función para añadir o quitar un producto de favoritos según el estado actual
  const response = await apiClient.post('/wishlist/toggle', { productId }); // Envía una petición POST a /wishlist/toggle con el ID del producto para activar o desactivar el favorito

  
  return response.data.data; // Devuelve la respuesta del backend ya normalizada, normalmente con el nuevo estado del favorito

}