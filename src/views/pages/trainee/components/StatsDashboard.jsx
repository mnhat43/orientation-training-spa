import React from 'react'
import { Row, Col, Card, Statistic, Typography } from 'antd'
import {
  TeamOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  WarningOutlined,
} from '@ant-design/icons'

const { Text } = Typography

const StatsDashboard = ({ stats, activeTab, onViewPendingReviews }) => {
  return (
    <div className="stats-dashboard">
      <Row gutter={[16, 16]} className="stats-row">
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic
              title="Total Trainees"
              value={stats.totalTrainees}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic
              title="Completed Training"
              value={stats.totalCompleted}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic
              title="In Progress"
              value={stats.totalInProgress}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card
            className={`stat-card pending-reviews-card ${
              activeTab === 'pending-review' ? 'active' : ''
            }`}
            onClick={onViewPendingReviews}
          >
            <Statistic
              title={
                activeTab === 'pending-review'
                  ? 'Showing Pending Reviews'
                  : 'Pending Reviews'
              }
              value={stats.pendingReviewsCount}
              prefix={<WarningOutlined />}
              valueStyle={{
                color: stats.pendingReviewsCount > 0 ? '#f5222d' : '#bfbfbf',
              }}
            />
            {stats.pendingReviewsCount > 0 && (
              <Text type="secondary" className="click-hint">
                {activeTab === 'pending-review'
                  ? 'Click to show all'
                  : 'Click to filter'}
              </Text>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default StatsDashboard
