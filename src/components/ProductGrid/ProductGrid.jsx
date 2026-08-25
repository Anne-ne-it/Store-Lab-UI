import ProductCard from "../ProductCard/ProductCard"
import styles from "./ProductGrid.module.css"

function ProductGrid({ products }) {
  return (
    <section className={styles.grid}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </section>
  )
}

export default ProductGrid