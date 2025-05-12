import useAuth from '@hooks/useAuth'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

const PublicRoute = ({ children }) => {
  const { currentUser } = useAuth()
  const location = useLocation()

  if (currentUser) {
    const from = location.state?.from?.pathname || '/dashboard'
    return <Navigate to={from} replace />
  }

  return children ? children : <Outlet />
}

export default PublicRoute
