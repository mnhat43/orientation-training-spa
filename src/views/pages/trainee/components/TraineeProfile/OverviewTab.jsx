import React from 'react'
import { Row, Col, Card, Progress, Statistic, Descriptions, Tag } from 'antd'
import {
  FileTextOutlined,
  AuditOutlined,
  WarningOutlined,
  ClockCircleOutlined,
  FileDoneOutlined,
} from '@ant-design/icons'

// Get status color and icon - moved from utils.js
const getStatusTag = (status) => {
  let color, icon

  switch (status) {
    case 'Not Started':
      color = 'default'
      icon = <WarningOutlined />
      break
    case 'In Progress':
      color = 'processing'
      icon = <ClockCircleOutlined />
      break
    case 'Completed':
      color = 'success'
      icon = <FileDoneOutlined />
      break
    default:
      color = 'default'
      icon = <WarningOutlined />
  }

  return (
    <Tag color={color}>
      {icon} <span style={{ marginLeft: 5 }}>{status}</span>
    </Tag>
  )
}

const OverviewTab = ({ trainee, averageGrade, coursesNeedingReview }) => {
  // Calculate progress
  const progressPercent =
    trainee?.totalCourses > 0
      ? Math.round((trainee.completedCourses / trainee.totalCourses) * 100)
      : 0

  // Determine progress status
  const progressStatus = progressPercent === 100 ? 'success' : 'normal'

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} md={16}>
        <Card title="Training Progress" bodyStyle={{ padding: '12px 16px' }}>
          <Progress
            percent={progressPercent}
            status={progressStatus}
            format={(percent) => `${percent}%`}
            strokeWidth={12}
            style={{ marginBottom: 12 }}
          />

          <Row gutter={8}>
            <Col span={6}>
              <Statistic
                title="Completed"
                value={trainee.completedCourses}
                valueStyle={{ color: '#52c41a', fontSize: '1.2rem' }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="In Progress"
                value={trainee.inProgressCourses}
                valueStyle={{ color: '#1890ff', fontSize: '1.2rem' }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="Not Started"
                value={
                  trainee.totalCourses -
                  trainee.completedCourses -
                  trainee.inProgressCourses
                }
                valueStyle={{ fontSize: '1.2rem' }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="Total"
                value={trainee.totalCourses}
                valueStyle={{ fontSize: '1.2rem' }}
              />
            </Col>
          </Row>
        </Card>
      </Col>

      <Col xs={24} md={8}>
        <Row gutter={[0, 16]}>
          <Col span={24}>
            <Card bodyStyle={{ padding: '12px 16px' }}>
              <Statistic
                title="Average Grade"
                value={averageGrade ? averageGrade.toFixed(1) : 'N/A'}
                suffix="/ 100"
                valueStyle={{
                  color: averageGrade >= 80 ? '#3f8600' : '#cf1322',
                  fontSize: '1.5rem',
                }}
                prefix={<FileTextOutlined />}
              />
            </Card>
          </Col>
          <Col span={24}>
            <Card bodyStyle={{ padding: '12px 16px' }}>
              <Statistic
                title="Courses Awaiting Review"
                value={coursesNeedingReview}
                valueStyle={{
                  color: coursesNeedingReview > 0 ? '#fa8c16' : '#3f8600',
                  fontSize: '1.5rem',
                }}
                prefix={<AuditOutlined />}
              />
              <div
                style={{
                  fontSize: '0.85rem',
                  color: '#8c8c8c',
                  marginTop: 4,
                }}
              >
                {coursesNeedingReview > 0
                  ? `${coursesNeedingReview} course${coursesNeedingReview > 1 ? 's' : ''} pending review`
                  : 'All courses have been reviewed'}
              </div>
            </Card>
          </Col>
        </Row>
      </Col>

      <Col span={24}>
        <Card title="Personal Information" bodyStyle={{ padding: '12px 16px' }}>
          <Descriptions
            column={{ xs: 1, sm: 2, md: 3 }}
            bordered
            size="small"
            labelStyle={{ fontWeight: 'bold' }}
          >
            <Descriptions.Item label="Full Name">
              {trainee.name}
            </Descriptions.Item>
            <Descriptions.Item label="Email">{trainee.email}</Descriptions.Item>
            <Descriptions.Item label="Department">
              {trainee.department}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              {getStatusTag(trainee.status)}
            </Descriptions.Item>
            <Descriptions.Item label="Joined Date">
              January 15, 2023
            </Descriptions.Item>
            <Descriptions.Item label="Employee ID">
              EMP-{trainee.id}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </Col>
    </Row>
  )
}

export default OverviewTab
