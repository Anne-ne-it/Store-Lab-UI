import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import FormInput from "../../components/FormInput/FormInput.jsx"
import { clearError, login } from "../../store/authSlice.js"
import styles from "./LoginPage.module.css"

function LoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { loading, error } = useSelector((state) => state.auth)

  const [form, setForm] = useState({
    email: "",
    password: "",
  })

  const [errors, setErrors] = useState({})

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }))

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }))

    if (error) {
      dispatch(clearError())
    }
  }

  const validate = () => {
    const newErrors = {}

    if (!form.email.trim()) {
      newErrors.email = "El email es obligatorio"
    }

    if (!form.password.trim()) {
      newErrors.password = "La contraseña es obligatoria"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!validate()) return

    try {
      await dispatch(login(form)).unwrap()
      navigate(location.state?.from?.pathname || "/", { replace: true })
    } catch {
      // El mensaje se muestra desde Redux.
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <h1>Iniciar sesión</h1>

        {error && <p className={styles.serverError}>{error}</p>}

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

          <button
            type="submit"
            className={styles.button}
            disabled={loading}
          >
            {loading ? "Entrando..." : "Iniciar sesión"}
          </button>
        </form>

        <p>
          ¿No tienes cuenta? <Link to="/register">Crear cuenta</Link>
        </p>
      </div>
    </main>
  )
}

export default LoginPage
