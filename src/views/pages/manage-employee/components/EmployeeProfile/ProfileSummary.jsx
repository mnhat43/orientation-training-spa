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
    if (percent >= 80) return '#52c41a'
    if (percent >= 50) return '#1890ff'
    if (percent >= 30) return '#faad14'
    return '#ff4d4f'
  }

  return (
    <Card className="profile-card">
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
        <div className="section-header">
          <BookOutlined className="section-icon" />
          <Text strong className="section-title">
            Learning Progress
          </Text>
        </div>

        <Row
          gutter={[24, 24]}
          justify="center"
          align="middle"
          className="progress-content"
        >
          <Col xs={24} sm={16} md={14} className="progress-circle-col">
            <div className="progress-container">
              <Progress
                type="circle"
                percent={
                  +(
                    (processStats.completedCourses /
                      processStats.totalCourses) *
                    100
                  ).toFixed(2)
                }
                strokeColor={getProgressColor(processStats.percent)}
                strokeWidth={10}
                width={160}
                format={(percent) => (
                  <div className="progress-circle-content">
                    <span className="progress-percent">
                      {percent.toFixed(2)}%
                    </span>
                    <span className="progress-label">Completed</span>
                  </div>
                )}
                className="main-progress-circle"
              />
            </div>
          </Col>
          <Col xs={24} sm={8} md={10} className="progress-stats">
            <CheckCircleOutlined className="stat-icon" />
            <Statistic
              title="Courses Completed"
              value={processStats.completedCourses}
              suffix={`/${processStats.totalCourses}`}
              valueStyle={{ color: '#52c41a' }}
            />
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
            percent={+scorePercentage.toFixed(2)}
            width={100}
            format={(percent) => (
              <div className="score-circle-content">
                <span className="score-percent">{percent.toFixed(2)}%</span>
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
          {processStats.completedDate && (
            <div className="detail-item">
              <CheckCircleOutlined className="detail-icon" />
              <Text>Completed: {processStats.completedDate}</Text>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

export default ProfileSummary
