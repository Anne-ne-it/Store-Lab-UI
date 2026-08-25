import { useParams } from "react-router-dom";
import { products } from "../../data/mockProducts";
import StarRating from "../../components/StarRating/StarRating";
import ReviewList from "../../components/ReviewList/ReviewList";
import styles from "./ProductDetailPage.module.css";

function ProductDetailPage() {
    const { productId } = useParams();

    const product = products.find(
        (product) => product.id === parseInt(productId)
    );

    if (!product) {
        return (
            <main className={styles.ProductDetailPage}>
                <div className={styles.error}>
                    <h2 className={styles.errorCode}>404</h2>

                    <p className={styles.errorMessage}>
                        Producto no encontrado
                    </p>
                </div>
            </main>
        );
    }

    return (
        <main className={styles.ProductDetailPage}>

            <section className={styles.product}>

                <div className={styles.imageContainer}>
                    <img
                        className={styles.productImage}
                        src={product.image}
                        alt={product.name}
                    />
                </div>

                <div className={styles.productInfo}>

                    <span className={styles.productCategory}>
                        {product.category}
                    </span>

                    <h1 className={styles.productName}>
                        {product.name}
                    </h1>

                    <StarRating
                        rating={product.rating}
                        showValue
                    />

                    <p className={styles.productDescription}>
                        {product.description}
                    </p>

                    <p className={styles.productPrice}>
                        {product.price} €
                    </p>

                    <button className={styles.buyButton}>
                        Añadir al carrito
                    </button>

                </div>

            </section>

            <ReviewList productId={product.id} />

        </main>
    );
}

export default ProductDetailPage;