import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"

import CartItem from "../../components/CartItem/CartItem.jsx"
import CartSummary from "../../components/CartSummary/CartSummary.jsx"
import { addCartItem, removeCartItem, } from "../../store/cartSlice.js"
import styles from "./CartPage.module.css"

function CartPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { items, loading, error } = useSelector(
    (state) => state.cart
  )

  const handleAdd = (item) => {
    dispatch(
      addCartItem({
        product: item.product,
        quantity: 1,
      })
    )
  }

  const handleRemove = (itemId) => {
    dispatch(removeCartItem(itemId))
  }

  if (loading && items.length === 0) {
    return (
      <main className={styles.page}>
        <p className={styles.status}>Cargando carrito...</p>
      </main>
    )
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>
            STORE LAB · CART
          </p>

          <h1>Mi carrito</h1>

          <p className={styles.description}>
            Revisa tu selección antes de completar el pedido.
          </p>
        </header>

        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}

        {items.length === 0 ? (
          <section className={styles.empty}>
            <h2>El carrito está vacío</h2>
            <p>Añade algún producto para comenzar tu pedido.</p>

            <Link className={styles.backLink} to="/products">
              Ver productos
            </Link>
          </section>
        ) : (
          <div className={styles.content}>
            <section
              className={styles.items}
              aria-label="Productos del carrito"
            >
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onAdd={() => handleAdd(item)}
                  onRemove={handleRemove}
                />
              ))}
            </section>

            <CartSummary
              items={items}
              onCheckout={() => navigate("/checkout")}
            />
          </div>
        )}
      </div>
    </main>
  )
}

export default CartPage