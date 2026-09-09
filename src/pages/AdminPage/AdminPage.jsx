import { Link } from "react-router-dom"
import styles from "./AdminPage.module.css"

function AdminPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>STORELAB / BACK OFFICE</p>
        <h1>Panel de administración</h1>
        <p className={styles.description}>
          Bienvenido al área privada. Desde aquí podrás gestionar el catálogo,
          usuarios y pedidos.
        </p>
      </section>

      <section className={styles.grid} aria-label="Módulos de administración">
        <Link className={styles.card} to="/admin/products">
          <span className={styles.number}>01</span>
          <h2>Productos</h2>
          <p>Crear, editar y retirar productos del catálogo.</p>
        </Link>
        <article className={styles.card}>
          <span className={styles.number}>02</span>
          <h2>Usuarios</h2>
          <p>Consulta y administra las cuentas y roles de StoreLab.</p>
        </article>
        <article className={styles.card}>
          <span className={styles.number}>03</span>
          <h2>Pedidos</h2>
          <p>Seguimiento de pedidos.</p>
        </article>
      </section>
    </main>
  )
}

export default AdminPage
