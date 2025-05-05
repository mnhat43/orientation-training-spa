import React from 'react'
import {
  Card,
  Button,
  Avatar,
  Typography,
  Divider,
  Space,
  Row,
  Col,
  Tag,
} from 'antd'
import {
  LeftOutlined,
  RightOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
  GiftOutlined,
  CheckCircleOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { DEPARTMENT_COLORS } from '@constants/userprofile'

const { Text, Title } = Typography

const ConfirmationCard = ({ trainee, setSelectedTrainee, onNext }) => {
  return (
    <div className="trainee-confirmation compact">
      <Card className="confirmation-card">
        <div className="confirmation-header">
          <div className="header-title">
            <CheckCircleOutlined className="confirmation-check-icon" />
            <Text strong>Confirm selection</Text>
          </div>
          <Button
            icon={<LeftOutlined />}
            onClick={() => setSelectedTrainee({})}
            type="text"
            size="small"
          >
            Back
          </Button>
        </div>

        <Divider style={{ margin: '12px 0 16px' }} />

        <div className="confirmation-content">
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={6} md={4} className="avatar-col">
              {trainee.avatar ? (
                <Avatar
                  size={80}
                  src={trainee.avatar}
                  className="trainee-avatar"
                />
              ) : (
                <Avatar
                  size={80}
                  icon={<UserOutlined />}
                  className="trainee-avatar"
                  style={{ backgroundColor: '#1890ff' }}
                />
              )}
            </Col>

            <Col xs={24} sm={18} md={14} className="info-col">
              <Title level={4} className="trainee-name">
                {trainee.fullname}
              </Title>

              <Space size={[0, 8]} wrap className="trainee-tags">
                <Tag color={DEPARTMENT_COLORS[trainee.department]}>
                  {trainee.department}
                </Tag>
                <Tag icon={<GiftOutlined />}>{trainee.birthday}</Tag>
                <Tag icon={<CalendarOutlined />}>{trainee.joinDate}</Tag>
              </Space>

              <div className="trainee-contact">
                <Text type="secondary">
                  <MailOutlined /> {trainee.email}
                </Text>
                <Text type="secondary" style={{ marginLeft: 16 }}>
                  <PhoneOutlined /> {trainee.phone}
                </Text>
              </div>
            </Col>

            <Col xs={24} sm={24} md={6} className="action-col">
              <Button
                type="primary"
                onClick={onNext}
                icon={<RightOutlined />}
                className="confirm-button"
              >
                Confirm
              </Button>
            </Col>
          </Row>
        </div>
      </Card>
    </div>
  )
}

export default ConfirmationCard
