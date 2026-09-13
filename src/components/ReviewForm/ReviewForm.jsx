import { useState } from "react" //Importa useState para gestionar los datos del formulario de reseñas
import { useSelector } from "react-redux" //Importa useSelector para comprobar si hay sesión activa del usuario
import { createReview } from "../../api/reviews" //Importa la función que crea una reseña en la API
import styles from "./ReviewForm.module.css" //Importa los estilos del formulario

function ReviewForm({ productId, onReviewCreated }) { //Define el formulario para valorar un producto y dejar un comentario
  const token = useSelector((state) => state.auth.token) //Lee el token para saber si el usuario está autenticado

  const [rating, setRating] = useState(0) //Guarda la puntuación seleccionada del usuario
  const [comment, setComment] = useState("") //Guarda el texto del comentario
  const [error, setError] = useState("") //Guarda errores de validación del formulario
  const [success, setSuccess] = useState("") //Guarda mensajes de éxito cuando la reseña se publica
  const [loading, setLoading] = useState(false) //Controla si se está enviando la reseña

  const handleSubmit = async (event) => { //Se ejecuta al enviar el formulario de reseña
    event.preventDefault() //Evita el refresco de la página por el navegador
    setError("") //Borra errores previos antes de validar
    setSuccess("")

    if (!rating) { //Si el usuario no ha elegido estrellas, bloquea el envío
      setError("Selecciona una valoración")
      return
    }

    if (!comment.trim()) { //Si el comentario está vacío, bloquea el envío
      setError("Escribe un comentario")
      return
    }

    if (comment.trim().length < 10) { //Si el comentario es demasiado corto, pide más detalle
      setError("El comentario debe tener al menos 10 caracteres")
      return
    }

    try {
      setLoading(true) //Activa el estado de carga mientras se envía la reseña

      const review = await createReview({ //Envía la nueva opinión al backend
        productId,
        rating,
        comment: comment.trim(),
      })

      setRating(0) //Reinicia la valoración tras publicarla
      setComment("") //Vacía el campo del comentario
      setSuccess("Tu reseña se ha publicado correctamente") //Muestra éxito al usuario

      if (onReviewCreated) { //Si el componente padre necesita refrescar la lista, le pasa la reseña nueva
        onReviewCreated(review)
      }
    } catch (error) {
      setError(error.message) //Muestra el error del backend o de validación
    } finally {
      setLoading(false) //Desactiva el estado de carga siempre, tanto si hubo éxito como si no
    }
  }

  if (!token) { //Si no hay sesión activa, no permite publicar reseñas 
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
          {comment.length} / 500 caracteres
        </p>

        {error && ( //Muestra el error si existe
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}

        {success && ( //Muestra el mensaje de éxito si la reseña se ha publicado
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

export default ReviewForm //Exporta el componente para poder usarlo en la página de detalle del producto y otras vistas que permitan reseñas
