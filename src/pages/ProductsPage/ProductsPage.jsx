import { useState } from "react"
import { useSearchParams } from "react-router-dom"
import { useProducts } from "../../hooks/UseProducts.js"
import ProductGrid from "../../components/ProductGrid/ProductGrid.jsx"
import styles from "./ProductsPage.module.css"

function ProductsPage() {
  const { products, loading, error } = useProducts()
  const [searchParams] = useSearchParams()
  const [search, setSearch] = useState("")
  const category = searchParams.get("category")

  const categoryProducts = category
    ? products.filter(
        (product) =>
          product.category.toLowerCase() === category.toLowerCase() ||
          (category.toLowerCase() === "accesorios" &&
            product.category.toLowerCase().startsWith("accesorios"))
      )
    : products

  const visibleProducts = !search.trim()
    ? categoryProducts
    : categoryProducts.filter((product) => {
        const query = search.toLowerCase().trim()

        return (
          product.name?.toLowerCase().includes(query) ||
          product.title?.toLowerCase().includes(query) ||
          product.category?.toLowerCase().includes(query)
        )
      })

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

      <div className={styles.searchBox}>
        <label htmlFor="catalog-search">Buscar productos</label>
        <input
          id="catalog-search"
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Busca por nombre o categoría..."
        />
      </div>

      {visibleProducts.length === 0 ? (
        <p className={styles.status}>
          {!search.trim()
            ? "No hay productos disponibles."
            : `No se encontraron productos que coincidan con "${search}".`}
        </p>
      ) : (
        <ProductGrid products={visibleProducts} />
      )}
    </main>
  )
}

export default ProductsPage
