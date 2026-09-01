import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { logout } from "../../store/authSlice.js"
import styles from "./ProfilePage.module.css"

function ProfilePage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((state) => state.auth.user)

  const handleLogout = () => {
    dispatch(logout())
    navigate("/login")
  }

  return (
    <main>
      <h1>Mi perfil</h1>

      <p>
        Email: {user?.email || "Usuario sin email"}
      </p>

      <button type="button" onClick={handleLogout}>
        Cerrar sesión
      </button>
    </main>
  )
}

export default ProfilePage
