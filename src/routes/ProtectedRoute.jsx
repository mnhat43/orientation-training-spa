import useAuth from '@hooks/useAuth'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { currentUser } = useAuth()
  const location = useLocation()

  if (currentUser === null) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (!allowedRoles.includes(currentUser.role_id)) {
    return <Navigate to="/dashboard" state={{ from: location }} replace />
  }

  return children ? children : <Outlet />
}

export default ProtectedRoute
