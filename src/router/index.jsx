// INDEX.JSX crea las rutas para la navegación completa

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from "../components/Layout/Layout.jsx";

import HomePage from "../pages/HomePage/HomePage.jsx";
import ProductsPage from "../pages/ProductsPage/ProductsPage.jsx";
import ProductDetailPage from "../pages/ProductDetailPage/ProductDetailPage.jsx";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        errorElement: <NotFoundPage />,

        children: [
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
                path: "*",
                element: <NotFoundPage />,
            },
        ],
    },
]);

function IndexRouter() {
    return <RouterProvider router={router} />;
}

export default IndexRouter;