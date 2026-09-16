import { createSlice } from "@reduxjs/toolkit" //Importa la utilidad createSlice de Redux Toolkit para manejar el estado del carrito

const STORAGE_KEY = "storelab-cart" //Nombre de la clave en localStorage donde se persiste el carrito

function normalizeProductImage(product) { //Normaliza la imagen del producto para que siempre se encuentre en la propiedad image
  if (!product || typeof product !== "object") return product //Si no es objeto válido, devuelve el valor tal cual

  const image = //Intenta leer la imagen desde varias propiedades posibles según el formato del backend
    product.image ??
    product.imageUrl ??
    product.img ??
    product.thumbnail ??
    product.cover ??
    product.images?.[0]?.url ??
    product.images?.[0] ??
    product.media?.[0]?.url ??
    product.media?.[0] ??
    product.image_url ??
    product.imageUrl ??
    product.urlImagen ??
    product.foto ??
    ""

  return { //Devuelve el producto con la imagen unificada en product.image
    ...product,
    image: typeof image === "string" ? image : image?.url ?? "",
  }
}

function normalizeSavedCartItem(item) { //Normaliza cada producto guardado en localStorage para evitar perder la imagen al recargar
  if (!item || typeof item !== "object") return item //Si el elemento no es válido, lo devuelve tal cual

  const product = item.product ? normalizeProductImage(item.product) : normalizeProductImage(item) //Normaliza el producto interno o el propio item

  return { //Devuelve el item del carrito con estructura consistente para la UI
    ...item,
    product,
    id: item.id ?? product?.id ?? item.productId ?? item.product?.id,
    image: product?.image ?? item.image ?? "",
  }
}

export function getSavedCart() { //Recupera el carrito persistido en localStorage al iniciar la aplicación
  try {
    const saved = localStorage.getItem(STORAGE_KEY) //Busca la lista de productos guardada
    if (!saved) return [] //Si no existe, devuelve un array vacío

    const parsed = JSON.parse(saved) //Convierte el contenido guardado a JavaScript
    if (!Array.isArray(parsed)) return [] //Si no es una lista, ignora el contenido

    return parsed.map(normalizeSavedCartItem) //Normaliza cada producto para asegurar la imagen y formato correcto
  } catch {
    localStorage.removeItem(STORAGE_KEY) //Si el JSON está corrupto, limpia el almacenamiento
    return []
  }
}

function saveCart(items) { //Guarda el contenido actual del carrito en localStorage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

const initialState = { //Estado inicial del carrito
  items: getSavedCart(), //Recupera los productos ya guardados o un array vacío
  loading: false,
  error: null,
}

const cartSlice = createSlice({ //Define el slice del carrito de compras
  name: "cart",
  initialState,
  reducers: {
    addCartItem: (state, action) => { //Añade un producto al carrito o incrementa su cantidad si ya existe
      const { product, quantity = 1 } = action.payload //Recibe el producto y la cantidad deseada
      const normalizedProduct = normalizeProductImage(product) //Normaliza la imagen del nuevo producto
      const existingItem = state.items.find(
        (item) => item.product.id === normalizedProduct.id
      )

      if (!existingItem) { //Si el producto no está en el carrito, crea un nuevo item
        state.items.push({
          id: normalizedProduct.id,
          product: normalizedProduct,
          quantity: Math.max(quantity, 0),
        })
        saveCart(state.items) //Guarda la lista nueva en localStorage
        return
      }

      const nextQuantity = existingItem.quantity + quantity //Calcula la cantidad final tras sumar
      if (nextQuantity <= 0) { //Si la cantidad final es cero o negativa, elimina el producto
        state.items = state.items.filter((item) => item.id !== normalizedProduct.id)
      } else { //Si sigue habiendo unidades, actualiza la cantidad y la imagen
        existingItem.quantity = nextQuantity
        existingItem.product = {
          ...existingItem.product,
          ...normalizedProduct,
          image: normalizedProduct.image || existingItem.product.image || "",
        }
      }

      saveCart(state.items) //Persiste el cambio en localStorage
    },
    removeCartItem: (state, action) => { //Elimina un producto concreto del carrito
      state.items = state.items.filter(
        (item) => item.id !== action.payload
      )

      saveCart(state.items) //Guarda la nueva versión del carrito
    },
    clearCart: (state) => { //Vacía por completo el carrito
      state.items = []
      saveCart(state.items) //Persiste el carrito vacío
    },
    clearCartError: (state) => { //Borra errores de carrito si los hubiera
      state.error = null
    },
  },
})

export const { addCartItem, removeCartItem, clearCart, clearCartError, } = cartSlice.actions //Exporta las actions del slice para poder usarlas en componentes y thunks

export default cartSlice.reducer //Exporta el reducer para integrarlo en el store principal
