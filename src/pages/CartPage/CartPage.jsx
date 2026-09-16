import { Link, useNavigate } from "react-router-dom" //Importa componentes de react-router-dom para enlaces y navegación entre rutas
import { useDispatch, useSelector } from "react-redux" //Importa los hooks de Redux Toolkit para despachar acciones y extraer datos del estado global
import CartItem from "../../components/CartItem/CartItem.jsx" //Importa los componentes de la interfaz de usuario para renderizar cada elemento
import CartSummary from "../../components/CartSummary/CartSummary.jsx" //Importa el componente que muestra el resumen del carrito y el botón de checkout
import { addCartItem, removeCartItem } from "../../store/cartSlice.js" //Importa las acciones creadas en el Slice del carrito para modificar el estado global
import styles from "./CartPage.module.css" //Importa los estilos CSS parametrizados como módulos

function CartPage() { //Componente principal para mostrar la página del Carrito de compras
  const dispatch = useDispatch() //Hook para despachar acciones de Redux hacia la tienda
  const navigate = useNavigate() //Hook para redireccionar a otras rutas dentro de la aplicación


  const { items, loading, error } = useSelector( //Extrae los ítems, el estado de carga y el mensaje de error del estado global de Redux (`state.cart`)
    (state) => state.cart
  )

  const handleAdd = (item) => { //Manejador para incrementar en +1 la cantidad de un producto en el carrito
    dispatch(
      addCartItem({
        product: item.product,
        quantity: 1,
      })
    )
  }

  const handleRemove = (itemId) => { //Manejador para eliminar un ítem por completo del carrito mediante su ID
    dispatch(removeCartItem(itemId))
  }

  const handleDecrease = (item) => { //Manejador para decrementar la cantidad de un producto
    if (item.quantity <= 1) { //Si la cantidad actual es 1 o menos, elimina el producto por completo
      dispatch(removeCartItem(item.id))
      return
    }

    dispatch( //Si hay más de 1 elemento, despacha una acción enviando una cantidad negativa para restar
      addCartItem({
        product: item.product,
        quantity: -1,
      })
    )
  }

  if (loading && items.length === 0) { //Si está cargando y aún no hay productos en pantalla, muestra un estado inicial de carga
    return (
      <main className={styles.page}>
        <p className={styles.status}>Cargando carrito...</p>
      </main>
    )
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        {/*Encabezado principal del carrito*/}
        <header className={styles.header}>
          <p className={styles.eyebrow}>
            STORE LAB · CART
          </p>

          <h1>Mi carrito</h1>

          <p className={styles.description}>
            Revisa tu selección antes de completar el pedido.
          </p>
        </header>

        {/*Renderizado condicional para mensajes de error devueltos por el estado de Redux*/}
        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}

        {/*Renderizado condicional: Muestra estado vacío si no hay elementos o el contenido si los hay*/}
        {items.length === 0 ? (
          <section className={styles.empty}>
            <h2>El carrito está vacío</h2>
            <p>Añade algún producto para comenzar tu pedido.</p>

            <Link className={styles.backLink} to="/products">
              Ver productos
            </Link>
          </section>
        ) : (
          //Vista principal con el listado de ítems y el bloque de resumen
          <div className={styles.content}>
            <section
              className={styles.items}
              aria-label="Productos del carrito"
            >
              {/*Recorre el arreglo de ítems y renderiza un componente CartItem por cada uno*/}
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onAdd={() => handleAdd(item)}
                  onRemove={handleRemove}
                  onDecrease={() => handleDecrease(item)}
                />
              ))}
            </section>

            {/*Componente para mostrar el resumen del costo y procesar la compra*/}
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

export default CartPage //Exporta el componente por defecto
