import { useState } from "react" // Importa useState para guardar el valor de búsqueda del usuario en la vista del catálogo
import { useSearchParams } from "react-router-dom" // Importa useSearchParams para leer filtros desde la URL, por ejemplo category
import { useProducts } from "../../hooks/UseProducts.js" // Importa el hook para obtener la lista de productos desde la API
import ProductGrid from "../../components/ProductGrid/ProductGrid.jsx" // Importa la grilla que renderiza las tarjetas de productos
import styles from "./ProductsPage.module.css" // Importa los estilos de la página de catálogo

function ProductsPage() { // Define la vista que muestra todos los productos filtrables por categoría y búsqueda
  const { products, loading, error } = useProducts() // Obtiene la lista de productos y su estado de carga/error
  const [searchParams] = useSearchParams() // Lee los parámetros de la URL, como ?category=surf
  const [search, setSearch] = useState("") // Guarda el texto escrito por el usuario en el buscador
  const category = searchParams.get("category") // Extrae la categoría activa desde la URL para filtrar productos

  const categoryProducts = category // Aplica el filtro por categoría si existe en la URL
    ? products.filter(
        (product) =>
          product.category.toLowerCase() === category.toLowerCase() ||
          (category.toLowerCase() === "accesorios" &&
            product.category.toLowerCase().startsWith("accesorios"))
      )
    : products // Si no hay categoría, muestra todos los productos

  const visibleProducts = !search.trim() // Si la barra de búsqueda está vacía, muestra el catálogo filtrado
    ? categoryProducts
    : categoryProducts.filter((product) => { // Si hay texto escrito, busca por nombre, título o categoría
        const query = search.toLowerCase().trim()

        return (
          product.name?.toLowerCase().includes(query) ||
          product.title?.toLowerCase().includes(query) ||
          product.category?.toLowerCase().includes(query)
        )
      })

  if (loading) { // Si la carga de productos está en curso, muestra un mensaje de espera
    return (
      <main className={styles.page}>
        <p className={styles.status}>Cargando productos...</p>
      </main>
    )
  }

  if (error) { // Si la API falla, muestra el error en pantalla
    return (
      <main className={styles.page}>
        <p className={styles.error}>{error}</p>
      </main>
    )
  }

  return (
    <main className={styles.page}> // Contenedor principal de la página de catálogo
      <header className={styles.header}> // Encabezado con título y marca del catálogo
        <p className={styles.eyebrow}>STORE LAB · SURF &amp; SKATE</p>

        <h1>
          {category ? `Catálogo · ${category}` : "Nuestro catálogo"}
        </h1>

      </header>

      <div className={styles.searchBox}> // Contenedor del buscador de productos
        <label htmlFor="catalog-search">Buscar productos</label>
        <input
          id="catalog-search"
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Busca por nombre o categoría..."
        />
      </div>

      {visibleProducts.length === 0 ? ( // Si no hay productos tras aplicar filtros, muestra estado vacío
        <p className={styles.status}>
          {!search.trim()
            ? "No hay productos disponibles."
            : `No se encontraron productos que coincidan con "${search}".`}
        </p>
      ) : (
        <ProductGrid products={visibleProducts} /> // Si hay productos, los renderiza en la grilla
      )}
    </main>
  )
}

export default ProductsPage
