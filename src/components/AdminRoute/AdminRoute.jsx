import { useSelector } from "react-redux" //Importa el hook 'useSelector' de Redux para extraer datos del estado global de la aplicación
import { Navigate, Outlet, useLocation } from "react-router-dom" //Importa componentes y hooks de React Router para la navegación entre rutas
import { selectIsAdmin } from "../../store/authSlice.js" //Importa el selector personalizado 'selectIsAdmin' desde el slice de autenticación

function AdminRoute() { //Define el componente 'AdminRoute' que servirá como un guardián (guard) para proteger rutas de administrador
  const isAdmin = useSelector(selectIsAdmin) //Ejecuta el selector para obtener un valor booleano (true/false) que indica si el usuario es administrador
  const location = useLocation() //Obtiene el objeto 'location' actual para guardar la ruta a la que intentaba acceder el usuario

  if (!isAdmin) { //Comprueba si el usuario NO es administrador
    return <Navigate to="/" replace state={{ from: location }} /> //Redirige al usuario a la página principal ("/") reemplazando el historial y guardando la ruta previa en el estado
  }

  return <Outlet /> //Si es administrador, rinde el componente 'Outlet' para mostrar las rutas hijas protegidas
}

export default AdminRoute //Exporta el componente para poder ser utilizado en la configuración general de rutas
