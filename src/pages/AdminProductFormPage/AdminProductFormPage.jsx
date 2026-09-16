import { useEffect, useState } from "react" //Importa los hooks de React para manejar efectos de ciclo de vida y estado local
import { Link, useNavigate, useParams } from "react-router-dom" //Importa utilidades de react-router-dom para navegación, enlaces y lectura de parámetros de la URL
import { ArrowLeft, Save } from "lucide-react" //Importa los iconos de la librería lucide-react
import { createProduct, getProductById, updateProduct } from "../../api/products.js" //Importa las funciones que se comunican con la API para crear, obtener y actualizar productos
import styles from "./AdminProductFormPage.module.css" //Importa los estilos CSS parametrizados como módulos

const initialForm = { name: "", category: "", price: "", description: "", image: "https://via.placeholder.com/600x400?text=StoreLab" } //Define el estado inicial del formulario con una imagen por defecto

function AdminProductFormPage() { //Componente principal para el formulario de administración de productos (Crear / Editar)
  const { id } = useParams() //Extrae el parámetro 'id' de la URL (si existe, indica que estamos editando)
  const navigate = useNavigate() //Hook para redireccionar al usuario a otra ruta de forma programática

  const isEditing = Boolean(id) //Determina si el formulario está en modo edición (true si 'id' existe, false si es undefined)

  const [formData, setFormData] = useState(initialForm) //Estado que guarda la información escrita en el formulario

  const [loading, setLoading] = useState(isEditing) //Estado para indicar si la página está cargando los datos del producto (solo si editamos)

  const [saving, setSaving] = useState(false) //Estado para indicar si la petición de guardar/actualizar está en proceso

  const [error, setError] = useState("") //Estado para guardar y mostrar mensajes de error al usuario

  useEffect(() => { //Hook que se ejecuta al montar el componente o cuando cambia 'id' o 'isEditing'
    if (!isEditing) return //Si no es un formulario de edición, se salta la carga del producto
    
    async function loadProduct() { //Función asíncrona interna para traer la información del producto a editar
      try {
        setLoading(true)
        const product = await getProductById(id) //Llama a la API para obtener el producto usando su ID
        setFormData({ //Rellena el estado del formulario con la información obtenida (o valores por defecto)
          name: product.name ?? "",
          category: product.category ?? "",
          price: product.price ?? "",
          description: product.description ?? "",
          image: product.image ?? initialForm.image,
        })
      } catch (requestError) {
        setError(requestError.response?.data?.message || "No se pudo cargar el producto.") //Captura el error y guarda un mensaje descriptivo en el estado 'error'
      } finally {
        setLoading(false) //Desactiva el estado de carga general al finalizar la petición
      }
    }
    loadProduct()
  }, [id, isEditing])

  function handleChange(event) { //Manejador para actualizar el estado del formulario conforme el usuario escribe
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value })) //Copia el estado actual e infecta el valor nuevo dinámicamente según la propiedad 'name' del input
  }

  async function handleSubmit(event) { //Manejador del envío del formulario (Submit)
    event.preventDefault() //Previene el comportamiento por defecto de recargar la página

    const name = formData.name.trim() //Limpia espacios en blanco innecesarios al inicio y final de las cadenas
    const category = formData.category.trim()
    const description = formData.description.trim()
    const image = formData.image.trim()
    const price = Number(formData.price) //Convierte el valor del precio a número

    if (!name || !category || !description || !image) { //Validación local: comprueba que ningún campo obligatorio esté vacío
      setError("Completa todos los campos obligatorios.")
      return
    }
    if (!Number.isFinite(price) || price < 0) { //Validación local: verifica que el precio sea un número válido y mayor o igual a 0
      setError("El precio debe ser un número mayor o igual que 0.")
      return
    }

    try {
      setSaving(true) //Activa el indicador de guardado y limpia errores previos
      setError("")
      const payload = { name, category, description, image, price } //Estructura el objeto payload listo para enviar al backend
      
      if (isEditing) await updateProduct(id, payload) //Condicional: actualiza el producto si está editando o crea uno nuevo si no
      else await createProduct(payload)
      
      navigate("/admin/products") //Redirige al listado de productos de administración tras guardar con éxito
    } catch (requestError) {
      setError(requestError.response?.data?.message || "No se pudo guardar el producto.") //Si falla la API, muestra el mensaje de error correspondiente
    } finally {
      setSaving(false) //Desactiva el indicador de guardado
    }
  }

  if (loading) return <main className={styles.page}><p className={styles.status}>Cargando producto...</p></main> //Si está cargando los datos iniciales, muestra una pantalla de carga temporal

  return (
    <main className={styles.page}>
      {/*Enlace para volver al listado de productos*/}
      <Link className={styles.backLink} to="/admin/products"><ArrowLeft size={16} aria-hidden="true" /> Volver a productos</Link>
      
      <section className={styles.card}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>STORELAB / CATÁLOGO</p>
          {/*Muestra un título dinámico según si crea o edita*/}
          <h1>{isEditing ? "Editar producto" : "Nuevo producto"}</h1>
          <p>{isEditing ? "Actualiza la información del producto." : "Añade un producto al catálogo de StoreLab."}</p>
        </header>

        {/*Renderizado del mensaje de error (solo si existe)*/}
        {error && <p className={styles.error} role="alert">{error}</p>}

        {/*Formulario controlado por la función handleSubmit*/}
        <form className={styles.form} onSubmit={handleSubmit}>
          <label>Nombre<input name="name" value={formData.name} onChange={handleChange} placeholder="Ej. Tabla Ocean Pro" required /></label>
          <label>Categoría<input name="category" value={formData.category} onChange={handleChange} placeholder="Ej. Surf" required /></label>
          <label>Precio (€)<input name="price" type="number" min="0" step="0.01" value={formData.price} onChange={handleChange} placeholder="0.00" required /></label>
          <label>Imagen (URL)<input name="image" type="url" value={formData.image} onChange={handleChange} placeholder="https://..." required /></label>
          <label className={styles.fullWidth}>Descripción<textarea name="description" value={formData.description} onChange={handleChange} rows="5" placeholder="Describe el producto..." required /></label>
          
          {/*Botón de envío: deshabilitado mientras se guarda la información para evitar peticiones duplicadas*/}
          <button className={styles.submitButton} type="submit" disabled={saving}>
            <Save size={17} aria-hidden="true" /> 
            {saving ? "Guardando..." : isEditing ? "Actualizar producto" : "Crear producto"}
          </button>
        </form>
      </section>
    </main>
  )
}

export default AdminProductFormPage //Exporta el componente para poder ser utilizado en las rutas de React Router
