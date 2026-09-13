import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useProducts } from "../../hooks/UseProducts";
import ProductGrid from "../../components/ProductGrid/ProductGrid";
import styles from "./HomePage.module.css";

function HomePage() {
    const { products, loading, error } = useProducts();
    const productIds = useSelector((state) => state.wishlist.productIds);

    const favoriteProducts = products.filter((product) =>
        productIds.includes(product.id)
    );

    return (
        <main className={styles.homePage}>

            <section className={styles.hero}>

                <div className={styles.heroOverlay}></div>

                <div className={styles.heroContent}>

                    <p className={styles.eyebrow}>
                        SURF · SKATE · CULTURE
                    </p>

                    <h1 className={styles.title}>
                        SURF, SKATE
                        <br />
                        Y LIBERTAD
                    </h1>

                    <div className={styles.divider}></div>

                    <p className={styles.copy}>
                        Equipamiento para quienes viven
                        el mar y la calle.
                    </p>

                    <div className={styles.heroButtons}>
                        {/* Redirige al catálogo completo */}
                        <Link
                            to="/products"
                            className={styles.primaryButton}
                        >
                            Ver catálogo
                        </Link>

                        {/* Redirige filtrando por novedad o seccion especial */}
                        <Link
                            to="/products?sort=newest"
                            className={styles.secondaryButton}
                        >
                            Novedades
                        </Link>
                    </div>

                </div>

            </section>

            <section className={styles.favoritesSection}>
                <div className={styles.sectionHeader}>
                    <div>
                        <p className={styles.sectionEyebrow}>NO TE PIERDAS NADA</p>
                        <h2>Favoritos</h2>
                    </div>

                    <Link to="/wishlist" className={styles.viewAll}>
                        Ver todos
                    </Link>
                </div>

                {loading && (
                    <p className={styles.status}>
                        Cargando favoritos...
                    </p>
                )}

                {error && (
                    <p className={styles.status}>
                        {error}
                    </p>
                )}

                {!loading && !error && favoriteProducts.length === 0 && (
                    <p className={styles.favoriteEmpty}>
                        Aún no tienes productos favoritos. Guarda alguno desde el catálogo.
                    </p>
                )}

                {!loading && !error && favoriteProducts.length > 0 && (
                    <ProductGrid products={favoriteProducts.slice(0, 4)} />
                )}
            </section>

            {/* CATEGORÍAS */}
            <section className={styles.categories}>

                <Link to="/products?category=surf" className={styles.category}>
                    <span className={styles.categoryIcon}>◉</span>

                    <div>
                        <strong>Surf</strong>
                        <span>Ver colección →</span>
                    </div>
                </Link>

                <Link to="/products?category=skate" className={styles.category}>
                    <span className={styles.categoryIcon}>◉</span>

                    <div>
                        <strong>Skate</strong>
                        <span>Ver colección →</span>
                    </div>
                </Link>

                <Link to="/products?category=neoprenos" className={styles.category}>
                    <span className={styles.categoryIcon}>◉</span>

                    <div>
                        <strong>Neoprenos</strong>
                        <span>Ver colección →</span>
                    </div>
                </Link>

                <Link to="/products?category=accesorios" className={styles.category}>
                    <span className={styles.categoryIcon}>◉</span>

                    <div>
                        <strong>Accesorios</strong>
                        <span>Ver colección →</span>
                    </div>
                </Link>

            </section>

        </main>
    );
}

export default HomePage;