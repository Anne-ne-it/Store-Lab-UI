import { useMemo } from "react"
import styles from "./CartSummary.module.css"

const currencyFormatter = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
})

function CartSummary({ items = [], onCheckout }) {
  const totalItems = useMemo(() => {
    return items.reduce(
      (total, item) => total + Number(item.quantity || 0),
      0
    )
  }, [items])

  const totalPrice = useMemo(() => {
    return items.reduce((total, item) => {
      const price = Number(
        item.product?.price ?? item.price ?? 0
      )
      const quantity = Number(item.quantity || 0)

      return total + price * quantity
    }, 0)
  }, [items])

  return (
    <aside className={styles.box}>
      <p className={styles.label}>Resumen</p>

      <h2 className={styles.title}>Tu pedido</h2>

      <div className={styles.line}>
        <span>Productos</span>
        <strong>{totalItems}</strong>
      </div>

      <div className={styles.total}>
        <span>Total</span>
        <strong>{currencyFormatter.format(totalPrice)}</strong>
      </div>

      <p className={styles.note}>
        El envío y los impuestos se calcularán en el siguiente paso.
      </p>

      {onCheckout && (
        <button
          type="button"
          className={styles.button}
          onClick={onCheckout}
          disabled={items.length === 0}
        >
          Finalizar pedido
        </button>
      )}
    </aside>
  )
}

export default CartSummary
