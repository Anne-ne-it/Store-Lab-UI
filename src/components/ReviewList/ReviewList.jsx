import { useReviews } from "../../hooks/useReviews";
import StarRating from "../StarRating/StarRating";
import styles from "./ReviewList.module.css";

function ReviewList({ productId }) {
  const { reviews, loading, error } = useReviews(productId);

  if (loading) {
    return (
      <section className={styles.section}>
        <h2 className={styles.title}>Opiniones de la comunidad</h2>
        <p className={styles.message}>Cargando reseñas...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.section}>
        <h2 className={styles.title}>Opiniones de la comunidad</h2>
        <p className={styles.error}>{error}</p>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Comunidad STORE LAB</p>
          <h2 className={styles.title}>Opiniones de la comunidad</h2>
        </div>

        <span className={styles.counter}>
          {reviews.length} {reviews.length === 1 ? "reseña" : "reseñas"}
        </span>
      </div>

      {reviews.length === 0 ? (
        <div className={styles.empty}>
          <p>Este producto todavía no tiene reseñas.</p>
          <small>Sé la primera persona en compartir tu experiencia.</small>
        </div>
      ) : (
        <div className={styles.list}>
          {reviews.map((review) => {
            const reviewerName =
              review.user?.name ||
              review.userName ||
              review.author ||
              "Cliente de STORE LAB";

            const comment =
              review.comment || review.text || "Sin comentario";

            const reviewDate = review.createdAt
              ? new Date(review.createdAt).toLocaleDateString("es-ES")
              : null;

            return (
              <article className={styles.review} key={review._id || review.id}>
                <div className={styles.reviewTop}>
                  <div className={styles.avatar}>
                    {reviewerName.charAt(0).toUpperCase()}
                  </div>

                  <div className={styles.reviewerInfo}>
                    <strong>{reviewerName}</strong>
                    {reviewDate && <small>{reviewDate}</small>}
                  </div>

                  <StarRating rating={review.rating} />
                </div>

                <p className={styles.comment}>{comment}</p>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default ReviewList;
