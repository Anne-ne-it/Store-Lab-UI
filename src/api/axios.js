import axios from "axios" // Importa la librería Axios para poder hacer peticiones HTTP desde la aplicación
import { store } from "../store/index.js" // Importa el store global de Redux para poder despachar acciones de sesión si hace falta
import { logout } from "../store/authSlice.js" // Importa la acción logout para cerrar la sesión cuando el backend responde 401

const api = axios.create({ // Crea una instancia personalizada de Axios para reutilizarla en toda la app
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000", // Define la URL base del backend usando la variable de entorno o localhost si no existe
  withCredentials: true, // Permite enviar y recibir cookies dentro de las peticiones, necesario para autenticación basada en sesión
  headers: { // Define los headers por defecto que se enviarán en cada petición
    "Content-Type": "application/json", // Indica que el contenido enviado es JSON
  },
})

const isRealAuthToken = (value) => Boolean(value) && value !== "cookie-authenticated" && value !== "null" && value !== "undefined" // Valida que el token guardado sea un valor real y no un marcador artificial de sesión

api.interceptors.request.use( // Ejecuta código justo antes de enviar cada petición HTTP
  (config) => {
    config.withCredentials = true // Asegura que la cookie de sesión siga presente en cada llamada

    const token = localStorage.getItem("token") // Busca el token almacenado en localStorage para saber si el usuario está autenticado

    if (isRealAuthToken(token)) { // Si existe un token JWT real, lo añade en la cabecera Authorization como Bearer
      config.headers.Authorization = `Bearer ${token}`
    } else {
      delete config.headers.Authorization // Si no hay token válido, elimina cualquier Authorization previa para evitar errores
    }

    return config // Devuelve la configuración final lista para salir al servidor
  },

  (error) => Promise.reject(error) // Si ocurre un error durante la preparación de la petición, se propaga para manejarlo más arriba
)

api.interceptors.response.use( // Ejecuta código cuando llega la respuesta del servidor
  (response) => response, // Si la petición ha sido correcta, devuelve la respuesta tal cual
  (error) => { // Si la petición falla, entra aquí para manejar errores globales
    
    if (error.response?.status === 401) { // Si el backend responde con 401, significa que el token es inválido o la sesión expiró
      store.dispatch(logout()) // Despacha la acción logout para limpiar la sesión del usuario y dejar la app en estado no autenticado
    }

    return Promise.reject(error) // Reenvía el error para que la función que lanzó la petición pueda decidir cómo mostrarlo
  }
)

export default api // Exporta la instancia configurada para reutilizarla en todos los servicios de la API
