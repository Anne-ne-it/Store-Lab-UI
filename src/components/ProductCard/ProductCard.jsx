import { Link } from "react-router-dom"
import styles from "./ProductCard.module.css"
import StarRating from "../StarRating/StarRating"
import WishlistButton from "../WishlistButton/WishlistButton" // 1. Importar el botón

function ProductCard({ product }) {
  const productRating = Number(
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

  return (
    <article className={styles.card}>
      {/* 2. Añadir el botón pasándole product.id */}
      <WishlistButton productId={product.id} />

      <span className={styles.category}>{product.category}</span>
      <h2 className={styles.title}>
        {product.name}
      </h2>

      <StarRating
        rating={productRating}
        showValue
      />

      <p className={styles.price}>
        {product.price} €
      </p>

      <Link
        className={styles.link}
        to={`/products/${product.id}`}
      >
        Detalles
      </Link>
    </article>
  )
}

export default ProductCard