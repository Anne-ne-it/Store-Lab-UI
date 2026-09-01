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
      <main>
        <h1>Finalizar pedido</h1>
        <p>No tienes productos para comprar.</p>
        <Link to="/products">Volver a productos</Link>
      </main>
    )
  }

  return (
    <main>
      <h1>Finalizar pedido</h1>

      <form onSubmit={handleSubmit}>
        <h2>Resumen del pedido</h2>

        {items.map((item) => (
          <article key={item.id}>
            <h3>{item.product.name}</h3>
            <p>
              {item.quantity} x {item.product.price.toFixed(2)} €
            </p>
          </article>
        ))}

        <p>
          Total: <strong>{total.toFixed(2)} €</strong>
        </p>

        <button type="submit">Confirmar pedido</button>
      </form>
    </main>
  )
}

export default CheckoutPage
