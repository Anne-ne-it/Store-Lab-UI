import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Search, User, ShoppingBag, Menu, X, ChevronDown } from 'lucide-react';
import styles from './Header.module.css';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className={styles.header}>
      {/* 1. LOGO */}
      <NavLink to="/" className={styles.brand}>
        <div className={styles.logoText}>
          <span className={styles.title}>STORELAB UI</span>
          <span className={styles.subtitle}>SURF &amp; SKATE SHOP</span>
        </div>
      </NavLink>

      {/* 2. NAVEGACIÓN PRINCIPAL */}
      <nav className={`${styles.navHeader} ${isMenuOpen ? styles.navActive : ''}`}>
        <NavLink 
          to="/" 
          end
          className={({ isActive }) => (isActive ? styles.activeLink : styles.link)}
          onClick={() => setIsMenuOpen(false)}
        >
          INICIO
        </NavLink>
        
        <div className={styles.dropdown}>
          <NavLink 
            to="/surf" 
            className={({ isActive }) => (isActive ? styles.activeLink : styles.link)}
            onClick={() => setIsMenuOpen(false)}
          >
            SURF <ChevronDown className={styles.chevronIcon} />
          </NavLink>
        </div>

        <div className={styles.dropdown}>
          <NavLink 
            to="/skate" 
            className={({ isActive }) => (isActive ? styles.activeLink : styles.link)}
            onClick={() => setIsMenuOpen(false)}
          >
            SKATE <ChevronDown className={styles.chevronIcon} />
          </NavLink>
        </div>

        <div className={styles.dropdown}>
          <NavLink 
            to="/neoprenos" 
            className={({ isActive }) => (isActive ? styles.activeLink : styles.link)}
            onClick={() => setIsMenuOpen(false)}
          >
            NEOPRENOS <ChevronDown className={styles.chevronIcon} />
          </NavLink>
        </div>

        <NavLink 
          to="/products" 
          className={({ isActive }) => (isActive ? styles.activeLink : styles.link)}
          onClick={() => setIsMenuOpen(false)}
        >
          CATÁLOGO
        </NavLink>
      </nav>

      {/* 3. ICONOS DE ACCIÓN */}
      <div className={styles.actions}>
        <button className={styles.iconBtn} aria-label="Buscar">
          <Search className={styles.actionIcon} />
        </button>
        <button className={styles.iconBtn} aria-label="Cuenta">
          <User className={styles.actionIcon} />
        </button>
        <NavLink to="/cart" className={styles.cartBtn} aria-label="Carrito">
          <ShoppingBag className={styles.actionIcon} />
          <span className={styles.cartBadge}>0</span>
        </NavLink>
        
        <button className={styles.hamburger} onClick={toggleMenu} aria-label="Menú">
          {isMenuOpen ? <X className={styles.actionIcon} /> : <Menu className={styles.actionIcon} />}
        </button>
      </div>
    </header>
  );
}

export default Header;