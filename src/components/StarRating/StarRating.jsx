import styles from "./StarRating.module.css";

function StarRating({ rating = 0, maxRating = 5, showValue = false }) {
  const numericRating = Math.min( Math.max(Number(rating) || 0, 0), maxRating );

  return (
    <div
      className={styles.rating}
      aria-label={`Valoración: ${numericRating} de ${maxRating}`}
    >
      <div className={styles.stars}>
        {Array.from({ length: maxRating }, (_, index) => {
          const starNumber = index + 1;
          const isFull = starNumber <= Math.floor(numericRating);
          const isHalf =
            !isFull && starNumber - 0.5 <= numericRating;

          return (
            <span key={starNumber} className={`${styles.star} ${
                isFull
                  ? styles.full
                  : isHalf
                    ? styles.half
                    : styles.empty
              }`}
              aria-hidden="true"
            >
              ★
            </span>
          );
        })}
      </div>

      {showValue && (
        <span className={styles.value}>
          {numericRating.toFixed(1)}
        </span>
      )}
    </div>
  );
}

export default StarRating;
