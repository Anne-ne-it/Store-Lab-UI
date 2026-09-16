import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { clearCart } from "../../store/cartSlice.js"
import styles from "./CheckoutPage.module.css"

function CheckoutPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { items } = useSelector((state) => state.cart)

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )

  const handleSubmit = (event) => {
    event.preventDefault()
    dispatch(clearCart())
    navigate("/cart")
  }

  if (items.length === 0) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <header className={styles.header}>
            <p className={styles.eyebrow}>STORE LAB · CHECKOUT</p>
            <h1>Finalizar pedido</h1>
            <p className={styles.description}>
              Revisa tu compra y confirma tu pedido con un solo clic.
            </p>
          </header>

          <section className={styles.emptyState}>
            <h2>Tu carrito está vacío</h2>
            <p>No tienes productos para comprar.</p>
            <Link className={styles.backLink} to="/products">
              Volver a productos
            </Link>
          </section>
        </div>
      </main>
    )
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>STORE LAB · CHECKOUT</p>
          <h1>Finalizar pedido</h1>
          <p className={styles.description}>
            Revisa tu compra y confirma tu pedido con un solo clic.
          </p>
        </header>

        <form className={styles.form} onSubmit={handleSubmit}>
          <section className={styles.summary} aria-label="Resumen del pedido">
            <h2 className={styles.summaryTitle}>Resumen del pedido</h2>

            <div className={styles.items}>
              {items.map((item) => (
                <article key={item.id} className={styles.item}>
                  <div>
                    <h3 className={styles.itemName}>{item.product.name}</h3>
                    <p className={styles.itemMeta}>
                      {item.quantity} unidad{item.quantity > 1 ? "es" : ""}
                    </p>
                  </div>

                  <p className={styles.itemPrice}>
                    {(item.product.price * item.quantity).toFixed(2)} €
                  </p>
                </article>
              ))}
            </div>

            <div className={styles.total}>
              <span className={styles.totalLabel}>Total</span>
              <strong className={styles.totalPrice}>{total.toFixed(2)} €</strong>
            </div>
          </section>

          <aside className={styles.sidebar}>
            <h3 className={styles.sidebarTitle}>Confirmar compra</h3>
            <p className={styles.securityNote}>
              Tu pedido se procesará con la información de la sesión activa.
            </p>

            <button className={styles.submitBtn} type="submit">
              Confirmar pedido
            </button>
          </aside>
        </form>
      </div>
    </main>
  )
}

export default CheckoutPage