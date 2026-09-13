import ProductCard from "../ProductCard/ProductCard" //Importa la tarjeta individual que se va a repetir para cada producto
import styles from "./ProductGrid.module.css" //Importa los estilos del grid de productos

function ProductGrid({ products }) { //Define un contenedor reusable para mostrar múltiples tarjetas de producto
  return (
    <section className={styles.grid}>
      {products.map((product) => ( //Recorre la lista de productos y renderiza uno por cada elemento
        <ProductCard key={product.id} product={product} />
      ))}
    </section>
  )
}

export default ProductGrid //Exporta el componente para poder usarlo en la página de catálogo y otras vistas que muestren listados de productos