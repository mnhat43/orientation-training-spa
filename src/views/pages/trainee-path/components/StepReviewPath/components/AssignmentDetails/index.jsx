import React from 'react'
import { Typography, Button, Avatar, Row, Col, Tag, Divider, Card } from 'antd'
import {
  SendOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
  TeamOutlined,
  UserOutlined,
  ArrowLeftOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons'
import './index.scss'

const { Title, Text, Paragraph } = Typography

const AssignmentDetails = ({ trainee, onSubmitPath, submitting, onPrev }) => {
  if (!trainee) return null

  const getInitials = () => {
    const name = trainee.fullname
    if (!name) return ''
    const parts = name.split(' ')
    if (parts.length === 1) return parts[0][0].toUpperCase()
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return dateString

    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date)
  }

  return (
    <div className="trainee-card-container">
      <Card className="trainee-info-card">
        <div className="card-header">
          <div className="avatar-wrapper">
            <Avatar
              size={80}
              src={trainee.avatar}
              icon={!trainee.avatar && <UserOutlined />}
              className="trainee-avatar"
            >
              {!trainee.avatar && getInitials()}
            </Avatar>
            {trainee.gender && (
              <div
                className={`gender-indicator ${trainee.gender.toLowerCase()}`}
              >
                {trainee.gender === 'Male' ? '♂' : '♀'}
              </div>
            )}
          </div>

          <div className="trainee-header-info">
            <Title level={3} className="trainee-name">
              {trainee.fullname}
            </Title>
            {trainee.department && (
              <Tag
                color="processing"
                icon={<TeamOutlined />}
                className="department-tag"
              >
                {trainee.department}
              </Tag>
            )}
          </div>
        </div>

        <Divider className="custom-divider" />

        <div className="trainee-details">
          <Row gutter={[0, 16]}>
            <Col xs={24}>
              <div className="detail-item">
                <div className="detail-icon">
                  <MailOutlined />
                </div>
                <div className="detail-content">
                  <Text type="secondary">Email</Text>
                  <Paragraph ellipsis={{ rows: 1 }} className="detail-value">
                    {trainee.email || 'Not provided'}
                  </Paragraph>
                </div>
              </div>
            </Col>

            <Col xs={24}>
              <div className="detail-item">
                <div className="detail-icon">
                  <PhoneOutlined />
                </div>
                <div className="detail-content">
                  <Text type="secondary">Phone Number</Text>
                  <Text className="detail-value">
                    {trainee.phoneNumber || 'Not provided'}
                  </Text>
                </div>
              </div>
            </Col>

            <Col xs={24}>
              <div className="detail-item">
                <div className="detail-icon">
                  <ClockCircleOutlined />
                </div>
                <div className="detail-content">
                  <Text type="secondary">Joined Date</Text>
                  <Text className="detail-value">
                    {trainee.joinedDate
                      ? formatDate(trainee.joinedDate)
                      : 'Not provided'}
                  </Text>
                </div>
              </div>
            </Col>

            <Col xs={24}>
              <div className="detail-item">
                <div className="detail-icon">
                  <CalendarOutlined />
                </div>
                <div className="detail-content">
                  <Text type="secondary">Birthday</Text>
                  <Text className="detail-value">
                    {trainee.birthday
                      ? formatDate(trainee.birthday)
                      : 'Not provided'}
                  </Text>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </Card>
    </div>
  )
}

export default AssignmentDetails
