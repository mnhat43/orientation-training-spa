import useAuth from '@hooks/useAuth'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { Spin } from 'antd'

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { currentUser, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          background: '#f0f2f5',
        }}
      >
        <Spin size="large" />
      </div>
    )
  }

  if (currentUser === null) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (!allowedRoles.includes(currentUser.role_id)) {
    return <Navigate to="/dashboard" state={{ from: location }} replace />
  }

  return children ? children : <Outlet />
}

export default ProtectedRoute
