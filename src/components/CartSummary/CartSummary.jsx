import { useMemo } from "react" //Importa el hook useMemo para guardar cálculos costosos y solo recalcular cuando cambian los items
import styles from "./CartSummary.module.css" //Importa los estilos CSS del resumen del carrito

const currencyFormatter = new Intl.NumberFormat("es-ES", { //Crea un formateador para presentar los precios en euros con formato local
  style: "currency", //Indica que el valor debe tratarse como moneda
  currency: "EUR", //Define la divisa como euros
})

function CartSummary({ items = [], onCheckout }) { //Define el componente que muestra el resumen del pedido con total y botón de checkout
  const totalItems = useMemo(() => { //Calcula cuántas unidades hay en total en el carrito y memoiza el resultado
    return items.reduce( //Recorre cada item del carrito para acumular la cantidad total
      (total, item) => total + Number(item.quantity || 0), //Suma la cantidad del item, convirtiéndola a número para evitar NaN
      0 //Empieza el acumulador en cero
    )
  }, [items]) //Solo recalcula si cambia la lista de items

  const totalPrice = useMemo(() => { //Calcula el importe total del carrito y memoiza el resultado
    return items.reduce((total, item) => { //Recorre cada producto para calcular el subtotal acumulado
      const price = Number( //Extrae el precio del producto, aceptando varias estructuras posibles
        item.product?.price ?? item.price ?? 0
      )
      const quantity = Number(item.quantity || 0) //Obtiene la cantidad del item y la convierte a número

      return total + price * quantity //Suma el subtotal de este item al total general
    }, 0) //El acumulador empieza en cero
  }, [items]) //Vuelve a calcular solo cuando la lista de items cambia

  return ( //Empieza la renderización del resumen visible del carrito
    <aside className={styles.box}> {/*Contenedor lateral del resumen del pedido*/}
      <p className={styles.label}>Resumen</p> {/*Etiqueta pequeña señalando la sección de resumen*/}

      <h2 className={styles.title}>Tu pedido</h2> {/*Título principal del resumen del pedido*/}

      <div className={styles.line}> {/*Fila que muestra cuántos productos hay en el carrito*/}
        <span>Productos</span> {/*Texto descriptivo de la línea*/}
        <strong>{totalItems}</strong> {/*Muestra el número total de unidades*/}
      </div>

      <div className={styles.total}> {/*Fila destacada con el importe total a pagar*/}
        <span>Total</span> {/*Texto del importe final*/}
        <strong>{currencyFormatter.format(totalPrice)}</strong> {/*Muestra el total formateado en euros*/}
      </div>

      <p className={styles.note}> {/*Texto informativo sobre costos de envio e impuestos*/}
        El envío y los impuestos se calcularán en el siguiente paso. {/*Mensaje aclaratorio del proceso de compra*/}
      </p>

      {onCheckout && ( //Muestra el botón solo si se ha recibido la función onCheckout por props
        <button
          type="button"
          className={styles.button}
          onClick={onCheckout} //Ejecuta la función para ir al checkout cuando el usuario pulsa
          disabled={items.length === 0} //Deshabilita el botón si el carrito está vacío
        >
          Finalizar pedido {/*Texto del botón principal de compra*/}
        </button>
      )}
    </aside>
  )
}

export default CartSummary //Exporta el componente para reutilizarlo en la página del carrito