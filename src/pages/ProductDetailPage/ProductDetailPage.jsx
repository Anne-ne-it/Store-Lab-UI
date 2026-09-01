import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"

import {
  fetchWishlist,
  toggleWishlist,
} from "../../store/wishlistSlice.js"
import { addCartItem } from "../../store/cartSlice.js"
import { createReview } from "../../api/reviews.js"
import { useProduct } from "../../hooks/UseProduct.js"
import StarRating from "../../components/StarRating/StarRating.jsx"
import ReviewList from "../../components/ReviewList/ReviewList.jsx"
import ReviewForm from "../../components/ReviewForm/ReviewForm.jsx"
import styles from "./ProductDetailPage.module.css"

function ProductDetailPage() {
  const { productId } = useParams()
  const dispatch = useDispatch()
  const { product, loading, error } = useProduct(productId)

  const { productIds } = useSelector((state) => state.wishlist)
  const token = useSelector((state) => state.auth.token)

  const [reviewsVersion, setReviewsVersion] = useState(0)

  useEffect(() => {
    if (token) {
      dispatch(fetchWishlist())
    }
  }, [dispatch, token])

  if (loading) {
    return (
      <main className={styles.ProductDetailPage}>
        <p>Cargando producto...</p>
      </main>
    )
  }

  if (error || !product) {
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

  const isFavorite = productIds.includes(product.id)

  const handleToggleWishlist = () => {
    if (!token) {
      window.alert("Debes iniciar sesión para guardar favoritos")
      return
    }

    dispatch(toggleWishlist(product.id))
  }

  const handleAddToCart = () => {
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

  const handleReviewCreated = () => {
    setReviewsVersion((version) => version + 1)
  }

  return (
    <main className={styles.ProductDetailPage}>
      <section className={styles.product}>
        <div className={styles.imageContainer}>
          <img
            className={styles.productImage}
            src={product.image}
            alt={product.name}
          />
        </div>

        <div className={styles.productInfo}>
          <span className={styles.productCategory}>
            {product.category}
          </span>

          <h1 className={styles.productName}>
            {product.name}
          </h1>

          <StarRating
            rating={product.rating}
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
