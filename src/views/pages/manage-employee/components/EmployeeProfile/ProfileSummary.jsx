import React from 'react'
import {
  Card,
  Avatar,
  Typography,
  Divider,
  Progress,
  Row,
  Col,
  Statistic,
  Space,
  Tag,
} from 'antd'
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  TeamOutlined,
  CalendarOutlined,
  TrophyOutlined,
  BookOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  BarChartOutlined,
  FieldTimeOutlined,
} from '@ant-design/icons'
import './ProfileSummary.scss'

const { Title, Text, Paragraph } = Typography

const ProfileSummary = ({ userInfo, processStats }) => {
  const calculateScorePercentage = () => {
    if (!processStats || processStats.totalScore === 0) return 0
    return Math.round((processStats.userScore / processStats.totalScore) * 100)
  }

  const scorePercentage = calculateScorePercentage()

  const getProgressColor = (percent) => {
    if (percent >= 80) return '#52c41a' // Success green
    if (percent >= 50) return '#1890ff' // Info blue
    if (percent >= 30) return '#faad14' // Warning yellow
    return '#ff4d4f'
  }

  return (
    <Card className="profile-card" bordered={false}>
      <div className="profile-header">
        <div className="profile-avatar-container">
          <Avatar
            size={100}
            src={userInfo.avatar}
            icon={!userInfo.avatar && <UserOutlined />}
            className="profile-avatar"
          />
          {processStats.percent === 100 && (
            <div className="avatar-badge">
              <CheckCircleOutlined />
            </div>
          )}
        </div>

        <div className="profile-info">
          <Title level={3} className="username">
            {userInfo.fullname || 'N/A'}
          </Title>
          <Space size={8} align="center">
            <Tag color="blue" icon={<TeamOutlined />}>
              {userInfo.department || 'No Department'}
            </Tag>
            {processStats.percent === 100 ? (
              <Tag color="success" icon={<CheckCircleOutlined />}>
                Completed
              </Tag>
            ) : (
              <Tag color="processing" icon={<FieldTimeOutlined />}>
                In Progress
              </Tag>
            )}
          </Space>
        </div>
      </div>

      <div className="progress-section">
        <Row gutter={[0, 24]} justify="center" align="middle">
          <Col span={24}>
            <div className="progress-container">
              <div className="progress-header">
                <Text strong className="section-title">
                  <BookOutlined /> Learning Progress
                </Text>
                <Text className="progress-percentage">
                  {processStats.percent}%
                </Text>
              </div>
              <Progress
                percent={processStats.percent}
                showInfo={false}
                strokeColor={getProgressColor(processStats.percent)}
                strokeWidth={8}
                className="main-progress-bar"
              />
            </div>
          </Col>
        </Row>

        <Row gutter={[16, 16]} className="stats-row">
          <Col span={8}>
            <div className="stat-card completed">
              <CheckCircleOutlined className="stat-icon" />
              <Statistic
                title="Completed"
                value={processStats.completedCourses}
                suffix={`/${processStats.completedCourses + processStats.inProgressCourses + processStats.pendingProgress}`}
                valueStyle={{ color: '#52c41a' }}
              />
            </div>
          </Col>
          <Col span={8}>
            <div className="stat-card in-progress">
              <BarChartOutlined className="stat-icon" />
              <Statistic
                title="In Progress"
                value={processStats.inProgressCourses}
                valueStyle={{ color: '#1890ff' }}
              />
            </div>
          </Col>
          <Col span={8}>
            <div className="stat-card pending">
              <ClockCircleOutlined className="stat-icon" />
              <Statistic
                title="Pending"
                value={processStats.pendingProgress}
                valueStyle={{ color: '#faad14' }}
              />
            </div>
          </Col>
        </Row>
      </div>

      <Divider style={{ margin: '24px 0 16px' }} />

      <div className="performance-section">
        <div className="section-header">
          <TrophyOutlined className="section-icon" />
          <Text strong className="section-title">
            Performance
          </Text>
        </div>

        <div className="score-display">
          <Progress
            type="circle"
            percent={scorePercentage}
            width={100}
            format={(percent) => (
              <div className="score-circle-content">
                <span className="score-percent">{percent}%</span>
                <span className="score-label">Score</span>
              </div>
            )}
            strokeColor={getProgressColor(scorePercentage)}
            className="score-circle"
          />
          <div className="score-details">
            <div className="score-breakdown">
              <div className="score-fraction">
                <Text strong className="current-score">
                  {processStats.userScore}
                </Text>
                <Text type="secondary" className="total-score">
                  / {processStats.totalScore}
                </Text>
              </div>
              <Paragraph type="secondary" className="score-description">
                This score is based on the student's performance across all
                completed courses.
              </Paragraph>
            </div>
          </div>
        </div>
      </div>

      <Divider style={{ margin: '24px 0 16px' }} />

      <div className="contact-section">
        <div className="section-header">
          <UserOutlined className="section-icon" />
          <Text strong className="section-title">
            Contact Information
          </Text>
        </div>

        <div className="contact-details">
          <div className="detail-item">
            <MailOutlined className="detail-icon" />
            <Text>{userInfo.email || 'No email provided'}</Text>
          </div>
          <div className="detail-item">
            <PhoneOutlined className="detail-icon" />
            <Text>{userInfo.phone_number || 'No phone provided'}</Text>
          </div>
          <div className="detail-item">
            <CalendarOutlined className="detail-icon" />
            <Text>Joined: {userInfo.joinedDate || 'Not available'}</Text>
          </div>
          {userInfo.completionDate && (
            <div className="detail-item">
              <CheckCircleOutlined className="detail-icon" />
              <Text>Completed: {userInfo.completionDate}</Text>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

export default ProfileSummary
