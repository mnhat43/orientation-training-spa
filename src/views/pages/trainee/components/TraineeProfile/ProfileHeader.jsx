import React from 'react'
import { Row, Col, Avatar, Typography, Space, Tag } from 'antd'
import {
  UserOutlined,
  MailOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  FileDoneOutlined,
} from '@ant-design/icons'

const { Title, Text } = Typography

const ProfileHeader = ({ trainee }) => {
  // Get status color and icon
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

  return (
    <div className="profile-header" style={{ marginBottom: 16 }}>
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} sm={5} md={4} lg={3}>
          <Avatar
            size={80}
            icon={<UserOutlined />}
            src={trainee.avatar}
            style={{
              backgroundColor: trainee.avatar ? undefined : '#1890ff',
            }}
          />
        </Col>
        <Col xs={24} sm={19} md={20} lg={21}>
          <Title level={3} style={{ marginBottom: 8, marginTop: 0 }}>
            {trainee.name}
          </Title>
          <Space wrap>
            <Text>
              <MailOutlined /> {trainee.email}
            </Text>
            <Text>
              <TeamOutlined /> {trainee.department}
            </Text>
            {getStatusTag(trainee.status)}
          </Space>
        </Col>
      </Row>
    </div>
  )
}

export default ProfileHeader
