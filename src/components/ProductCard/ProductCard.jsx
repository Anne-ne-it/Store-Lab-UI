import { Link } from "react-router-dom"
import styles from "./ProductCard.module.css"
import StarRating from "../StarRating/StarRating"
import WishlistButton from "../WishlistButton/WishlistButton" // 1. Importar el botón

function ProductCard({ product }) {
  return (
    <article className={styles.card}>
      {/* 2. Añadir el botón pasándole product.id */}
      <WishlistButton productId={product.id} />

      <span className={styles.category}>{product.category}</span>
      <h2 className={styles.title}>
        {product.name}
      </h2>

      <StarRating
        rating={product.rating}
        showValue
      />

      <p className={styles.description}>
        {product.description}
      </p>

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