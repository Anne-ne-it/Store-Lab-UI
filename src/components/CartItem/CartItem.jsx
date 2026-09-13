import styles from "./CartItem.module.css" //Importa los estilos en CSS Modules específicos para este componente

function CartItem({ item, onAdd, onRemove, onDecrease }) { //Declara el componente funcional CartItem recibiendo sus props mediante desestructuración
  const product = item.product || item //Garantiza el acceso al objeto del producto (ya sea item.product o el propio item)
  const quantity = Number(item.quantity) || 1 //Convierte la cantidad a número; si no existe o es inválida, asigna 1 por defecto
  const price = Number(product.price) || 0 //Convierte el precio a número; si no existe o es inválido, asigna 0 por defecto
  const subtotal = price * quantity  //Calcula el subtotal multiplicando el precio por la cantidad de unidades


  return (
    //Contenedor principal de la tarjeta
    <article className={styles.item}>
      {/*Contenedor de la imagen del producto*/}
      <div className={styles.imageWrapper}>
        {/*Etiqueta de imagen con la URL del producto y el texto alternativo*/}
        {product.image ? (
          <img className={styles.image} src={product.image || undefined} alt={product.name} />
        ) : null}
      </div>

      {/*Bloque central con los detalles informativos y controles*/}
      <div className={styles.content}>
        {/*Muestra la categoría del producto o "Novedad" si no tiene una definida*/}
        <p className={styles.category}>{product.category || "Novedad"}</p>
        {/*Nombre principal del producto*/}
        <h2 className={styles.name}>{product.name}</h2>

        {/*Contenedor del selector de cantidad*/}
        <div className={styles.quantityBox}>
          {/*Etiqueta de texto para identificar la sección de cantidad*/}
          <span className={styles.quantityLabel}>Cantidad</span>

          {/*Grupo de botones y contador para cambiar la cantidad*/}
          <div className={styles.quantityControls}>
            {/*Botón para restar una unidad*/}
            <button
              type="button"
              className={styles.quantityButton}
              onClick={onDecrease} //Ejecuta la función enviada por prop al hacer clic
              aria-label={`Quitar una unidad de ${product.name}`} //Descripción para lectores de pantalla
              disabled={quantity <= 1} //Se deshabilita cuando la cantidad es 1 o menos
            >
              −
            </button>

            {/*Muestra el número actual de unidades*/}
            <span className={styles.quantityValue}>{quantity}</span>

            {/*Botón para sumar una unidad*/}
            <button
              type="button"
              className={styles.quantityButton}
              onClick={onAdd} //Ejecuta la función para incrementar la cantidad
              aria-label={`Añadir una unidad de ${product.name}`} //Descripción accesible
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/*Bloque con precio final y acción de eliminado*/}
      <div className={styles.actions}>
        {/*Formatea el subtotal a 2 decimales y le añade el símbolo del euro*/}
        <p className={styles.price}>{subtotal.toFixed(2)} €</p>

        {/*Botón para eliminar completamente el ítem del carrito*/}
        <button
          type="button"
          className={styles.removeButton}
          onClick={() => onRemove(item.id)} //Llama a onRemove pasando el identificador único del ítem
        >
          Eliminar
        </button>
      </div>
    </article>
  )
}

export default CartItem //Exporta el componente para poder reutilizarlo en otros archivos de la aplicación
