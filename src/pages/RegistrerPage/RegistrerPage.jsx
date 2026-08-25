import { useState } from "react";
import FormInput from "../../components/FormInput/FormInput";
import styles from "./RegisterPage.module.css";

function RegisterPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.email.trim()) {
      newErrors.email = "El email es obligatorio";
    }

    if (!form.password.trim()) {
      newErrors.password = "La contraseña es obligatoria";
    } else if (form.password.length < 6) {
      newErrors.password =
        "La contraseña debe tener al menos 6 caracteres";
    }

    if (!form.confirmPassword.trim()) {
      newErrors.confirmPassword =
        "Debes confirmar la contraseña";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword =
        "Las contraseñas no coinciden";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    console.log("Register:", form);

    // Aquí conectaremos register() de api/auth.js
  };

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <h1>Crear cuenta</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          <FormInput
            label="Email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="tu@email.com"
            error={errors.email}
          />

          <FormInput
            label="Contraseña"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Tu contraseña"
            error={errors.password}
          />

          <FormInput
            label="Confirmar contraseña"
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Repite tu contraseña"
            error={errors.confirmPassword}
          />

          <button type="submit" className={styles.button}>
            Crear cuenta
          </button>
        </form>
      </div>
    </main>
  );
}

export default RegisterPage;