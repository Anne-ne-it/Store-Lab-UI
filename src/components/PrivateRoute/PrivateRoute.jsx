import { Navigate, Outlet, useLocation, } from "react-router-dom" //Importa componentes de React Router para proteger rutas privadas
import { useSelector } from "react-redux" //Importa el hook para leer la sesión del usuario desde Redux

function PrivateRoute() { //Define una ruta protegida que solo se puede acceder si hay sesión activa
  const token = useSelector((state) => state.auth.token) //Lee el token del usuario autenticado
  const user = useSelector((state) => state.auth.user) //Lee el usuario guardado en el estado
  const location = useLocation() //Obtiene la ruta actual para guardar la dirección anterior si redirige al login
  const isAuthenticated = Boolean(token) || Boolean(user) //Considera autenticado si hay token o usuario cargado

  if (!isAuthenticated) { //Si no hay sesión, manda al usuario al login
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    )
  }

  return <Outlet /> //Si está autenticado, renderiza el contenido protegido de la ruta
}

export default PrivateRoute
