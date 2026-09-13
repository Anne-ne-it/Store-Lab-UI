import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { logout } from "../../store/authSlice.js"
import styles from "./ProfilePage.module.css"

function ProfilePage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((state) => state.auth.user)
  const wishlistCount = useSelector((state) => state.wishlist.productIds.length)
  const cartItemsCount = useSelector((state) =>
    state.cart.items.reduce((total, item) => total + item.quantity, 0)
  )

  const displayName = user?.name || user?.email?.split("@")[0] || "Usuario"
  const initials = (displayName.charAt(0) || "U").toUpperCase()

  const handleLogout = () => {
    dispatch(logout())
    navigate("/login")
  }

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <div className={styles.avatar}>{initials}</div>

        <div className={styles.headerText}>
          <p className={styles.eyebrow}>Cuenta</p>
          <h1 className={styles.title}>Perfil</h1>
        </div>
      </header>

      <section className={styles.card}>
        <div className={styles.infoGroup}>
          <span className={styles.label}>Usuario</span>
          <p className={styles.userName}>{displayName}</p>
        </div>

        <div className={styles.infoGroup}>
          <span className={styles.label}>Email</span>
          <p className={styles.email}>{user?.email || "Usuario sin email"}</p>
        </div>

        <div className={styles.metaGrid}>
          <article className={styles.statCard}>
            <span className={styles.statLabel}>Favoritos</span>
            <strong className={styles.statValue}>{wishlistCount}</strong>
          </article>

          <article className={styles.statCard}>
            <span className={styles.statLabel}>Carrito</span>
            <strong className={styles.statValue}>{cartItemsCount}</strong>
          </article>

          <article className={styles.statCard}>
            <span className={styles.statLabel}>Estado</span>
            <strong className={styles.statValue}>Activo</strong>
          </article>
        </div>

        <button type="button" className={styles.logoutBtn} onClick={handleLogout}>
          Cerrar sesión
        </button>
      </section>
    </main>
  )
}

export default ProfilePage
