const API_URL = `${
  import.meta.env.VITE_API_URL || "http://localhost:3000"
}/api`

export async function getReviews(productId ) {
  if (!productId) {
    throw new Error("El productId es obligatorio")
  }

  const response = await fetch(
    `${API_URL}/review/product/${productId}`
  )

  if (!response.ok) {
    throw new Error(`Error HTTP: ${response.status}`)
  }

  const result = await response.json()

  return result.data ?? []
}

export async function createReview({
  productId,
  rating,
  comment,
}) {
  const token = localStorage.getItem("token")

  if (!token) {
    throw new Error("Debes iniciar sesión para publicar una reseña")
  }

  const response = await fetch(`${API_URL}/review`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      productId,
      rating,
      comment,
    }),
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(
      result.message || "No se pudo crear la reseña"
    )
  }

  return result.data
}
