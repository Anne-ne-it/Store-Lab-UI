import { Link } from "react-router-dom" //Importa el componente Link de react-router-dom para la navegación entre páginas sin recargar la web
import styles from "./AdminPage.module.css" //Importa los estilos CSS como un módulo para usarlos de forma local y evitar colisiones de nombres

function AdminPage() { //Define el componente funcional principal 'AdminPage'
  return (
    <main className={styles.page}>
      {/*Sección superior o encabezado destacado de la página*/}
      <section className={styles.hero}>
        {/*Subtítulo o categoría superior pequeña (eyebrow)*/}
        <p className={styles.eyebrow}>STORELAB / BACK OFFICE</p>
        {/*Título principal de la página*/}
        <h1>Panel de administración</h1>
        {/*Descripción general del panel*/}
        <p className={styles.description}>
          Bienvenido al área privada. Desde aquí podrás gestionar el catálogo,
          usuarios y pedidos.
        </p>
      </section>

      {/*Sección con diseño en cuadrícula (grid) para los módulos accesibles*/}
      {/*El atributo aria-label ayuda a la accesibilidad para lectores de pantalla*/}
      <section className={styles.grid} aria-label="Módulos de administración">
        {/*Enlace navegable a la ruta de administración de productos*/}
        <Link className={styles.card} to="/admin/products">
          <span className={styles.number}>01</span>
          <h2>Productos</h2>
          <p>Crear, editar y retirar productos del catálogo.</p>
        </Link>
        {/*Enlace navegable a la ruta de administración de usuarios*/}
        <Link className={styles.card} to="/admin/users">
          <span className={styles.number}>02</span>
          <h2>Usuarios</h2>
          <p>Consulta y administra las cuentas y roles de StoreLab.</p>
        </Link>
        {/*Tarjeta no interactiva para la sección de Pedidos*/}
        <article className={styles.card}>
          <span className={styles.number}>03</span>
          <h2>Pedidos</h2>
          <p>Seguimiento de pedidos.</p>
        </article>
      </section>
    </main>
  )
}

export default AdminPage //Exporta el componente por defecto para poder importarlo en las rutas de la aplicación
