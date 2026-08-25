/*LAYOUT.JSX  define una plantilla (layout) para la API REACT, evita que se repitan componentes comunes*/

import styles from "./Layout.module.css";
import { Outlet } from "react-router-dom";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";

function Layout() {
    return (
        <div className={styles.layout}>
            <div className={styles.mainContainer}>
                <Header />
                <main>
                    <Outlet />
                </main>
                <Footer />
            </div>
        </div>
    )
}

export default Layout;