import { useState } from "react";
import FormInput from "../../components/FormInput/FormInput";
import styles from "./LoginPage.module.css";

function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
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
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    console.log("Login:", form);

    // Aquí conectaremos login() de api/auth.js
  };

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <h1>Iniciar sesión</h1>

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

          <button type="submit" className={styles.button}>
            Iniciar sesión
          </button>
        </form>
      </div>
    </main>
  );
}

export default LoginPage;