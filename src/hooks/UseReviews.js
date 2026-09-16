import { useEffect, useState } from "react"; //Importa los hooks necesarios de React para manejar el estado y los efectos secundarios
import { getReviews } from "../api/reviews"; //Importa la función que realiza la petición a la API para obtener las reseñas

export function useReviews(productId) { //Define y exporta un Custom Hook que recibe el ID de un producto
  const [reviews, setReviews] = useState([]); //Estado para almacenar la lista de reseñas (inicia como un arreglo vacío)
  const [loading, setLoading] = useState(true); //Estado para indicar si la información se está cargando (inicia en true)
  const [error, setError] = useState(""); //Estado para guardar un mensaje de error si la petición falla (inicia como texto vacío)

  useEffect(() => { //Hook que ejecuta el código interno cada vez que cambia 'productId'
    let isMounted = true; //Variable para evitar actualizar el estado si el componente se desmonta antes de terminar

    async function loadReviews() { //Función asíncrona interna para gestionar la carga de datos
      if (!productId) { //Si no hay un productId válido, limpia las reseñas y marca como cargando
        setReviews([]);
        setLoading(true);
        return; //Detiene la ejecución de la función aquí
      }

      try { //Antes de consultar la API, activa el estado de carga y limpia errores previos
        setLoading(true);
        setError("");

        const data = await getReviews(productId); //Llama a la API de forma asíncrona pasando el ID del producto
        if (isMounted) { //Si el componente sigue montado, guarda los datos recibidos
          const reviewList = Array.isArray(data) ? data : data?.reviews || []; //Verifica si la respuesta es un arreglo; si no, busca la propiedad 'reviews' o asigna un arreglo vacío
          setReviews(reviewList);
        }
      } catch (fetchError) {
        console.error(fetchError); //Muestra el error en la consola para depuración

        if (isMounted) { //Si ocurre un error y el componente sigue montado, establece un mensaje y vacía las reseñas
          setError("No se pudieron cargar las reseñas.");
          setReviews([]);
        }
      } finally { //Se ejecuta siempre al final (éxito o error): desactiva el estado de carga
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadReviews(); //Ejecuta la función de carga de reseñas

    return () => { //Función de limpieza de React: se ejecuta cuando el componente se desmonta o se vuelve a ejecutar el efecto
      isMounted = false; //Marca la bandera como false para ignorar respuestas de peticiones anteriores que lleguen tarde
    };
  }, [productId]); //Arreglo de dependencias: el efecto se reinicia si 'productId' cambia

  return { reviews, loading, error, }; //Retorna un objeto con los estados actualizados para que los use cualquier componente
}