import { useEffect, useState } from "react";
import { getReviews } from "../api/reviews";

export function useReviews(productId) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadReviews() {
      if (!productId) {
        setReviews([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data = await getReviews(productId);

        if (isMounted) {
          setReviews(data);
        }
      } catch (fetchError) {
        console.error(fetchError);

        if (isMounted) {
          setError("No se pudieron cargar las reseñas.");
          setReviews([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadReviews();

    return () => {
      isMounted = false;
    };
  }, [productId]);

  return {
    reviews,
    loading,
    error,
  };
}
