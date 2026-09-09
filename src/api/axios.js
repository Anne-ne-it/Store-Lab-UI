import axios from "axios" //Importa la librería Axios para realizar peticiones HTTP
import { store } from "../store/index.js" //Importa el Store centralizado de Redux donde se maneja el estado global de la aplicación
import { logout } from "../store/authSlice.js" //Importa la acción de Redux para cerrar la sesión del usuario

const api = axios.create({ //Crea y configura una instancia personalizada de Axios que se reutilizará en toda la aplicación
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000", //Define la URL base de la API sacándola del archivo de variables de entorno, o usa localhost por defecto
  headers: { //Define los encabezados por defecto que se enviarán en cada petición
    "Content-Type": "application/json",
  },
})

api.interceptors.request.use( //Interceptor de peticiones: se ejecuta de manera automática JUSTO ANTES de que cualquier petición salga al servidor
  (config) => {
    const token = localStorage.getItem("token") //Busca si existe un token de autenticación guardado en el almacenamiento local del navegador

    if (token) { //Si el token existe, lo adjunta en la cabecera Authorization como un token Bearer
      config.headers.Authorization = `Bearer ${token}`
    }

    return config //Retorna la configuración modificada para que la petición pueda enviarse
  },

  (error) => Promise.reject(error) //Manejo de errores que ocurran en el momento de preparar o enviar la petición
)

api.interceptors.response.use( //Interceptor de respuestas: se ejecuta de manera automática CUANDO LLEGA la respuesta del servidor
  (response) => response, //Si la petición fue exitosa, retorna la respuesta tal cual
  (error) => { //Si ocurrió un error en la comunicación con el servidor
    
    if (error.response?.status === 401) { //Comprueba si el servidor respondió con un código de estado 401 (No autorizado / Token inválido o expirado)
      store.dispatch(logout()) //Despacha la acción de Redux para limpiar el estado del usuario y cerrar su sesión
    }

    return Promise.reject(error) //Reenvía el error para que la función que hizo la petición original pueda capturarlo si lo necesita
  }
)

export default api //Exporta la instancia configurada de Axios para ser usada en los servicios de la aplicación
