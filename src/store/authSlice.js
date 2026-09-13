import { createAsyncThunk, createSlice } from "@reduxjs/toolkit" // Importa las utilidades de Redux Toolkit para crear thunks y slices

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000" // Define la URL base del backend usando variables de entorno o localhost

function getSavedUser() { // Lee el usuario guardado en localStorage para restaurar sesión al recargar la página
  try {
    const user = localStorage.getItem("user") // Intenta leer el usuario almacenado
    return user ? JSON.parse(user) : null // Si existe, lo transforma a objeto; si no, devuelve null
  } catch {
    localStorage.removeItem("user") // Si el JSON está corrupto, elimina la entrada para evitar errores
    return null
  }
}

function normalizeUser(payload) { // Normaliza la estructura de la respuesta para extraer el usuario de distintos formatos
  return payload?.user ?? payload?.data?.user ?? payload?.data ?? null // Devuelve el usuario si está en user, data.user o directamente en data
}

async function authRequest(endpoint, credentials) { // Hace una petición de login/registro a la API y devuelve la respuesta ya procesada
  const response = await fetch(`${API_URL}${endpoint}`, { // Envía la petición HTTP al endpoint adecuado
    method: "POST", // Indica que es una petición POST
    headers: { "Content-Type": "application/json" }, // Envía el contenido en JSON
    credentials: "include", // Incluye cookies de sesión para autenticación basada en navegador
    body: JSON.stringify(credentials), // Transforma las credenciales a JSON
  })

  const data = await response.json().catch(() => ({})) // Parsea el JSON y, si falla, devuelve un objeto vacío
  if (!response.ok) { // Si el backend responde con error, lanza una excepción con el mensaje del servidor
    throw new Error(data.message || data.error || "No se pudo completar la operación")
  }

  return data.data ?? data // Devuelve la parte útil de la respuesta
}

export const register = createAsyncThunk( // Crea un thunk para registrar usuarios
  "auth/register",
  async ({ email, password }, { rejectWithValue }) => { // Recibe email y password desde el formulario
    try {
      const data = await authRequest("/api/auth/register", { email, password }) // Se comunica con la API para registrar al usuario
      const user = normalizeUser(data) // Extrae el usuario de la respuesta
      const token = data?.token || (user ? "cookie-authenticated" : null) // Si la API devuelve token real, lo usa; si no, usa un marcador temporal para la sesión por cookie

      if (token) localStorage.setItem("token", token) // Guarda el token en localStorage cuando existe
      if (user) localStorage.setItem("user", JSON.stringify(user)) // Guarda el usuario para mantener la sesión al recargar

      return { ...data, token, user } // Devuelve la información completa del usuario registrado
    } catch (error) {
      return rejectWithValue(error.message) // Si falla, devuelve el mensaje para mostrarlo en la UI
    }
  }
)

export const login = createAsyncThunk( // Crea un thunk para iniciar sesión
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => { // Recibe las credenciales del formulario
    try {
      const data = await authRequest("/api/auth/login", { email, password }) // Envía las credenciales al endpoint de login
      const user = normalizeUser(data) // Normaliza la respuesta para obtener el usuario
      const token = data?.token || (user ? "cookie-authenticated" : null) // Mantiene compatibilidad con token real o sesión por cookies

      if (token) localStorage.setItem("token", token) // Guarda el token o marcador en el navegador
      if (user) localStorage.setItem("user", JSON.stringify(user)) // Guarda la información del usuario autenticado

      return { ...data, token, user } // Devuelve el estado final del login
    } catch (error) {
      return rejectWithValue(error.message) // Devuelve el mensaje de error al estado Redux
    }
  }
)

const savedUser = getSavedUser() // Recupera el usuario guardado para inicializar el estado de autenticación
const initialState = { // Estado inicial del slice de autenticación
  token: localStorage.getItem("token") || (savedUser ? "cookie-authenticated" : null), // Restaura el token o marcador si existe una sesión previa
  user: savedUser, // Asigna el usuario guardado si existe
  loading: false, // Controla si el proceso de autenticación está en curso
  error: null, // Guarda mensajes de error para la UI
}

const authSlice = createSlice({ // Define el slice principal de autenticación
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => { // Elimina la sesión activa del usuario
      state.token = null // Borra el token del estado Redux
      state.user = null // Elimina el usuario del estado
      state.loading = false // Resetea el estado de carga
      state.error = null // Borra errores anteriores
      localStorage.removeItem("token") // Elimina el token del almacenamiento local
      localStorage.removeItem("user") // Elimina el usuario guardado
    },
    clearError: (state) => { // Limpia el error de autenticación
      state.error = null
    },
  },
  extraReducers: (builder) => { // Gestiona los estados de los thunks login/register
    builder
      .addCase(login.pending, (state) => { // Cuando el login empieza
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => { // Cuando el login termina correctamente
        state.loading = false
        state.token = action.payload.token || "cookie-authenticated" // Guarda el token recibido o un valor por cookie
        state.user = action.payload.user ?? state.user // Actualiza el usuario autenticado
      })
      .addCase(login.rejected, (state, action) => { // Cuando el login falla
        state.loading = false
        state.error = action.payload || "Error al iniciar sesión"
      })
      .addCase(register.pending, (state) => { // Cuando el registro empieza
        state.loading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => { // Cuando el registro termina correctamente
        state.loading = false
        state.token = action.payload.token || "cookie-authenticated"
        state.user = action.payload.user ?? state.user
      })
      .addCase(register.rejected, (state, action) => { // Cuando el registro falla
        state.loading = false
        state.error = action.payload || "Error al registrarse"
      })
  },
})

export const { logout, clearError } = authSlice.actions // Exporta los actions del slice para usarlos desde la app

export const selectIsAdmin = (state) => // Selector para comprobar si el usuario conectado es administrador
  String(state.auth.user?.role || "").toUpperCase() === "ADMIN"

export default authSlice.reducer // Exporta el reducer para integrarlo en el store principal

