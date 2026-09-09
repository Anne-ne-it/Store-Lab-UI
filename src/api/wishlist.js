import apiClient from './axios'; //Importa la instancia configurada de Axios desde un archivo local ('./axios') para realizar peticiones HTTP

export async function getWishlist() { //Función asíncrona para obtener los productos de la lista de deseos del usuario
  const response = await apiClient.get('/wishlist'); //Realiza una petición GET al endpoint usando la instancia personalizada de Axios

    return response.data.data; //Devuelve la propiedad 'data' anidada dentro de la respuesta HTTP recibida (response.data.data)

}

export async function toggleWishlist(productId) { //Función asíncrona para agregar o quitar un producto de la lista de deseos mediante su ID
  const response = await apiClient.post('/wishlist/toggle', { productId }); //Realiza una petición POST al endpoint enviando el productId en el cuerpo (body) de la solicitud

  
  return response.data.data; //Devuelve la propiedad 'data' anidada de la respuesta HTTP recibida

}