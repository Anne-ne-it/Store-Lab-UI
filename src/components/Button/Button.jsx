import styles from "./Button.module.css"; //Importa las clases del archivo de CSS Modules como un objeto 'styles'

function Button({ //Define un componente funcional 'Button' que recibe sus props mediante desestructuración y con valores por defecto
    children, //El contenido interno del botón (texto, iconos u otros elementos React)
    variant = "primary", //La variante de estilo (por defecto "primary")
    type = "button", //El tipo de botón HTML (por defecto "button")
    onClick, //La función callback que se ejecuta al hacer clic
    disabled = false, //Estado de deshabilitado (por defecto false)
}) {
    return ( //Renderiza un elemento <button> nativo de HTML pasando sus atributos correspondientes

        <button
            type={type} //Asigna el tipo ("button", "submit", "reset")
            onClick={onClick} //Asigna el controlador de eventos de clic
            disabled={disabled} //Aplica la propiedad 'disabled' (true/false)
            className={`${styles.button} ${styles[variant]}`} //Asigna dinámicamente las clases de CSS combinando la clase base y la variante
        >

            {children} 
        </button> 
    );
}

export default Button; //Exporta el componente para poder ser utilizado en otras partes de la aplicación
