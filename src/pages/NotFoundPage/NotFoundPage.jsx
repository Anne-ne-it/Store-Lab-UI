import styles from "./NotFoundPage.module.css"
import { Link } from "react-router-dom"

function NotFoundPage () {
    return (
        <main className={styles.NotFoundPage}>
            <h2 className={styles.errorCode}>404</h2>
            <p className={styles.errorMessage}>Página no encontrada</p>
            <Link to="/" className={styles.homeButton}>
                Volver al Home
            </Link>
        </main>
    )
}

export default NotFoundPage