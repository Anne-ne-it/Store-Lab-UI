import apiClient from './axios'; // Importa la instancia de Axios ya configurada para hablar con el backend y enviar cookies/headers correctos

export async function getCart() { // Exporta una función asíncrona para recuperar el contenido actual del carrito del usuario
  const response = await apiClient.get('/cart'); // Hace una petición GET al endpoint /cart para pedir los productos del carrito
  return response.data.data; // Devuelve la parte útil de la respuesta, normalmente la estructura del carrito dentro de response.data.data
}

export async function addCartItem(productId, quantity = 1) { // Exporta una función asíncrona para añadir un producto al carrito o incrementar su cantidad
  const response = await apiClient.post('/cart/items', { productId, quantity }); // Envía un POST a /cart/items con el ID del producto y la cantidad deseada
  return response.data.data; // Devuelve la información actualizada del carrito o del producto añadido desde el backend
}