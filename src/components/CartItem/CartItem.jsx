function CartItem({ item, onAdd, onRemove }) {
  const product = item.product || item
  const quantity = item.quantity || 1
  const price = Number(product.price) || 0
  const subtotal = price * quantity

  return (
    <article className={styles.item}>
      <div className={styles.imageWrapper}>
        <img
          className={styles.image}
          src={product.image}
          alt={product.name}
        />
      </div>

      <div className={styles.content}>
        <p className={styles.category}>
          {product.category || "Surf & Skate"}
        </p>
        <h2 className={styles.name}>{product.name}</h2>
        <p className={styles.quantity}>
          Cantidad: <strong>{quantity}</strong>
        </p>
      </div>

      <div className={styles.actions}>
        <p className={styles.price}>
          {subtotal.toFixed(2)} €
        </p>

        <div className={styles.controls}>
          <button
            type="button"
            className={styles.addButton}
            onClick={onAdd}
            aria-label={`Añadir otra unidad de ${product.name}`}
          >
            +
          </button>

          <button
            type="button"
            className={styles.removeButton}
            onClick={() => onRemove(item.id)}
          >
            Eliminar
          </button>
        </div>
      </div>
    </article>
  )
}
