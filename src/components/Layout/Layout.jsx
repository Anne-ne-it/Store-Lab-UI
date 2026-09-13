import styles from "./Layout.module.css"; //Importa los estilos CSS Modules específicos para la estructura del layout
import { Outlet } from "react-router-dom"; //Importa 'Outlet' de React Router, que funciona como un espacio reservado para renderizar las rutas hijas
import Footer from "../Footer/Footer"; //Importa el componente del pie de página
import Header from "../Header/Header"; //Importa el componente de la barra de navegación/encabezado

//Define el componente funcional 'Layout'
function Layout() {
    return (
        <div className={styles.layout}>
            {/*Contenedor interno que organiza el flujo vertical de la aplicación*/}
            <div className={styles.mainContainer}>
                {/*Renderiza el encabezado fijado en la parte superior*/}
                <Header />

                {/*Etiqueta HTML5 semántica para encapsular el contenido dinámico principal*/}
                <main>
                    {/*Renderiza el componente de la página según la ruta actual en la URL*/}
                    <Outlet />
                </main>

                {/*Renderiza el pie de página fijado en la parte inferior*/}
                <Footer />
            </div>
        </div>
    )
}

export default Layout; //Exporta el componente Layout por defecto para poder envolver las rutas en el enrutador principal
