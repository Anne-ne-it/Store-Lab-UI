import { createSlice, createAsyncThunk } from "@reduxjs/toolkit" // Importa las funciones de Redux Toolkit para crear slices y thunks

const STORAGE_KEY = "storelab-wishlist" // Nombre de la clave donde se guarda la wishlist en localStorage

function getSavedWishlist() { // Recupera la lista de favoritos guardada anteriormente
  try {
    const saved = localStorage.getItem(STORAGE_KEY) // Lee la wishlist guardada
    return saved ? JSON.parse(saved) : [] // Si hay contenido, lo transforma en array; si no, devuelve []
  } catch {
    localStorage.removeItem(STORAGE_KEY) // Si el JSON está corrupto, limpia la entrada
    return []
  }
}

function saveWishlist(productIds) { // Guarda el estado actual de favoritos en localStorage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(productIds))
}

export const fetchWishlist = createAsyncThunk( // Crea un thunk para cargar la wishlist desde almacenamiento local
  "wishlist/fetchWishlist",
  async () => {
    return getSavedWishlist() // Devuelve la lista guardada
  }
)

const initialState = { // Estado inicial del slice de favoritos
  productIds: getSavedWishlist(), // Recupera los IDs guardados o un array vacío
  loading: false,
  error: null,
}

const wishlistSlice = createSlice({ // Define el slice de la lista de deseos
  name: "wishlist",
  initialState,
  reducers: {
    toggleWishlist: (state, action) => { // Añade o elimina un producto de la wishlist
      const productId = Number(action.payload) // Convierte el ID recibido a número para comparar correctamente
      const index = state.productIds.indexOf(productId) // Busca si ese ID ya está guardado

      if (index === -1) { // Si no existe, lo inserta
        state.productIds.push(productId)
      } else { // Si ya existe, lo elimina
        state.productIds.splice(index, 1)
      }

      saveWishlist(state.productIds) // Guarda la lista actualizada en localStorage
    },
  },
  extraReducers: (builder) => { // Gestiona los estados del thunk fetchWishlist
    builder
      .addCase(fetchWishlist.pending, (state) => { // Cuando empieza a cargar la wishlist
        state.loading = true
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => { // Cuando termina bien
        state.loading = false
        state.productIds = action.payload // Asigna la lista devuelta
      })
      .addCase(fetchWishlist.rejected, (state, action) => { // Cuando falla la carga
        state.loading = false
        state.error = action.error.message
      })
  },
})

export const { toggleWishlist } = wishlistSlice.actions // Exporta la acción para alternar productos favoritos
export default wishlistSlice.reducer // Exporta el reducer para integrarlo en el store principal
