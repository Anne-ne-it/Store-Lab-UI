import { useCallback, useEffect, useState } from "react" //Importa hooks de React para manejar funciones memorizadas (useCallback), ciclo de vida (useEffect) y estado local (useState)
import { Link } from "react-router-dom" //Importa el componente Link para la navegación entre vistas
import { Pencil, Plus, Trash2 } from "lucide-react" //Importa los iconos de edición, creación y eliminación
import { deleteProduct, getProducts } from "../../api/products.js" //Importa las funciones API para obtener el listado y eliminar un producto
import styles from "./AdminProductsPage.module.css" //Importa los estilos CSS en formato módulo

function AdminProductsPage() { //Componente principal para listar y gestionar productos en el panel de administración
  const [products, setProducts] = useState([]) //Estado para guardar la lista de productos
  const [loading, setLoading] = useState(true) //Estado para controlar si los productos se están cargando
  const [error, setError] = useState("") //Estado para guardar mensajes de error en peticiones
  const [deletingId, setDeletingId] = useState(null) //Estado para identificar qué producto específico se está eliminando en este momento (evita clics múltiples)

  const fetchProducts = useCallback(async () => { //Función memorizada para obtener la lista de productos desde la API
    try {
      setLoading(true)
      setError("")
      setProducts(await getProducts()) //Llama a la API y actualiza el estado con la lista recibida
    } catch (requestError) {
      setError(requestError.response?.data?.message || "No se pudieron cargar los productos.") //Captura y guarda el mensaje de error de la respuesta si falla
    } finally {
      setLoading(false) //Finaliza el indicador de carga
    }
  }, [])

  useEffect(() => { //Hook para cargar la lista al montar el componente
    fetchProducts()
  }, [fetchProducts])

  async function handleDelete(product) { //Función asíncrona para manejar el borrado de un producto
    if (!window.confirm(`¿Eliminar “${product.name}”? Esta acción no se puede deshacer.`)) //Muestra una alerta nativa de confirmación antes de proceder
    return
    try {
      setDeletingId(product.id) //Registra el ID del producto que se está eliminando
      setError("")
      await deleteProduct(product.id) //Hace la petición de borrado al backend
      setProducts((current) => current.filter((item) => item.id !== product.id)) //Remueve el producto de la lista local sin necesidad de recargar la página completa
    } catch (requestError) {
      setError(requestError.response?.data?.message || "No se pudo eliminar el producto.") //Guarda el error en caso de que la API rechace la eliminación
    } finally {
      setDeletingId(null) //Limpia el estado de eliminación en curso
    }
  }

  return (
    <main className={styles.page}>
      {/*Encabezado con título principal y botón para crear nuevo producto*/}
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

      {/*Mensaje de error visible si alguna petición falla*/}
      {error && <p className={styles.error} role="alert">{error}</p>}

      {/*Renderizado condicional: Carga -> Estado Vacío -> Listado de datos*/}
      {loading ? (
        <p className={styles.status}>Cargando productos...</p>
      ) : products.length === 0 ? (
        //Pantalla mostrada si no hay productos registrados en el catálogo
        <section className={styles.empty}>
          <h2>Aún no hay productos</h2>
          <p>Crea el primer producto para comenzar a completar tu catálogo.</p>
          <Link className={styles.createButton} to="/admin/products/new">Crear producto</Link>
        </section>
      ) : (
        //Tabla/Cuadrícula con el listado de productos
        <section className={styles.tableCard} aria-label="Listado de productos">
          {/*Encabezado de la tabla*/}
          <div className={styles.tableHeader}>
            <span>Producto</span>
            <span>Categoría</span>
            <span>Precio</span>
            <span>Acciones</span>
          </div>
          {/*Filas por cada producto*/}
          <div className={styles.rows}>
            {products.map((product) => (
              <article className={styles.row} key={product.id}>
                {/*Celda de imagen e información básica del producto*/}
                <div className={styles.productCell}>
                  {product.image ? (
                    <img src={product.image || undefined} alt="" className={styles.image} />
                  ) : null}
                  <div>
                    <strong>{product.name}</strong>
                    <small>ID #{product.id}</small>
                  </div>
                </div>
                {/*Celda de categoría*/}
                <span className={styles.category}>{product.category}</span>
                {/*Celda de precio formateado a 2 decimales*/}
                <strong className={styles.price}>{Number(product.price).toFixed(2)} €</strong>
                {/*Celda con los botones de acción (Editar y Eliminar)*/}
                <div className={styles.actions}>
                  <Link className={styles.editButton} to={`/admin/products/${product.id}/edit`} aria-label={`Editar ${product.name}`}>
                    <Pencil size={16} aria-hidden="true" />
                    Editar
                  </Link>
                  {/*Botón de eliminar, deshabilitado si ya está en proceso de borrado*/}
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

export default AdminProductsPage //Exporta el componente por defecto
