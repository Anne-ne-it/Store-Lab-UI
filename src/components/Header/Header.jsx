import { useState } from "react" //Importa hooks de React para manejar el estado local del componente
import { NavLink, useLocation } from "react-router-dom" //Importa componentes y hooks de React Router para la navegación y lectura de la URL
import { User, ShoppingBag, Menu, X, ChevronDown, Mail } from "lucide-react" //Importa la colección de iconos vectoriales necesarios para la interfaz
import { useSelector } from "react-redux" //Importa el hook de React Redux para acceder al estado global de la aplicación
import { selectIsAdmin } from "../../store/authSlice.js" //Importa el selector de Redux que valida el rol de administrador
import styles from "./Header.module.css" //Importa los estilos en formato CSS Modules

const categories = [ //Matriz de pares para construir la navegación
  ["SURF", "surf"],
  ["SKATE", "skate"],
  ["NEOPRENOS", "neoprenos"],
  ["ACCESORIOS", "accesorios"],
]

function Header() { //Componente principal de la barra de navegación superior
  const [isMenuOpen, setIsMenuOpen] = useState(false) //Estado local para abrir o cerrar el menú desplegable en dispositivos móviles
  const location = useLocation() //Hook para acceder a la ruta e información de navegación actual

  //Selectores de Redux para extraer la información de autenticación y carrito
  const token = useSelector((state) => state.auth.token) 
  const isAdmin = useSelector(selectIsAdmin) 
  const cartItems = useSelector((state) => state.cart.items) 

  //Acumulador que suma las cantidades de todos los elementos presentes en el carrito
  const cartCount = cartItems.reduce( 
    (total, item) => total + item.quantity,
    0
  )

  const activeCategory = new URLSearchParams(location.search).get("category")?.trim().toLowerCase() //Extrae y limpia el parámetro 'category' de los query params en la URL

    const closeMenu = () => setIsMenuOpen(false) //Función auxiliar para restablecer el estado del menú móvil a cerrado

  return (
    //Etiqueta semántica HTML5 para el encabezado principal
    <header className={styles.header}> 
      {/*Logotipo principal con enlace a la página de inicio*/}
      <NavLink to="/" className={styles.brand} onClick={closeMenu}> 
        <div className={styles.logoText}>
          <span className={styles.title}>STORELAB UI</span>
          <span className={styles.subtitle}>SURF &amp; SKATE SHOP</span>
        </div>
      </NavLink>

      {/*Menú de navegación principal con clase dinámica para vista responsive*/}
      <nav className={`${styles.navHeader} ${isMenuOpen ? styles.navActive : ""}`}> 
        {/*Generación dinámica de los enlaces de categorías*/}
        {categories.map(([label, category]) => { //Determina si el enlace actual coincide con la categoría seleccionada en la URL
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

        {/*Renderizado condicional: acceso exclusivo para administradores*/}
        {isAdmin && ( 
          <NavLink to="/admin" className={({ isActive }) => (isActive ? styles.activeLink : styles.link)} onClick={closeMenu}>
            ADMIN
          </NavLink>
        )}
      </nav>

      {/*Bloque de accesos directos e interacción del usuario*/}
      <div className={styles.actions}> 
        {/*Enlace directo al formulario de contacto*/}
        <NavLink to="/contact" className={styles.iconBtn} aria-label="Contacto"> 
          <Mail className={styles.actionIcon} />
        </NavLink>

        {/*Redirección condicional según el estado de la sesión (Perfil o Login)*/}
        <NavLink to={token ? "/profile" : "/login"} className={styles.iconBtn} aria-label="Cuenta"> 
          <User className={styles.actionIcon} />
        </NavLink>

        {/*Acceso al carrito de compras con indicador numérico si existen productos*/}
        <NavLink to="/cart" className={styles.cartBtn} aria-label="Carrito"> 
          <ShoppingBag className={styles.actionIcon} />
          {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
        </NavLink>

        {/*Botón de alternancia (toggle) para desplegar el menú responsive*/}
        <button className={styles.hamburger} onClick={() => setIsMenuOpen((open) => !open)} aria-label="Menú" aria-expanded={isMenuOpen}> 
          {isMenuOpen ? <X className={styles.actionIcon} /> : <Menu className={styles.actionIcon} />}
        </button>
      </div>
    </header>
  )
}

export default Header; //Exporta el componente Header por defecto para poder importarlo y utilizarlo en otros archivos de la aplicación