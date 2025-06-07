import React from 'react'
import { Card, Avatar, Typography, Row, Col, Tag, Divider } from 'antd'
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  TeamOutlined,
  CalendarOutlined,
  IdcardOutlined,
} from '@ant-design/icons'
import DefaultAvatar from '@assets/images/default-avatar.svg'
import './ConfirmationCard.scss'

const { Title, Text } = Typography

const ConfirmationCard = ({ selectedTrainee }) => {
  const {
    avatar,
    fullname,
    email,
    phoneNumber,
    birthday,
    department,
    gender,
    joinedDate,
  } = selectedTrainee
  return (
    <Card
      className="trainee-confirmation-card"
      variant="borderless"
      size="small"
    >
      <Row gutter={[8, 8]} className="card-wrapper">
        <Col xs={24} sm={5} md={4} className="avatar-column">
          <div className="avatar-container">
            <Avatar
              size={100}
              icon={<UserOutlined />}
              src={avatar || DefaultAvatar}
              className="trainee-avatar"
            />
            <Title level={5} className="trainee-name">
              {fullname}
            </Title>
          </div>
        </Col>

        <Col xs={24} sm={19} md={20} className="info-column">
          <div className="info-section">
            <div className="section-header">
              <Text strong>Trainee Information</Text>
            </div>
            <Row gutter={[8, 8]} className="info-grid">
              <Col xs={24} sm={12} md={6}>
                <div className="info-item">
                  <MailOutlined className="info-icon" />
                  <div className="info-content">
                    <Text type="secondary" className="info-label">
                      Email
                    </Text>
                    <Text className="info-value">{email}</Text>
                  </div>
                </div>
              </Col>

              <Col xs={24} sm={12} md={6}>
                <div className="info-item">
                  <PhoneOutlined className="info-icon" />
                  <div className="info-content">
                    <Text type="secondary" className="info-label">
                      Phone
                    </Text>
                    <Text className="info-value">{phoneNumber}</Text>
                  </div>
                </div>
              </Col>

              <Col xs={24} sm={12} md={6}>
                <div className="info-item">
                  <IdcardOutlined className="info-icon" />
                  <div className="info-content">
                    <Text type="secondary" className="info-label">
                      Gender
                    </Text>
                    <Text className="info-value">{gender}</Text>
                  </div>
                </div>
              </Col>

              <Col xs={24} sm={12} md={6}>
                <div className="info-item">
                  <CalendarOutlined className="info-icon" />
                  <div className="info-content">
                    <Text type="secondary" className="info-label">
                      Birthday
                    </Text>
                    <Text className="info-value">{birthday}</Text>
                  </div>
                </div>
              </Col>
            </Row>
          </div>

          <div className="info-section">
            <div className="section-header">
              <Text strong>Employment Details</Text>
            </div>
            <Row gutter={[8, 8]} className="info-grid">
              <Col xs={24} sm={12} md={6}>
                <div className="info-item">
                  <TeamOutlined className="info-icon" />
                  <div className="info-content">
                    <Text type="secondary" className="info-label">
                      Department
                    </Text>
                    <Text className="info-value">{department}</Text>
                  </div>
                </div>
              </Col>

              <Col xs={24} sm={12} md={6}>
                <div className="info-item">
                  <CalendarOutlined className="info-icon" />
                  <div className="info-content">
                    <Text type="secondary" className="info-label">
                      Join Date
                    </Text>
                    <Text className="info-value">{joinedDate}</Text>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </Card>
  )
}

export default ConfirmationCard
