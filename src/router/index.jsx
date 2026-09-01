import { createBrowserRouter, RouterProvider } from "react-router-dom"

import Layout from "../components/Layout/Layout.jsx"
import PrivateRoute from "../components/PrivateRoute/PrivateRoute.jsx"

import HomePage from "../pages/HomePage/HomePage.jsx"
import ProductsPage from "../pages/ProductsPage/ProductsPage.jsx"
import ProductDetailPage from "../pages/ProductDetailPage/ProductDetailPage.jsx"
import LoginPage from "../pages/LoginPage/LoginPage.jsx"
import RegisterPage from "../pages/RegistrerPage/RegistrerPage.jsx"
import CartPage from "../pages/CartPage/CartPage.jsx"
import WishlistPage from "../pages/WishlistPage/WishlistPage.jsx"
import ProfilePage from "../pages/ProfilePage/ProfilePage.jsx"
import CheckoutPage from "../pages/CheckoutSuccesPage/CheckoutPage.jsx"
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage.jsx"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFoundPage />,
    children: [
      // Rutas públicas
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "products",
        element: <ProductsPage />,
      },
      {
        path: "products/:productId",
        element: <ProductDetailPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },

      // Rutas privadas
      {
        element: <PrivateRoute />,
        children: [
          {
            path: "cart",
            element: <CartPage />,
          },
          {
            path: "wishlist",
            element: <WishlistPage />,
          },
          {
            path: "profile",
            element: <ProfilePage />,
          },
          {
            path: "checkout",
            element: <CheckoutPage />,
          },
        ],
      },

      // Ruta para páginas inexistentes
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
])

function IndexRouter() {
  return <RouterProvider router={router} />
}

export default IndexRouter
