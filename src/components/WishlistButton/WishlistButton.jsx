import { useDispatch, useSelector } from "react-redux" //Importa hooks de Redux para leer estado y despachar acciones
import { useLocation, useNavigate } from "react-router-dom" //Importa navegación para redirigir si el usuario no está autenticado

import { toggleWishlist } from "../../store/wishlistSlice.js" //Importa la acción para añadir o quitar un producto de la wishlist
import styles from "./WishlistButton.module.css" //Importa los estilos del botón de favoritos

function WishlistButton({ productId }) { //Define un botón reutilizable para guardar o quitar un producto de favoritos
  const dispatch = useDispatch() //Obtiene la función dispatch para llamar a la acción Redux
  const navigate = useNavigate() //Permite redirigir a login si la sesión no existe
  const location = useLocation() //Guarda la ruta actual para volver después del login

  const productIds = useSelector( //Lee la lista de IDs favoritos del estado global
    (state) => state.wishlist.productIds
  )
  const token = useSelector((state) => state.auth.token) //Lee si el usuario está autenticado

  const isFavorite = productIds.some( //Comprueba si el producto actual ya está en favoritos
    (id) => Number(id) === Number(productId)
  )

  const handleClick = () => { //Se ejecuta cuando el usuario pulsa el botón
    if (!token) { //Si no está autenticado, lo lleva a login y guarda la ruta previa
      navigate("/login", {
        state: { from: location },
      })
      return
    }

    dispatch(toggleWishlist(Number(productId))) //Si hay sesión, alterna el producto en la wishlist
  }

  return (
    <button
      type="button"
      className={`${styles.button} ${
        isFavorite ? styles.active : ""
      }`}
      onClick={handleClick}
      aria-label={
        isFavorite
          ? "Quitar producto de favoritos"
          : "Añadir producto a favoritos"
      }
      aria-pressed={isFavorite}
      title={
        isFavorite
          ? "Quitar de favoritos"
          : "Añadir a favoritos"
      }
    >
      <span aria-hidden="true">
        {isFavorite ? "♥" : "♡"}
      </span>
    </button>
  )
}

export default WishlistButton //Exporta el componente por defecto para poder utilizarlo en tarjetas de productos y detalle de producto
