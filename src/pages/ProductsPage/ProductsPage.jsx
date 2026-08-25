import { useProducts } from "../../hooks/useProducts";
import ProductGrid from "../../components/ProductGrid/ProductGrid";
import styles from "./ProductsPage.module.css";

function ProductsPage() {
    const { products, loading, error } = useProducts();

    if (loading) {
        return (
            <main className={styles.page}>
                <p className={styles.status}>
                    Cargando productos...
                </p>
            </main>
        );
    }

    if (error) {
        return (
            <main className={styles.page}>
                <p className={styles.error}>
                    {error}
                </p>
            </main>
        );
    }

    return (
        <main className={styles.page}>

            <header className={styles.header}>

                <p className={styles.eyebrow}>
                    STORE LAB · SURF &amp; SKATE
                </p>

                <h1>
                    Nuestro catálogo
                </h1>

                <p className={styles.description}>
                    Material, estilo y actitud para disfrutar
                    de cada sesión dentro y fuera del agua.
                </p>

            </header>


            {products.length === 0 ? (
                <p className={styles.status}>
                    No hay productos disponibles.
                </p>
            ) : (
                <ProductGrid products={products} />
            )}

        </main>
    );
}

export default ProductsPage;