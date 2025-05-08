import React from 'react'
import PropTypes from 'prop-types'
import {
  Card,
  Typography,
  Button,
  Avatar,
  Divider,
  Tooltip,
  Row,
  Col,
} from 'antd'
import {
  SendOutlined,
  ClockCircleOutlined,
  BookOutlined,
  CheckCircleOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
  TeamOutlined,
  ManOutlined,
  WomanOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons'
import './index.scss'

const { Text } = Typography

const AssignmentDetails = ({
  trainee,
  coursesCount,
  totalDuration,
  onSubmitPath,
  submitting,
  onPrev,
}) => {
  if (!trainee) return null

  const getInitials = () => {
    const name = trainee.fullname || trainee.name
    if (!name) return ''
    const parts = name.split(' ')
    if (parts.length === 1) return parts[0][0].toUpperCase()
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
  }

  const getGenderIcon = () => {
    if (!trainee.gender) return null
    const gender = trainee.gender.toLowerCase()
    return gender === 'male' ? (
      <ManOutlined className="enhanced-assignment-icon male" />
    ) : gender === 'female' ? (
      <WomanOutlined className="enhanced-assignment-icon female" />
    ) : null
  }

  return (
    <Card className="enhanced-assignment-card">
      {/* Trainee header with profile */}
      <div className="enhanced-assignment-profile">
        <Avatar
          size={60}
          src={trainee.avatar}
          className="enhanced-assignment-avatar"
        >
          {!trainee.avatar && getInitials()}
        </Avatar>

        <div className="enhanced-assignment-trainee-info">
          <Text strong className="enhanced-assignment-name">
            {trainee.fullname}
          </Text>

          {trainee.department && (
            <div className="enhanced-assignment-department">
              <TeamOutlined className="enhanced-assignment-department-icon" />
              <Text>{trainee.department}</Text>
            </div>
          )}
        </div>
      </div>

      {/* Trainee details section */}
      <div className="enhanced-assignment-details">
        <Row gutter={[16, 8]}>
          {trainee.email && (
            <Col span={24}>
              <div className="enhanced-assignment-detail-item">
                <MailOutlined className="enhanced-assignment-icon primary" />
                <Tooltip title="Email">
                  <Text className="enhanced-assignment-detail-value">
                    {trainee.email}
                  </Text>
                </Tooltip>
              </div>
            </Col>
          )}

          {trainee.phone && (
            <Col span={trainee.birthday || trainee.gender ? 12 : 24}>
              <div className="enhanced-assignment-detail-item">
                <PhoneOutlined className="enhanced-assignment-icon primary" />
                <Text className="enhanced-assignment-detail-value">
                  {trainee.phone}
                </Text>
              </div>
            </Col>
          )}

          {trainee.gender && (
            <Col span={12}>
              <div className="enhanced-assignment-detail-item">
                {getGenderIcon()}
                <Text className="enhanced-assignment-detail-value">
                  {trainee.gender}
                </Text>
              </div>
            </Col>
          )}

          {trainee.birthday && (
            <Col span={trainee.phone ? 12 : 24}>
              <div className="enhanced-assignment-detail-item">
                <CalendarOutlined className="enhanced-assignment-icon primary" />
                <Text className="enhanced-assignment-detail-value">
                  {trainee.birthday}
                </Text>
              </div>
            </Col>
          )}

          {trainee.joinedDate && (
            <Col span={24}>
              <div className="enhanced-assignment-detail-item">
                <CalendarOutlined className="enhanced-assignment-icon secondary" />
                <Text className="enhanced-assignment-detail-value">
                  Joined: {trainee.joinedDate}
                </Text>
              </div>
            </Col>
          )}
        </Row>
      </div>

      <Divider className="enhanced-assignment-divider" />

      {/* Status and action section */}
      <div className="enhanced-assignment-status">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={onPrev}
          className="back-btn"
          size="middle"
          block
        >
          Back to Design
        </Button>
        <Button
          type="primary"
          icon={<SendOutlined />}
          loading={submitting}
          onClick={onSubmitPath}
          className="enhanced-assignment-button"
          size="middle"
          block
        >
          Assign Learning Path
        </Button>
      </div>
    </Card>
  )
}

AssignmentDetails.propTypes = {
  trainee: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    fullname: PropTypes.string,
    department: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    avatar: PropTypes.string,
    gender: PropTypes.string,
    birthday: PropTypes.string,
    joinedDate: PropTypes.string,
  }),
  coursesCount: PropTypes.number.isRequired,
  totalDuration: PropTypes.string.isRequired,
  onSubmitPath: PropTypes.func.isRequired,
  submitting: PropTypes.bool,
}

export default AssignmentDetails
