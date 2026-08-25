const API_URL = "http://localhost:3000/api";

export async function getReviews(productId) {
  if (!productId) {
    throw new Error("El productId es obligatorio");
  }

  const response = await fetch(
    `${API_URL}/review/product/${productId}`
  );

  if (!response.ok) {
    throw new Error(`Error HTTP: ${response.status}`);
  }

  const result = await response.json();

  return result.data ?? result.dara ?? [];
}
