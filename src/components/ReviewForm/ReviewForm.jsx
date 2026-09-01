import { useState } from "react"
import { useSelector } from "react-redux"

import { createReview } from "../../api/reviews"
import styles from "./ReviewForm.module.css"

function ReviewForm({ productId, onReviewCreated }) {
  const token = useSelector((state) => state.auth.token)

  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError("")
    setSuccess("")

    if (!rating) {
      setError("Selecciona una valoración")
      return
    }

    if (!comment.trim()) {
      setError("Escribe un comentario")
      return
    }

    if (comment.trim().length < 10) {
      setError("El comentario debe tener al menos 10 caracteres")
      return
    }

    try {
      setLoading(true)

      const review = await createReview({
        productId,
        rating,
        comment: comment.trim(),
      })

      setRating(0)
      setComment("")
      setSuccess("Tu reseña se ha publicado correctamente")

      if (onReviewCreated) {
        onReviewCreated(review)
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <section className={styles.loginMessage}>
        <p>
          Inicia sesión para poder publicar una reseña.
        </p>
      </section>
    )
  }

  return (
    <section className={styles.formBox}>
      <p className={styles.eyebrow}>Tu experiencia</p>
      <h2 className={styles.title}>Escribe una reseña</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <fieldset className={styles.ratingFieldset}>
          <legend className={styles.legend}>
            Valoración
          </legend>

          <div className={styles.ratingButtons}>
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                className={`${styles.starButton} ${
                  value <= rating ? styles.selected : ""
                }`}
                onClick={() => setRating(value)}
                aria-label={`${value} de 5 estrellas`}
                aria-pressed={value <= rating}
              >
                ★
              </button>
            ))}
          </div>
        </fieldset>

        <label className={styles.commentLabel}>
          Comentario
          <textarea
            className={styles.textarea}
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="Comparte tu experiencia con este producto"
            rows={5}
            maxLength={500}
          />
        </label>

        <p className={styles.counter}>
          {comment.length}/500
        </p>

        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}

        {success && (
          <p className={styles.success} role="status">
            {success}
          </p>
        )}

        <button
          type="submit"
          className={styles.submitButton}
          disabled={loading}
        >
          {loading ? "Publicando..." : "Publicar reseña"}
        </button>
      </form>
    </section>
  )
}

export default ReviewForm
