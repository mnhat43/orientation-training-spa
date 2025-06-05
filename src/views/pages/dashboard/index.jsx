import React from 'react'
import useAuth from '@hooks/useAuth'
import { ROLES } from '@constants'
import AdminDashboard from './AdminDashboard'
import { Spin } from 'antd'
import MyLearningPath from '@views/pages/learning-path'
import { Navigate } from 'react-router-dom'

const Dashboard = () => {
  const { currentUser } = useAuth()

  if (!currentUser) {
    return (
      <div className="dashboard-loading">
        <Spin size="large" tip="Loading dashboard..." />
      </div>
    )
  }

  const renderDashboardByRole = () => {
    if (currentUser.role_id === ROLES.ADMIN) {
      return <AdminDashboard />
    } else if (currentUser.role_id === ROLES.MANAGER) {
      return <Navigate to="/manage-employee" replace />
    } else if (currentUser.role_id === ROLES.EMPLOYEE) {
      return <MyLearningPath />
    } else {
      return (
        <div className="unknown-role">
          <h2>Unknown user role</h2>
          <p>You don't have access to any dashboard.</p>
        </div>
      )
    }
  }

  return <div className="dashboard-container">{renderDashboardByRole()}</div>
}

export default Dashboard
