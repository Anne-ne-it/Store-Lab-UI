import styles from "./FormInput.module.css";

function FormInput({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder = "",
  error = "",
}) {
  return (
    <div className={styles.container}>
      <label htmlFor={name} className={styles.label}>
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`${styles.input} ${error ? styles.inputError : ""}`}
      />

      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}

export default FormInput;