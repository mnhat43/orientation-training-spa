import React from 'react'
import {
  Card,
  Avatar,
  Typography,
  Divider,
  Row,
  Col,
  Space,
  Tag,
  Tooltip,
  Statistic,
  Rate,
} from 'antd'
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  TeamOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  FieldTimeOutlined,
  TrophyOutlined,
  StarFilled,
  InfoCircleOutlined,
} from '@ant-design/icons'
import './ProfileSummary.scss'

const { Title, Text } = Typography

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

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return '#52c41a' // Excellent - Green
    if (rating >= 3.5) return '#1890ff' // Good - Blue
    if (rating >= 2.5) return '#faad14' // Average - Yellow
    return '#ff4d4f' // Needs improvement - Red
  }

  return (
    <Card
      className="profile-card"
      bordered={false}
      style={{
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      }}
    >
      <div className="profile-header">
        <div className="profile-avatar-container">
          <Avatar
            size={100}
            src={userInfo.avatar}
            icon={!userInfo.avatar && <UserOutlined />}
            className="profile-avatar"
            style={{ border: '4px solid #f0f2f5' }}
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
          <Space size={8} align="center" wrap>
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

      <Divider style={{ margin: '24px 0 16px' }} />

      {/* Contact Section - Moved to top */}
      <div className="contact-section">
        <div className="section-header">
          <UserOutlined className="section-icon" />
          <Text strong className="section-title">
            Contact Information
          </Text>
        </div>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <div className="detail-item">
              <MailOutlined className="detail-icon" />
              <Text ellipsis={{ tooltip: userInfo.email }}>
                {userInfo.email || 'No email provided'}
              </Text>
            </div>
          </Col>
          <Col xs={24} sm={12}>
            <div className="detail-item">
              <PhoneOutlined className="detail-icon" />
              <Text>{userInfo.phone_number || 'No phone provided'}</Text>
            </div>
          </Col>
          <Col xs={24} sm={12}>
            <div className="detail-item">
              <CalendarOutlined className="detail-icon" />
              <Text>Joined: {userInfo.joinedDate || 'Not available'}</Text>
            </div>
          </Col>
          <Col xs={24} sm={12}>
            {processStats.completedDate ? (
              <div className="detail-item">
                <CheckCircleOutlined
                  className="detail-icon"
                  style={{ color: '#52c41a' }}
                />
                <Text>Completed: {processStats.completedDate}</Text>
              </div>
            ) : (
              <div className="detail-item">
                <FieldTimeOutlined
                  className="detail-icon"
                  style={{ color: '#1890ff' }}
                />
                <Text>In progress</Text>
              </div>
            )}
          </Col>
        </Row>
      </div>

      <Divider style={{ margin: '24px 0 16px' }} />

      {/* Performance Section - Modified to use single row per metric */}
      <div
        className="performance-section"
        style={{
          backgroundColor: '#f9fafc',
          borderRadius: '8px',
          padding: '16px',
        }}
      >
        <div className="section-header">
          <TrophyOutlined className="section-icon" />
          <Text strong className="section-title">
            Performance Metrics
          </Text>
        </div>

        <Row gutter={[0, 16]}>
          {/* Rating display */}
          <Col xs={24}>
            <div className="metric-box">
              <Tooltip title="Average rating based on course completions and assessments">
                <div className="metric-header">
                  <StarFilled
                    style={{
                      color: getRatingColor(
                        processStats.averagePerformanceRating,
                      ),
                    }}
                  />
                  <span style={{ marginLeft: '8px' }}>Performance Rating</span>
                  <InfoCircleOutlined className="info-icon" />
                </div>
              </Tooltip>
              <Row align="middle" gutter={16} wrap={false}>
                <Col>
                  <div className="metric-value">
                    <span
                      style={{
                        fontSize: '28px',
                        fontWeight: 'bold',
                        color: getRatingColor(
                          processStats.averagePerformanceRating,
                        ),
                      }}
                    >
                      {processStats.averagePerformanceRating?.toFixed(1) ||
                        'N/A'}
                    </span>
                    <span className="metric-suffix">/5.0</span>
                  </div>
                </Col>
                <Col style={{ marginLeft: '16px' }}>
                  <Rate
                    disabled
                    allowHalf
                    value={processStats.averagePerformanceRating}
                    style={{ fontSize: '16px' }}
                  />
                </Col>
              </Row>
            </div>
          </Col>

          {/* Score display */}
          <Col xs={24}>
            <div className="metric-box">
              <Tooltip title="Score achieved out of the total possible score">
                <div className="metric-header">
                  <TrophyOutlined
                    style={{
                      color: getProgressColor(scorePercentage),
                    }}
                  />
                  <span style={{ marginLeft: '8px' }}>Overall Score</span>
                  <InfoCircleOutlined className="info-icon" />
                </div>
              </Tooltip>
              <Row align="middle" gutter={16} wrap={false}>
                <Col>
                  <div className="metric-value">
                    <span
                      style={{
                        fontSize: '28px',
                        fontWeight: 'bold',
                        color: getProgressColor(scorePercentage),
                      }}
                    >
                      {processStats.userScore}
                    </span>
                    <span className="metric-suffix">
                      /{processStats.totalScore}
                    </span>
                  </div>
                </Col>
                <Col style={{ marginLeft: '16px' }}>
                  <Tag
                    color={getProgressColor(scorePercentage)}
                    style={{
                      fontSize: '14px',
                      padding: '4px 10px',
                      margin: '0',
                    }}
                  >
                    {scorePercentage}% of Total
                  </Tag>
                </Col>
              </Row>
            </div>
          </Col>

          {/* Course Completion */}
          <Col xs={24}>
            <div className="metric-box">
              <Tooltip title="Number of courses completed out of the total required courses">
                <div className="metric-header">
                  <CheckCircleOutlined
                    style={{
                      color: getProgressColor(processStats.percent || 0),
                    }}
                  />
                  <span style={{ marginLeft: '8px' }}>Course Completion</span>
                  <InfoCircleOutlined className="info-icon" />
                </div>
              </Tooltip>
              <Row align="middle" gutter={16} wrap={false}>
                <Col>
                  <div className="metric-value">
                    <span
                      style={{
                        fontSize: '28px',
                        fontWeight: 'bold',
                        color: getProgressColor(processStats.percent || 0),
                      }}
                    >
                      {processStats.completedCourses}
                    </span>
                    <span className="metric-suffix">
                      /{processStats.totalCourses} courses
                    </span>
                  </div>
                </Col>
                <Col style={{ marginLeft: '16px' }}>
                  {processStats.percent && (
                    <Tag
                      color={getProgressColor(processStats.percent)}
                      style={{
                        fontSize: '14px',
                        padding: '4px 10px',
                        margin: '0',
                      }}
                    >
                      {processStats.percent}% Complete
                    </Tag>
                  )}
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </div>
    </Card>
  )
}

export default ProfileSummary
