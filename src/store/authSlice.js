import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

function getSavedUser() {
  try {
    const user = localStorage.getItem("user")
    return user ? JSON.parse(user) : null
  } catch {
    localStorage.removeItem("user")
    return null
  }
}

function normalizeUser(payload) {
  return payload?.user ?? payload?.data?.user ?? payload?.data ?? null
}

async function authRequest(endpoint, credentials) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(credentials),
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(data.message || data.error || "No se pudo completar la operación")
  }

  return data.data ?? data
}

export const register = createAsyncThunk(
  "auth/register",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const data = await authRequest("/api/auth/register", { email, password })
      const user = normalizeUser(data)
      const token = data?.token || (user ? "cookie-authenticated" : null)

      if (token) localStorage.setItem("token", token)
      if (user) localStorage.setItem("user", JSON.stringify(user))

      return { ...data, token, user }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const data = await authRequest("/api/auth/login", { email, password })
      const user = normalizeUser(data)
      const token = data?.token || (user ? "cookie-authenticated" : null)

      if (token) localStorage.setItem("token", token)
      if (user) localStorage.setItem("user", JSON.stringify(user))

      return { ...data, token, user }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const savedUser = getSavedUser()
const initialState = {
  token: localStorage.getItem("token") || (savedUser ? "cookie-authenticated" : null),
  user: savedUser,
  loading: false,
  error: null,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null
      state.user = null
      state.loading = false
      state.error = null
      localStorage.removeItem("token")
      localStorage.removeItem("user")
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.token = action.payload.token || "cookie-authenticated"
        state.user = action.payload.user ?? state.user
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Error al iniciar sesión"
      })
      .addCase(register.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false
        state.token = action.payload.token || "cookie-authenticated"
        state.user = action.payload.user ?? state.user
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Error al registrarse"
      })
  },
})

export const { logout, clearError } = authSlice.actions

export const selectIsAdmin = (state) =>
  String(state.auth.user?.role || "").toUpperCase() === "ADMIN"

export default authSlice.reducer
