import { useSelector } from "react-redux"; // Importa useSelector para leer el estado global de Redux, como la wishlist del usuario
import { Link, useNavigate } from "react-router-dom"; // Importa Link y useNavigate para navegar entre rutas y redirigir al usuario
import { useProducts } from "../../hooks/UseProducts"; // Importa el hook que trae todos los productos desde la API
import ProductGrid from "../../components/ProductGrid/ProductGrid"; // Importa el componente que renderiza una cuadrícula con tarjetas de productos
import styles from "./HomePage.module.css"; // Importa los estilos específicos para la página principal

function HomePage() { // Define la página de inicio con el hero, novedades y favoritos
    const { products, loading, error } = useProducts(); // Obtiene la lista completa de productos y su estado de carga/error
    const productIds = useSelector((state) => state.wishlist.productIds); // Lee los IDs de productos que están marcados como favoritos
    const navigate = useNavigate(); // Permite redirigir al usuario a otras rutas desde botones o acciones

    const newestProducts = [...products] // Copia la lista de productos para ordenarla sin mutar el original
        .sort((a, b) => { // Ordena los productos por fecha de creación, más recientes primero
            const aDate = new Date(a.createdAt || a.created_at || a.created || 0).getTime(); // Convierte la fecha de creación del producto A a timestamp
            const bDate = new Date(b.createdAt || b.created_at || b.created || 0).getTime(); // Convierte la fecha de creación del producto B a timestamp

            if (!Number.isNaN(aDate) && !Number.isNaN(bDate) && aDate !== 0 && bDate !== 0) { // Si las fechas son válidas, ordena por fecha descendente
                return bDate - aDate;
            }

            return Number(b.id ?? 0) - Number(a.id ?? 0); // Si la fecha no existe, usa el id como criterio de orden
        })
        .slice(0, 4); // Selecciona solo los 4 productos más recientes para la sección de novedades

    const favoriteProducts = products.filter((product) => // Filtra los productos que están dentro de la wishlist del usuario
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

                        {/* Redirige filtrando por novedad o sección especial */}
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
                        <h2>Novedades</h2>
                    </div>

                    <button
                        type="button"
                        className={styles.viewAll}
                        onClick={() => navigate("/products?sort=newest&limit=4")}
                    >
                        Ver todos
                    </button>
                </div>

                {loading && ( // Si la carga está en proceso, muestra un estado de espera
                    <p className={styles.status}>
                        Cargando novedades...
                    </p>
                )}

                {error && ( // Si hubo un error al cargar productos, muestra el problema
                    <p className={styles.status}>
                        {error}
                    </p>
                )}

                {!loading && !error && newestProducts.length === 0 && ( // Si no hay productos recientes, muestra un estado vacío
                    <p className={styles.favoriteEmpty}>
                        Aún no hay productos recientes en la colección.
                    </p>
                )}

                {!loading && !error && newestProducts.length > 0 && ( // Si hay productos, los renderiza en una grilla
                    <ProductGrid products={newestProducts} />
                )}
            </section>

            <section className={styles.favoritesSection}> 
                <div className={styles.sectionHeader}> 
                    <div>
                        <p className={styles.sectionEyebrow}>CURADO PARA TI</p>
                        <h2>Favoritos</h2>
                    </div>

                    <Link to="/wishlist" className={styles.viewAll}> 
                        Ver todos
                    </Link>
                </div>

                {!loading && !error && favoriteProducts.length === 0 && ( // Si el usuario aún no tiene favoritos, indica mensaje vacío
                    <p className={styles.favoriteEmpty}>
                        Aún no tienes productos favoritos. Guarda alguno desde el catálogo.
                    </p>
                )}

                {!loading && !error && favoriteProducts.length > 0 && ( // Muestra los favoritos si existen
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