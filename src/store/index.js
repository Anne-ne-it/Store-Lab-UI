import { configureStore } from "@reduxjs/toolkit" //Importa configureStore para crear el store raíz de Redux
import authReducer from "./authSlice.js" //Importa el reducer de autenticación
import cartReducer from "./cartSlice.js" //Importa el reducer del carrito
import wishlistReducer from "./wishlistSlice.js" //Importa el reducer de la wishlist

export const store = configureStore({ //Crea el store principal con todos los reducers de la app
  reducer: {
    auth: authReducer, //Guarda el estado de autenticación en auth
    cart: cartReducer, //Guarda el estado del carrito en cart
    wishlist: wishlistReducer, //Guarda la wishlist en wishlist
  },
})