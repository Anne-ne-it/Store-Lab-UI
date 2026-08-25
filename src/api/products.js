const API_URL = "http://localhost:3000/api";

export async function getProducts( ) {
  const response = await fetch(`${API_URL}/products`);

  if (!response.ok) {
    throw new Error("No se pudieron obtener los productos");
  }

  return response.json();
}

export async function getProductById(productId) {
  const response = await fetch(`${API_URL}/products/${productId}`);

  if (!response.ok) {
    throw new Error("No se pudo obtener el producto");
  }

  return response.json();
}
