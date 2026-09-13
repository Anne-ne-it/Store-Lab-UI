import { Link } from "react-router-dom" //Importa Link para navegar al detalle del producto sin recargar la página
import styles from "./ProductCard.module.css" //Importa los estilos específicos de la tarjeta del producto
import StarRating from "../StarRating/StarRating" //Importa el componente de valoración con estrellas
import WishlistButton from "../WishlistButton/WishlistButton" //Importa el botón para añadir o quitar de favoritos

function ProductCard({ product }) { //Define la tarjeta de producto reutilizable para listados y home
  const productRating = Number( //Obtiene la valoración del producto desde distintas propiedades posibles del backend
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
      <WishlistButton productId={product.id} /> 

      {product.image && ( //Si el producto tiene imagen, la muestra en un bloque
        <div className={styles.imageWrap}>
          <img
            src={product.image}
            alt={product.name}
            className={styles.image}
          />
        </div>
      )}

      <span className={styles.category}>{product.category}</span>
      <h2 className={styles.title}>
        {product.name}
      </h2>

      <StarRating //Muestra la valoración con estrellas y un valor numérico
        rating={productRating}
        showValue
      />

      <p className={styles.price}>
        {product.price} €
      </p>

      <Link //Enlace para abrir la vista de detalle del producto
        className={styles.link}
        to={`/products/${product.id}`}
      >
        Detalles
      </Link>
    </article>
  )
}

export default ProductCard //Exporta el componente por defecto para poder utilizarlo en catálogos y listas de productos