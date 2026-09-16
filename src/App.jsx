import AppRouter from "./router/index.jsx" //Importa el componente AppRouter desde el archivo que contiene la configuración de las rutas de la aplicación

function App() { //Declara el componente principal llamado App, representa la entrada principal de la aplicación
  return <AppRouter /> //Devuelve el componente AppRouter, se encarga de mostrar la página correspondiente según la URL en la que se encuentre el usuario
}

export default App //Exporta el componente App, permite importarlo desde otros archivos, por ejemplo desde main.jsx

