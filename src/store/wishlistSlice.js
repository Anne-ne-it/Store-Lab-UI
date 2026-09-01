import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

const STORAGE_KEY = "storelab-wishlist"

function getSavedWishlist() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    return []
  }
}

function saveWishlist(productIds) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(productIds))
}

export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async () => {
    return getSavedWishlist()
  }
)

const initialState = {
  productIds: getSavedWishlist(),
  loading: false,
  error: null,
}

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    toggleWishlist: (state, action) => {
      const productId = Number(action.payload)
      const index = state.productIds.indexOf(productId)

      if (index === -1) {
        state.productIds.push(productId)
      } else {
        state.productIds.splice(index, 1)
      }

      saveWishlist(state.productIds)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false
        state.productIds = action.payload
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})

export const { toggleWishlist } = wishlistSlice.actions
export default wishlistSlice.reducer