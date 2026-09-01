import { useDispatch, useSelector } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"

import { toggleWishlist } from "../../store/wishlistSlice.js"
import styles from "./WishlistButton.module.css"

function WishlistButton({ productId }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const productIds = useSelector(
    (state) => state.wishlist.productIds
  )
  const token = useSelector((state) => state.auth.token)

  const isFavorite = productIds.some(
    (id) => Number(id) === Number(productId)
  )

  const handleClick = () => {
    if (!token) {
      navigate("/login", {
        state: { from: location },
      })
      return
    }

    dispatch(toggleWishlist(Number(productId)))
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

export default WishlistButton
