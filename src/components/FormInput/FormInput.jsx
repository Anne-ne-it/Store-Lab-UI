import styles from "./FormInput.module.css"; //Importa los estilos CSS en forma de objeto desde el módulo CSS local

function FormInput({ //Define un componente funcional llamado FormInput que recibe un objeto de propiedades (props)
  label, //Texto que se mostrará en la etiqueta del input
  type = "text", //Tipo de input (por defecto será "text" si no se especifica)
  name, //Identificador único para el input y su etiqueta
  value, //Valor actual del campo de texto
  onChange, //Función que se ejecuta cada vez que el usuario escribe
  placeholder = "", //Texto de ayuda visual previo a escribir (vacío por defecto)
  error = "", //Mensaje de error a mostrar si el campo falla la validación
}) {
  return (     //Contenedor principal que envuelve todos los elementos del input
    <div className={styles.container}>
      
      {/*Etiqueta HTML enlazada con el campo mediante el atributo 'htmlFor'*/}
      <label htmlFor={name} className={styles.label}>
        {label}
      </label>

      {/*Campo de entrada de datos interactivo*/}
      <input
        id={name} //ID que coincide con el 'htmlFor' de la etiqueta
        name={name} //Nombre del campo en el formulario
        type={type} //Define si es texto, contraseña, correo, etc.
        value={value} //Estado controlado que contiene el texto del input
        onChange={onChange} //Manejador del evento de cambio
        placeholder={placeholder}
        /*Asigna la clase base 'input' y añade 'inputError' de forma dinámica si existe un error*/
        className={`${styles.input} ${error ? styles.inputError : ""}`}
      />

      {/*Solo muestra la etiqueta de error si la variable 'error' contiene un texto*/}
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}

export default FormInput; //Exporta el componente para poder reutilizarlo en otros formularios de la aplicación
