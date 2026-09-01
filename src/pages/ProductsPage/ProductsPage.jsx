import { useSearchParams } from "react-router-dom"
import { useProducts } from "../../hooks/UseProducts.js"
import ProductGrid from "../../components/ProductGrid/ProductGrid.jsx"
import styles from "./ProductsPage.module.css"

function ProductsPage() {
  const { products, loading, error } = useProducts()
  const [searchParams] = useSearchParams()
  const category = searchParams.get("category")

  const visibleProducts = category
    ? products.filter(
        (product) =>
          product.category.toLowerCase() === category.toLowerCase() ||
          (category.toLowerCase() === "accesorios" &&
            product.category.toLowerCase().startsWith("accesorios"))
      )
    : products

  if (loading) {
    return (
      <main className={styles.page}>
        <p className={styles.status}>Cargando productos...</p>
      </main>
    )
  }

  if (error) {
    return (
      <main className={styles.page}>
        <p className={styles.error}>{error}</p>
      </main>
    )
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>STORE LAB · SURF &amp; SKATE</p>

        <h1>
          {category ? `Catálogo · ${category}` : "Nuestro catálogo"}
        </h1>

        <p className={styles.description}>
          Material, estilo y actitud para disfrutar de cada sesión dentro y fuera del agua.
        </p>
      </header>

      {visibleProducts.length === 0 ? (
        <p className={styles.status}>No hay productos disponibles.</p>
      ) : (
        <ProductGrid products={visibleProducts} />
      )}
    </main>
  )
}

export default ProductsPage
