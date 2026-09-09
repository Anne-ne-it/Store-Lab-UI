import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Save } from "lucide-react"
import { createProduct, getProductById, updateProduct } from "../../api/products.js"
import styles from "./AdminProductFormPage.module.css"

const initialForm = { name: "", category: "", price: "", description: "", image: "https://via.placeholder.com/600x400?text=StoreLab" }

function AdminProductFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = Boolean(id)
  const [formData, setFormData] = useState(initialForm)
  const [loading, setLoading] = useState(isEditing)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!isEditing) return
    async function loadProduct() {
      try {
        setLoading(true)
        const product = await getProductById(id)
        setFormData({
          name: product.name ?? "",
          category: product.category ?? "",
          price: product.price ?? "",
          description: product.description ?? "",
          image: product.image ?? initialForm.image,
        })
      } catch (requestError) {
        setError(requestError.response?.data?.message || "No se pudo cargar el producto.")
      } finally {
        setLoading(false)
      }
    }
    loadProduct()
  }, [id, isEditing])

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const name = formData.name.trim()
    const category = formData.category.trim()
    const description = formData.description.trim()
    const image = formData.image.trim()
    const price = Number(formData.price)

    if (!name || !category || !description || !image) {
      setError("Completa todos los campos obligatorios.")
      return
    }
    if (!Number.isFinite(price) || price < 0) {
      setError("El precio debe ser un número mayor o igual que 0.")
      return
    }

    try {
      setSaving(true)
      setError("")
      const payload = { name, category, description, image, price }
      if (isEditing) await updateProduct(id, payload)
      else await createProduct(payload)
      navigate("/admin/products")
    } catch (requestError) {
      setError(requestError.response?.data?.message || "No se pudo guardar el producto.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <main className={styles.page}><p className={styles.status}>Cargando producto...</p></main>

  return (
    <main className={styles.page}>
      <Link className={styles.backLink} to="/admin/products"><ArrowLeft size={16} aria-hidden="true" /> Volver a productos</Link>
      <section className={styles.card}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>STORELAB / CATÁLOGO</p>
          <h1>{isEditing ? "Editar producto" : "Nuevo producto"}</h1>
          <p>{isEditing ? "Actualiza la información del producto." : "Añade un producto al catálogo de StoreLab."}</p>
        </header>

        {error && <p className={styles.error} role="alert">{error}</p>}

        <form className={styles.form} onSubmit={handleSubmit}>
          <label>Nombre<input name="name" value={formData.name} onChange={handleChange} placeholder="Ej. Tabla Ocean Pro" required /></label>
          <label>Categoría<input name="category" value={formData.category} onChange={handleChange} placeholder="Ej. Surf" required /></label>
          <label>Precio (€)<input name="price" type="number" min="0" step="0.01" value={formData.price} onChange={handleChange} placeholder="0.00" required /></label>
          <label>Imagen (URL)<input name="image" type="url" value={formData.image} onChange={handleChange} placeholder="https://..." required /></label>
          <label className={styles.fullWidth}>Descripción<textarea name="description" value={formData.description} onChange={handleChange} rows="5" placeholder="Describe el producto..." required /></label>
          <button className={styles.submitButton} type="submit" disabled={saving}><Save size={17} aria-hidden="true" /> {saving ? "Guardando..." : isEditing ? "Actualizar producto" : "Crear producto"}</button>
        </form>
      </section>
    </main>
  )
}

export default AdminProductFormPage
