import { useState } from "react"
import styles from "./ContactPage.module.css"

const initialForm = {
  name: "",
  email: "",
  subject: "",
  message: "",
}

function ContactPage() {
  const [form, setForm] = useState(initialForm)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setSubmitted(true)
    setForm(initialForm)
  }

  return (
    <main className={styles.page}>
      <section className={styles.container}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>Contacto</p>
          <h1>Hablemos</h1>
          <p className={styles.description}>
            Envíanos tus dudas, sugerencias o preguntas y te responderemos lo antes posible.
          </p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.fieldRow}>
            <label className={styles.field}>
              <span>Nombre</span>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Tu nombre"
                required
              />
            </label>

            <label className={styles.field}>
              <span>Email</span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                required
              />
            </label>
          </div>

          <label className={styles.field}>
            <span>Asunto</span>
            <input
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="¿Sobre qué quieres contactar?"
              required
            />
          </label>

          <label className={styles.field}>
            <span>Mensaje</span>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Cuéntanos tus dudas o consultas..."
              rows="6"
              required
            />
          </label>

          <button type="submit" className={styles.submitButton}>
            Enviar mensaje
          </button>

          {submitted && (
            <p className={styles.successMessage}>
              Tu mensaje ha sido enviado correctamente. Te responderemos pronto.
            </p>
          )}
        </form>
      </section>
    </main>
  )
}

export default ContactPage
