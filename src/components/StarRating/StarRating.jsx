import styles from "./StarRating.module.css"; //Importa el CSS específico para la calificación con estrellas

function StarRating({ rating = 0, maxRating = 5, showValue = false }) { //Define un componente reusable para mostrar valoración en estrellas
  const numericRating = Math.min(Math.max(Number(rating) || 0, 0), maxRating); //Normaliza la nota para que esté entre 0 y el máximo

  return (
    <div
      className={styles.rating}
      aria-label={`Valoración: ${numericRating} de ${maxRating}`}
    >
      <div className={styles.stars}>
        {Array.from({ length: maxRating }, (_, index) => { //Genera una estrella por cada valor posible de 1 a maxRating
          const starNumber = index + 1;
          const isFull = starNumber <= Math.floor(numericRating); //Comprueba si la estrella debe mostrarse completa
          const isHalf = !isFull && starNumber - 0.5 <= numericRating; //Comprueba si debe mostrarse media estrella

          return (
            <span
              key={starNumber}
              className={`${styles.star} ${
                isFull ? styles.full : isHalf ? styles.half : styles.empty
              }`}
              aria-hidden="true"
            >
              ★
            </span>
          );
        })}
      </div>

      {showValue && ( //Si se quiere mostrar el valor numérico, lo añade junto a las estrellas
        <span className={styles.value}>
          {numericRating.toFixed(1)}
        </span>
      )}
    </div>
  );
}

export default StarRating; //Exporta el componente para poder reutilizarlo en otros lugares donde se necesite mostrar la valoración de productos o reseñas
