import { useEffect, useState} from 'react'; //Importa los hooks useState (para manejar el estado) y useEffect (para efectos secundarios) desde React
import { getProducts } from "../api/products"; //Importa la función 'getProducts' que realiza la petición a la API para traer los productos

export function useProducts() { //Define y exporta la función del Custom Hook llamado 'useProducts'
    const [products, setProducts] = useState([]); //Estado para guardar la lista de productos (inicia como un arreglo vacío)
    const [loading, setLoading] = useState(true); //Estado para saber si la información sigue cargando (inicia en true)
    const [error, setError] = useState(""); //Estado para almacenar un mensaje de error en caso de que falle la petición

    useEffect(() => { //Hook que ejecuta el código interno cuando el componente se monta por primera vez
        async function loadProducts() { //Función asíncrona interna para manejar la petición de datos
            try { //Activa el estado de carga y borra errores previos antes de iniciar la petición
                setLoading(true);
                setError("");
                const data = await getProducts(); //Llama a la API de forma asíncrona y espera la respuesta
                setProducts(data); //Guarda la lista de productos obtenida en el estado 'products'
            } catch (fetchError) {
                setError("Error al cargar los productos."); //Si ocurre un fallo en la petición, guarda este mensaje de error en el estado
            } finally { //Se ejecuta siempre al terminar (sea con éxito o con error) para desactivar el estado de carga
                setLoading(false);
            }
        }

        loadProducts(); //Llama a la función interna para iniciar el proceso de carga
    }, []); //La dependencia vacías[] indica que este efecto solo se ejecuta 1 sola vez (al montar el componente)

    return { products, loading, error }; //Devuelve los estados para que cualquier componente que use este hook pueda acceder a ellos

}