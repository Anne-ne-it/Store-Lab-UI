import { useCallback, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Pencil, Plus, Trash2 } from "lucide-react"
import { deleteProduct, getProducts } from "../../api/products.js"
import styles from "./AdminProductsPage.module.css"

function AdminProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [deletingId, setDeletingId] = useState(null)

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      setError("")
      setProducts(await getProducts())
    } catch (requestError) {
      setError(requestError.response?.data?.message || "No se pudieron cargar los productos.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  async function handleDelete(product) {
    if (!window.confirm(`¿Eliminar “${product.name}”? Esta acción no se puede deshacer.`)) return

    try {
      setDeletingId(product.id)
      setError("")
      await deleteProduct(product.id)
      setProducts((current) => current.filter((item) => item.id !== product.id))
    } catch (requestError) {
      setError(requestError.response?.data?.message || "No se pudo eliminar el producto.")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>STORELAB / CATÁLOGO</p>
          <h1>Productos</h1>
          <p className={styles.description}>Gestiona el catálogo de tu tienda desde un solo lugar.</p>
        </div>
        <Link className={styles.createButton} to="/admin/products/new">
          <Plus size={18} aria-hidden="true" />
          Nuevo producto
        </Link>
      </header>

      {error && <p className={styles.error} role="alert">{error}</p>}

      {loading ? (
        <p className={styles.status}>Cargando productos...</p>
      ) : products.length === 0 ? (
        <section className={styles.empty}>
          <h2>Aún no hay productos</h2>
          <p>Crea el primer producto para comenzar a completar tu catálogo.</p>
          <Link className={styles.createButton} to="/admin/products/new">Crear producto</Link>
        </section>
      ) : (
        <section className={styles.tableCard} aria-label="Listado de productos">
          <div className={styles.tableHeader}>
            <span>Producto</span>
            <span>Categoría</span>
            <span>Precio</span>
            <span>Acciones</span>
          </div>
          <div className={styles.rows}>
            {products.map((product) => (
              <article className={styles.row} key={product.id}>
                <div className={styles.productCell}>
                  <img src={product.image} alt="" className={styles.image} />
                  <div>
                    <strong>{product.name}</strong>
                    <small>ID #{product.id}</small>
                  </div>
                </div>
                <span className={styles.category}>{product.category}</span>
                <strong className={styles.price}>{Number(product.price).toFixed(2)} €</strong>
                <div className={styles.actions}>
                  <Link className={styles.editButton} to={`/admin/products/${product.id}/edit`} aria-label={`Editar ${product.name}`}>
                    <Pencil size={16} aria-hidden="true" />
                    Editar
                  </Link>
                  <button className={styles.deleteButton} type="button" onClick={() => handleDelete(product)} disabled={deletingId === product.id}>
                    <Trash2 size={16} aria-hidden="true" />
                    {deletingId === product.id ? "Eliminando..." : "Eliminar"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}

export default AdminProductsPage
