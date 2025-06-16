import React from 'react'
import { Card, Row, Col, Statistic } from 'antd'
import { UserOutlined, TeamOutlined } from '@ant-design/icons'

const UserStatsCards = ({ userStats }) => {
  return (
    <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
      <Col xs={24} sm={8}>
        <Card className="stat-card">
          <Statistic
            title="Total Managed Users"
            value={userStats.total}
            prefix={<TeamOutlined style={{ color: '#666' }} />}
          />
        </Card>
      </Col>
      <Col xs={24} sm={8}>
        <Card className="stat-card">
          <Statistic
            title="Managers"
            value={userStats.managers}
            prefix={<UserOutlined style={{ color: '#666' }} />}
          />
        </Card>
      </Col>
      <Col xs={24} sm={8}>
        <Card className="stat-card">
          <Statistic
            title="Employees"
            value={userStats.employees}
            prefix={<TeamOutlined style={{ color: '#666' }} />}
          />
        </Card>
      </Col>
    </Row>
  )
}

export default UserStatsCards
