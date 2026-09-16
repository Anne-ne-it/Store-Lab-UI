import { useSelector } from "react-redux" //Importa useSelector desde React Redux, permite leer información del store global de Redux
import { Navigate, Outlet, useLocation } from "react-router-dom" //Importa Navigate: permite redirigir al usuario a otra ruta, Outlet: muestra el contenido de una ruta hija, useLocation: permite conocer la URL actual
import { selectIsAdmin } from "../../store/authSlice.js" //Importa el selector que comprueba si el usuario es administrador, definido en authSlice.js.


function AdminRoute() { //Declara el componente AdminRoute, protege las rutas privadas del panel de administración
  const isAdmin = useSelector(selectIsAdmin) //Lee el estado global de Redux y comprueba si el usuario es administrador
  const location = useLocation() //Obtiene información sobre la ruta actual

  if (!isAdmin) { //Comprueba si el usuario NO es administrador
    return <Navigate to="/" replace state={{ from: location }} /> //Redirige al usuario a la página principal

  }

  return <Outlet /> //Si el usuario sí es administrador, muestra el contenido de la ruta protegida
}

export default AdminRoute //Exporta AdminRoute para utilizarse desde el archivo que configura las rutas
