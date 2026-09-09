import api from "./axios.js" //Importa la instancia configurada de Axios para enviar peticiones HTTP

function unwrap(response) { //Función auxiliar que extrae y simplifica la respuesta de la API,
  return response.data?.data ?? response.data //Devuelve 'response.data.data' si existe o 'response.data' como alternativa
}

export async function getProducts(params = {}) { //Obtiene el catálogo de productos permitiendo filtros o paginación mediante parámetros
  const response = await api.get("/api/products", { params }) //Realiza una petición GET a la ruta '/api/products' enviando los parámetros opcionales
  return unwrap(response) //Devuelve la información de los productos extraída de la respuesta
}

export async function getProductById(id) { //Obtiene la información detallada de un producto específico mediante su ID
  const response = await api.get(`/api/products/${id}`) //Realiza una petición GET a la ruta '/api/products/{id}'
  return unwrap(response) //Devuelve la información del producto extraída de la respuesta
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