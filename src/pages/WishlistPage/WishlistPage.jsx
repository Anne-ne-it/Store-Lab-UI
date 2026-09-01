import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"

import { toggleWishlist } from "../../store/wishlistSlice.js"
import { useProducts } from "../../hooks/UseProducts.js"
import styles from "./WishlistPage.module.css"

function WishlistPage() {
  const dispatch = useDispatch()
  const productIds = useSelector(
    (state) => state.wishlist.productIds
  )
  const { products, loading, error } = useProducts()

  const favoriteProducts = products.filter((product) =>
    productIds.includes(product.id)
  )

  const handleRemove = (productId) => {
    dispatch(toggleWishlist(productId))
  }

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Mis favoritos</h1>

      {loading && <p className={styles.statusMessage}>Cargando productos...</p>}
      {error && <p className={styles.statusMessage}>{error}</p>}

      {!loading && !error && favoriteProducts.length === 0 && (
        <p className={styles.statusMessage}>Aún no tienes productos favoritos.</p>
      )}

      {!loading && !error && favoriteProducts.length > 0 && (
        <section className={styles.grid}>
          {favoriteProducts.map((product) => (
            <article key={product.id} className={styles.card}>
              <Link to={`/products/${product.id}`} className={styles.productLink}>
                <img
                  src={product.image}
                  alt={product.name}
                  className={styles.image}
                />
                <h2 className={styles.productName}>{product.name}</h2>
              </Link>

              <p className={styles.price}>{product.price.toFixed(2)} €</p>

              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => handleRemove(product.id)}
              >
                Quitar de favoritos
              </button>
            </article>
          ))}
        </section>
      )}
    </main>
  )
}

export default WishlistPage