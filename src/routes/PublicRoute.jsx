import useAuth from '@hooks/useAuth'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { Spin } from 'antd'

const PublicRoute = ({ children }) => {
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
          background: 'linear-gradient(135deg, #1a73e8 0%, #0d47a1 100%)',
        }}
      >
        <Spin size="large" />
      </div>
    )
  }

  if (currentUser) {
    const from = location.state?.from?.pathname || '/dashboard'
    return <Navigate to={from} replace />
  }

  return children ? children : <Outlet />
}

export default PublicRoute
