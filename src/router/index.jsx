import { createBrowserRouter, RouterProvider } from "react-router-dom" //Importa createBrowserRouter para definir las rutas de la aplicación y RouterProvider se encarga de activar y mostrar esas rutas
import Layout from "../components/Layout/Layout.jsx" //Importa el layout principal de la aplicación
import PrivateRoute from "../components/PrivateRoute/PrivateRoute.jsx" //Importa el componente que protege las rutas que requieren que el usuario haya iniciado sesión
import AdminRoute from "../components/AdminRoute/AdminRoute.jsx" //Importa el componente que protege las rutas exclusivas para usuarios con rol de administrador
import HomePage from "../pages/HomePage/HomePage.jsx" //Importa la página principal de la aplicación
import ProductsPage from "../pages/ProductsPage/ProductsPage.jsx" //Importa la página que muestra el listado completo de productos
import ProductDetailPage from "../pages/ProductDetailPage/ProductDetailPage.jsx" //Importa la página que muestra los detalles de un producto concreto
import LoginPage from "../pages/LoginPage/LoginPage.jsx" //Importa la página de inicio de sesión
import RegisterPage from "../pages/RegistrerPage/RegistrerPage.jsx" //Importa la página de registro de nuevos usuarios
import CartPage from "../pages/CartPage/CartPage.jsx" //Importa la página del carrito de compra
import WishlistPage from "../pages/WishlistPage/WishlistPage.jsx" //Importa la página de productos favoritos
import ProfilePage from "../pages/ProfilePage/ProfilePage.jsx" //Importa la página del perfil del usuario
import ContactPage from "../pages/ContactPage/ContactPage.jsx" //Importa la página de contacto
import CheckoutPage from "../pages/CheckoutSuccesPage/CheckoutPage.jsx" //Importa la página de confirmación o finalización del checkout
import AdminPage from "../pages/AdminPage/AdminPage.jsx" //Importa la página principal del panel de administración
import AdminProductsPage from "../pages/AdminProductsPage/AdminProductsPage.jsx" //Importa la página donde el administrador puede gestionar los productos
import AdminProductFormPage from "../pages/AdminProductFormPage/AdminProductFormPage.jsx" //Importa el formulario para crear o editar productos
import AdminUsersPage from "../pages/AdminUsersPage/AdminUsersPage.jsx" //Importa la página donde el administrador puede gestionar los usuarios
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage.jsx"//Importa la página que se muestra cuando la URL no existe o se produce un error de navegación


const router = createBrowserRouter([ //Crea la configuración principal del router

  {
    path: "/", //Define "/" como la ruta raíz de la aplicación, todas las rutas hijas se construirán a partir de esta ruta
    element: <Layout />, //Layout es el componente común que envuelve las diferentes páginas de la aplicación
    errorElement: <NotFoundPage />, //Si se produce un error en esta estructura de rutas, se mostrará NotFoundPage

    children: [ //Children contiene todas las rutas que están dentro de Layout
      {
        index: true, //Indica que esta es la página inicial
        element: <HomePage />, //Muestra la página de inicio
      },

      {
        path: "products", //Define la ruta pública "/products"
        element: <ProductsPage />, //Muestra el catálogo de productos
      },

      {
        path: "products/:productId", //Define una ruta dinámica
        element: <ProductDetailPage />, //Muestra la página con los detalles del producto
      },

      {
        path: "contact", //Define la ruta pública "/contact"
        element: <ContactPage />, //Muestra la página de contacto
      },

      {
        path: "login", //Define la ruta pública "/login"
        element: <LoginPage />, //Muestra la página de inicio de sesión
      },

      {
        path: "register", //Define la ruta pública "/register"
        element: <RegisterPage />, //Muestra la página para registrar un nuevo usuario
      },

      { //Este objeto agrupa las rutas que necesitan autenticación
        element: <PrivateRoute />, //PrivateRoute comprueba si existe un usuario autenticado, si no hay sesión, redirige a "/login"
        children: [ //Estas rutas solamente están disponibles para usuarios que han iniciado sesión
          {
            path: "cart", //Ruta privada "/cart"
            element: <CartPage />, //Muestra la página del carrito del usuario
          },

          {
            path: "wishlist", //Ruta privada "/wishlist"
            element: <WishlistPage />, //Muestra la lista de deseos del usuario
          },

          {
            path: "profile", //Ruta privada "/profile"
            element: <ProfilePage />, //Muestra la página de perfil del usuario
          },

          {
            path: "checkout", //Ruta privada "/checkout"
            element: <CheckoutPage />, //Muestra la página para confirmar el pedido
          },
        ],
      },

      { //Este objeto agrupa las rutas exclusivas del administrador, AdminRoute comprueba si el usuario tiene permisos de administrador
        element: <AdminRoute />, //AdminRoute protege todas las rutas incluidas en children
        children: [ //Estas rutas solamente están disponibles para usuarios con rol ADMIN 
          {
            path: "admin", //Ruta principal del panel de administración
            element: <AdminPage />, //Muestra el panel de Admin
          },

          {
            path: "admin/products", //Ruta para gestionar el catálogo: "/admin/products"
            element: <AdminProductsPage />, //Muestra un panel en el que poder gestionar el catálogo
          },

          {
            path: "admin/products/new", //Ruta para crear un producto nuevo: "/admin/products/new"
            element: <AdminProductFormPage />, //Muestra el formulario para crear un producto nuevo
          },

          {
            path: "admin/products/:id/edit", // Ruta para editar un producto existente
            element: <AdminProductFormPage />, //Permite editar un producto existente
          },

          {
            path: "admin/users", //Ruta para gestionar los usuarios: "/admin/users"
            element: <AdminUsersPage />, //Muestra un panel para gestionar los usuarios
          },
        ],
      },

      {
        path: "*", //"*" representa cualquier ruta que no coincida con las rutas definidas anteriormente
        element: <NotFoundPage />, //Muestra la página personalizada de error 404
      },
    ],
  },
])

function IndexRouter() { //Declara el componente IndexRouter, proporciona el router configurado al resto de la aplicación
  return <RouterProvider router={router} /> //React Router controla la navegación y decide qué página mostrar según la URL actual
}

export default IndexRouter //Exporta IndexRouter como exportación predeterminada, permite importarlo desde App.jsx

