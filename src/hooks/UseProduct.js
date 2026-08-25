import { useEffect, useState } from "react";
import { getProductById } from "../api/products";

export function useProduct(productId) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProduct() {
      if (!productId) {
        setProduct(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data = await getProductById(productId);
        setProduct(data);
      } catch (fetchError) {
        console.error(fetchError);
        setError("Error al cargar el producto.");
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [productId]);

  return { product, loading, error };
}
