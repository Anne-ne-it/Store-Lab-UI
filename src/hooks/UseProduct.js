import { useEffect, useState } from "react"; //Importa los hooks necesarios de React para manejar efectos secundarios y estado local
import { getProductById } from "../api/products"; //Importa la función de la API que obtiene la información de un producto por su ID

export function useProduct(productId) { //Define y exporta un Custom Hook que recibe el ID de un producto como argumento
  const [product, setProduct] = useState(null); //Estado para almacenar la información del producto obtenido (inicia en null)
  const [loading, setLoading] = useState(true); //Estado para controlar si la petición está en proceso de carga (inicia en true)
  const [error, setError] = useState(""); //Estado para almacenar posibles mensajes de error (inicia como cadena vacía)

  useEffect(() => { //Hook que ejecuta la lógica de carga cada vez que el 'productId' cambia
    async function loadProduct() { //Función asíncrona interna para realizar la petición a la API
      if (!productId) { //Si no se proporciona un ID de producto, reinicia los estados y cancela la carga
        setProduct(null);
        setLoading(false);
        return;
      }

      try { //Activa el indicador de carga y limpia errores previos antes de consultar
         setLoading(true);
         setError("");
        const data = await getProductById(productId); //Petición asíncrona para obtener los datos del producto
        setProduct(data); //Guarda los datos obtenidos en el estado del producto
      } catch (fetchError) {
        console.error(fetchError); //En caso de fallo, imprime el error en la consola para depuración
        setError("Error al cargar el producto."); //Guarda un mensaje de error legible para la interfaz
        setProduct(null); //Limpia el estado del producto
      } finally {
        setLoading(false); //Se ejecuta siempre al terminar la petición (éxito o fallo) para desactivar el estado de carga
      }
    }

    loadProduct(); //Ejecuta la función de carga dentro del efecto
  }, [productId]); //Array de dependencias: se vuelve a ejecutar solo si cambia 'productId'

  return { product, loading, error }; //Retorna un objeto con los estados para que el componente que use el Hook pueda consumirlos
}