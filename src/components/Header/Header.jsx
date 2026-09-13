import { useState } from "react"
import { NavLink, useLocation } from "react-router-dom"
import { User, ShoppingBag, Menu, X, ChevronDown, Mail } from "lucide-react"
import { useSelector } from "react-redux"
import { selectIsAdmin } from "../../store/authSlice.js"
import styles from "./Header.module.css"

const categories = [
  ["SURF", "surf"],
  ["SKATE", "skate"],
  ["NEOPRENOS", "neoprenos"],
  ["ACCESORIOS", "accesorios"],
]

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const token = useSelector((state) => state.auth.token)
  const isAdmin = useSelector(selectIsAdmin)
  const cartItems = useSelector((state) => state.cart.items)

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  )

  const activeCategory = new URLSearchParams(location.search).get("category")?.trim().toLowerCase()
  const closeMenu = () => setIsMenuOpen(false)

  return (
    <header className={styles.header}>
      <NavLink to="/" className={styles.brand} onClick={closeMenu}>
        <div className={styles.logoText}>
          <span className={styles.title}>STORELAB UI</span>
          <span className={styles.subtitle}>SURF &amp; SKATE SHOP</span>
        </div>
      </NavLink>

      <nav className={`${styles.navHeader} ${isMenuOpen ? styles.navActive : ""}`}>
        {categories.map(([label, category]) => {
          const isCategoryActive = location.pathname === "/products" && activeCategory === category

          return (
            <div className={styles.dropdown} key={category}>
              <NavLink
                to={`/products?category=${encodeURIComponent(category)}`}
                className={isCategoryActive ? styles.activeLink : styles.link}
                onClick={closeMenu}
              >
                {label} <ChevronDown className={styles.chevronIcon} />
              </NavLink>
            </div>
          )
        })}

        {isAdmin && (
          <NavLink to="/admin" className={({ isActive }) => (isActive ? styles.activeLink : styles.link)} onClick={closeMenu}>
            ADMIN
          </NavLink>
        )}
      </nav>

      <div className={styles.actions}>
        <NavLink to="/contact" className={styles.iconBtn} aria-label="Contacto">
          <Mail className={styles.actionIcon} />
        </NavLink>
        <NavLink to={token ? "/profile" : "/login"} className={styles.iconBtn} aria-label="Cuenta">
          <User className={styles.actionIcon} />
        </NavLink>
        <NavLink to="/cart" className={styles.cartBtn} aria-label="Carrito">
          <ShoppingBag className={styles.actionIcon} />
          {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
        </NavLink>
        <button className={styles.hamburger} onClick={() => setIsMenuOpen((open) => !open)} aria-label="Menú" aria-expanded={isMenuOpen}>
          {isMenuOpen ? <X className={styles.actionIcon} /> : <Menu className={styles.actionIcon} />}
        </button>
      </div>
    </header>
  )
}

export default Header
