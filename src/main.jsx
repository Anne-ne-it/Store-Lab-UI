import { StrictMode } from "react" //Importa StrictMode desde React
import { createRoot } from "react-dom/client" //Importa createRoot, que permite crear el punto de entrada de una aplicación React
import { Provider } from "react-redux" //Importa Provider desde React Redux
import "./styles/variables.css" //Importa las variables globales de diseño
import "./styles/index.css" //Importa los estilos globales de la aplicación
import App from "./App.jsx" //Importa el componente principal de la aplicación, App normalmente contiene el router y la estructura general de la web
import { store } from "./store/index.js" //Importa el store principal de Redux, contiene el estado global de la aplicación, como usuario, carrito y favoritos


createRoot(document.getElementById("root")).render( //Busca en el HTML el elemento que tiene el id "root" en ese elemento se montará toda la aplicación
  <StrictMode> {/*StrictMode envuelve la aplicación para activar comprobaciones adicionales durante el desarrollo*/}
    <Provider store={store}> {/*Conecta Redux con toda la aplicación*/}
      <App /> {/*Renderiza el componente principal de la aplicación, App contiene el resto de componentes, páginas y rutas*/}
    </Provider>
  </StrictMode>
)
