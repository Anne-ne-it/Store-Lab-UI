import { useEffect, useState } from "react" // Importa hooks de React para gestionar efectos y el estado local del detalle del producto
import { useParams } from "react-router-dom" // Importa useParams para leer el id del producto desde la URL
import { useDispatch, useSelector } from "react-redux" // Importa hooks de Redux para leer estado y despachar acciones

import {
  fetchWishlist,
  toggleWishlist,
} from "../../store/wishlistSlice.js" // Importa acciones para cargar y alternar la wishlist del usuario
import { addCartItem } from "../../store/cartSlice.js" // Importa la acción para añadir productos al carrito
import { createReview } from "../../api/reviews.js" // Importa la función que crea reseñas para un producto, aunque no se usa directamente aquí
import { getProductById } from "../../api/products.js" // Importa la consulta para volver a cargar un producto tras publicar una reseña
import { useProduct } from "../../hooks/UseProduct.js" // Importa el hook que obtiene el producto concreto por id
import StarRating from "../../components/StarRating/StarRating.jsx" // Importa el componente de estrellas para valorar el producto
import ReviewList from "../../components/ReviewList/ReviewList.jsx" // Importa la lista de reseñas del producto
import ReviewForm from "../../components/ReviewForm/ReviewForm.jsx" // Importa el formulario para añadir una reseña
import styles from "./ProductDetailPage.module.css" // Importa los estilos del detalle de producto

function ProductDetailPage() { // Define la página que muestra toda la información detallada del producto
  const { productId } = useParams() // Obtiene el id del producto desde la URL
  const dispatch = useDispatch() // Permite ejecutar acciones Redux como guardar favoritos o añadir al carrito
  const { product, loading, error } = useProduct(productId) // Obtiene el producto, su estado de carga y posibles errores

  const { productIds } = useSelector((state) => state.wishlist) // Lee los IDs de los productos favoritos
  const token = useSelector((state) => state.auth.token) // Lee si el usuario tiene sesión activa

  const [reviewsVersion, setReviewsVersion] = useState(0) // Guarda una versión para forzar la recarga de las reseñas tras publicar una nueva

  useEffect(() => { // Al cambiar el token, carga la wishlist del usuario si está autenticado
    if (token) {
      dispatch(fetchWishlist())
    }
  }, [dispatch, token])

  if (loading) { // Si la información del producto todavía se está cargando, muestra un estado de espera
    return (
      <main className={styles.ProductDetailPage}>
        <p>Cargando producto...</p>
      </main>
    )
  }

  if (error || !product) { // Si hubo error o no existe el producto, muestra la vista 404 de producto no encontrado
    return (
      <main className={styles.ProductDetailPage}>
        <div className={styles.error}>
          <h2 className={styles.errorCode}>404</h2>
          <p className={styles.errorMessage}>
            Producto no encontrado
          </p>
        </div>
      </main>
    )
  }

  const isFavorite = productIds.includes(product.id) // Comprueba si el producto actual ya está guardado como favorito
  const productRating = Number( // Obtiene la valoración del producto desde distintas claves posibles del backend
    product?.rating ??
    product?.averageRating ??
    product?.avgRating ??
    product?.average_rating ??
    product?.avg_rating ??
    product?.promedio ??
    product?.reviewSummary?.average ??
    product?.reviewSummary?.rating ??
    product?.reviews?.averageRating ??
    product?.reviews?.[0]?.rating ??
    0
  )

  const handleToggleWishlist = () => { // Alterna el producto en favoritos con comprobación de login
    if (!token) {
      window.alert("Debes iniciar sesión para guardar favoritos")
      return
    }

    dispatch(toggleWishlist(product.id))
  }

  const handleAddToCart = () => { // Añade el producto al carrito con una unidad, comprobando si hay sesión
    if (!token) {
      window.alert("Debes iniciar sesión para comprar")
      return
    }

    dispatch(
      addCartItem({
        product,
        quantity: 1,
      })
    )
  }

  const handleReviewCreated = async () => { // Cuando se publica una reseña, vuelve a cargar el producto para refrescar valoraciones
    const refreshedProduct = await getProductById(product.id)
    setProduct(refreshedProduct) // Guarda el producto actualizado en el estado local, si existiese; si no, no se usaría exactamente aquí
    setReviewsVersion((version) => version + 1) // Incrementa la versión para forzar re-render de la lista de reseñas
  }

  return (
    <main className={styles.ProductDetailPage}> 
      <section className={styles.product}> 
        <div className={styles.imageContainer}> 
          {product.image ? (
            <img
              className={styles.productImage}
              src={product.image || undefined}
              alt={product.name}
            />
          ) : null}
        </div>

        <div className={styles.productInfo}> 
          <span className={styles.productCategory}>
            {product.category}
          </span>

          <h1 className={styles.productName}>
            {product.name}
          </h1>

          <StarRating
            rating={productRating}
            showValue
          />

          <p className={styles.productDescription}>
            {product.description}
          </p>

          <p className={styles.productPrice}>
            {Number(product.price).toFixed(2)} €
          </p>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.buyButton}
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
            >
              {product.stock > 0
                ? "Añadir al carrito"
                : "Sin stock"}
            </button>

            <button
              type="button"
              className={`${styles.wishlistButton} ${
                isFavorite
                  ? styles.wishlistButtonActive
                  : ""
              }`}
              onClick={handleToggleWishlist}
              aria-label={
                isFavorite
                  ? "Quitar producto de favoritos"
                  : "Añadir producto a favoritos"
              }
              aria-pressed={isFavorite}
            >
              {isFavorite ? "♥" : "♡"}
            </button>
          </div>
        </div>
      </section>

      <section className={styles.reviewsSection}>
        <ReviewList
          key={reviewsVersion}
          productId={product.id}
        />

        <ReviewForm
          productId={product.id}
          onReviewCreated={handleReviewCreated}
        />
      </section>
    </main>
  )
}

export default ProductDetailPage
