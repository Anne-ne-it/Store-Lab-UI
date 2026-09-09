import apiClient from './axios'; //Importa la instancia cliente de Axios personalizada para realizar las peticiones a la API

export async function getCart() { //Función asíncrona para obtener el contenido completo del carrito de compras del usuario
  const response = await apiClient.get('/cart'); //Realiza una petición GET a la ruta '/cart'
  return response.data.data; //Devuelve únicamente la información del carrito contenida en la propiedad 'data.data'
}

export async function addCartItem(productId, quantity = 1) { //Función asíncrona para añadir un nuevo producto (o incrementar su cantidad) al carrito
  const response = await apiClient.post('/cart/items', { productId, quantity }); //Realiza una petición POST enviando el ID del producto y la cantidad (por defecto 1 si no se indica)
  return response.data.data; //Devuelve los datos actualizados del ítem o del carrito retornados por el servidor
}