import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Layout from "../components/Layout/Layout.jsx"
import PrivateRoute from "../components/PrivateRoute/PrivateRoute.jsx"
import AdminRoute from "../components/AdminRoute/AdminRoute.jsx"
import HomePage from "../pages/HomePage/HomePage.jsx"
import ProductsPage from "../pages/ProductsPage/ProductsPage.jsx"
import ProductDetailPage from "../pages/ProductDetailPage/ProductDetailPage.jsx"
import LoginPage from "../pages/LoginPage/LoginPage.jsx"
import RegisterPage from "../pages/RegistrerPage/RegistrerPage.jsx"
import CartPage from "../pages/CartPage/CartPage.jsx"
import WishlistPage from "../pages/WishlistPage/WishlistPage.jsx"
import ProfilePage from "../pages/ProfilePage/ProfilePage.jsx"
import CheckoutPage from "../pages/CheckoutSuccesPage/CheckoutPage.jsx"
import AdminPage from "../pages/AdminPage/AdminPage.jsx"
import AdminProductsPage from "../pages/AdminProductsPage/AdminProductsPage.jsx"
import AdminProductFormPage from "../pages/AdminProductFormPage/AdminProductFormPage.jsx"
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage.jsx"

const router = createBrowserRouter([{ path: "/", element: <Layout />, errorElement: <NotFoundPage />, children: [
  { index: true, element: <HomePage /> },
  { path: "products", element: <ProductsPage /> },
  { path: "products/:productId", element: <ProductDetailPage /> },
  { path: "login", element: <LoginPage /> },
  { path: "register", element: <RegisterPage /> },
  { element: <PrivateRoute />, children: [
    { path: "cart", element: <CartPage /> },
    { path: "wishlist", element: <WishlistPage /> },
    { path: "profile", element: <ProfilePage /> },
    { path: "checkout", element: <CheckoutPage /> },
  ] },
  { element: <AdminRoute />, children: [
    { path: "admin", element: <AdminPage /> },
    { path: "admin/products", element: <AdminProductsPage /> },
    { path: "admin/products/new", element: <AdminProductFormPage /> },
    { path: "admin/products/:id/edit", element: <AdminProductFormPage /> },
  ] },
  { path: "*", element: <NotFoundPage /> },
] }])

function IndexRouter() { return <RouterProvider router={router} /> }
export default IndexRouter
