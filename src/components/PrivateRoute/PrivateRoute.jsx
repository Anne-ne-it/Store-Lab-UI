import { Navigate, Outlet, useLocation, } from "react-router-dom"
import { useSelector } from "react-redux"

function PrivateRoute() {
  const token = useSelector((state) => state.auth.token)
  const user = useSelector((state) => state.auth.user)
  const location = useLocation()
  const isAuthenticated = Boolean(token) || Boolean(user)

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    )
  }

  return <Outlet />
}

export default PrivateRoute
