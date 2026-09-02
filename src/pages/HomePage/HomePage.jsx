import { useState } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../../hooks/UseProducts";
import ProductGrid from "../../components/ProductGrid/ProductGrid";
import styles from "./HomePage.module.css";

function HomePage() {
    const { products, loading, error } = useProducts();
    const [search, setSearch] = useState("");

    const visibleProducts = !search.trim()
        ? []
        : products.filter((product) => {
            const searchText = search.toLowerCase().trim();

            return (
                product.name?.toLowerCase().includes(searchText) ||
                product.title?.toLowerCase().includes(searchText) ||
                product.category?.toLowerCase().includes(searchText)
            );
        });

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

            {/* BUSCADOR Y PRODUCTOS */}
            <section>
                <div className={styles.searchBox}>

                    <label htmlFor="search">
                        Buscar productos
                    </label>

                    <input
                        id="search"
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Busca por nombre o categoría..."
                    />

                </div>

                {loading && (
                    <p className={styles.status}>
                        Cargando productos...
                    </p>
                )}

                {error && (
                    <p className={styles.status}>
                        {error}
                    </p>
                )}

                {!loading && !error && (
                    <>
                        {!search.trim() ? (
                            <p className={styles.status}>
                                Escribe en el buscador para ver los productos.
                            </p>
                        ) : visibleProducts.length === 0 ? (
                            <p className={styles.status}>
                                No se encontraron productos que coincidan con "{search}".
                            </p>
                        ) : (
                            <ProductGrid products={visibleProducts} />
                        )}
                    </>
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