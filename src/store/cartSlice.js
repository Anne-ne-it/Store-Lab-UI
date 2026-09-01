import { createSlice } from "@reduxjs/toolkit"

const STORAGE_KEY = "storelab-cart"

function getSavedCart() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    return []
  }
}

function saveCart(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

const initialState = {
  items: getSavedCart(),
  loading: false,
  error: null,
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addCartItem: (state, action) => {
      const { product, quantity = 1 } = action.payload
      const existingItem = state.items.find(
        (item) => item.product.id === product.id
      )

      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        state.items.push({
          id: product.id,
          product,
          quantity,
        })
      }

      saveCart(state.items)
    },
    removeCartItem: (state, action) => {
      state.items = state.items.filter(
        (item) => item.id !== action.payload
      )

      saveCart(state.items)
    },
    clearCart: (state) => {
      state.items = []
      saveCart(state.items)
    },
    clearCartError: (state) => {
      state.error = null
    },
  },
})

export const {
  addCartItem,
  removeCartItem,
  clearCart,
  clearCartError,
} = cartSlice.actions

export default cartSlice.reducer