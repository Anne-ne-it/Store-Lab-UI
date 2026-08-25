import { useEffect, useState} from 'react';
import { getProducts } from "../api/products";

export function useProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadProducts() {
            try {
                setLoading(true);
                setError("");
                const data = await getProducts();
                setProducts(data);
            } catch (fetchError) {
                setError("Error al cargar los productos.");
            } finally {
                setLoading(false);
            }
        }

        loadProducts();
    }, []);

    return { products, loading, error };
}