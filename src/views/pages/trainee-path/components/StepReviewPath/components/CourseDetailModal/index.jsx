import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {
  Modal,
  Typography,
  Tag,
  Card,
  Steps,
  List,
  Divider,
  Row,
  Col,
  Statistic,
  Progress,
  Empty,
  Space,
} from 'antd'
import {
  ClockCircleOutlined,
  BookOutlined,
  TagOutlined,
  FileTextOutlined,
  PlayCircleOutlined,
  InfoCircleOutlined,
  AppstoreOutlined,
} from '@ant-design/icons'
import { CATEGORY_COLORS } from '@constants/categories'
import './index.scss'

const { Title, Text, Paragraph } = Typography

const CourseDetailModal = ({ visible, course, onClose }) => {
  const [activeModuleIndex, setActiveModuleIndex] = useState(0)

  // Generate sample modules if not provided
  const modules = course?.modules || [
    {
      id: 1,
      title: 'Introduction to the Course',
      position: 1,
      module_items: [
        {
          id: 1,
          title: 'Welcome Guide',
          item_type: 'file',
          position: 1,
          required_time: '15 min',
          resource: 'welcome.pdf',
        },
        {
          id: 2,
          title: 'Introduction Video',
          item_type: 'video',
          position: 2,
          required_time: '10 min',
          resource: 'intro.mp4',
        },
      ],
    },
    {
      id: 2,
      title: 'Core Concepts',
      position: 2,
      module_items: [
        {
          id: 3,
          title: 'Basic Principles',
          item_type: 'file',
          position: 1,
          required_time: '30 min',
          resource: 'principles.pdf',
        },
        {
          id: 4,
          title: 'Demonstration Video',
          item_type: 'video',
          position: 2,
          required_time: '20 min',
          resource: 'demo.mp4',
        },
      ],
    },
  ]

  // Get icon for item type
  const getItemTypeIcon = (type) => {
    switch (type) {
      case 'file':
        return <FileTextOutlined className="course-modal-item-icon file" />
      case 'video':
        return <PlayCircleOutlined className="course-modal-item-icon video" />
      default:
        return <InfoCircleOutlined className="course-modal-item-icon" />
    }
  }

  // Get color for item type
  const getItemTypeColor = (type) => {
    switch (type) {
      case 'file':
        return '#1890ff'
      case 'video':
        return '#52c41a'
      default:
        return '#722ed1'
    }
  }

  // Calculate course stats
  const getTotalItems = () => {
    return modules.reduce(
      (total, module) => total + module.module_items.length,
      0,
    )
  }

  const getTotalDuration = () => {
    let totalMinutes = 0
    modules.forEach((module) => {
      module.module_items.forEach((item) => {
        const timeStr = item.required_time
        const minutes = parseInt(timeStr?.split(' ')[0]) || 0
        totalMinutes += minutes
      })
    })
    return totalMinutes
  }

  // Get category color
  const getCategoryColor = () => {
    try {
      return CATEGORY_COLORS[course.category] || '#108ee9'
    } catch (error) {
      return '#108ee9'
    }
  }

  return (
    <Modal
      title={null}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      centered
      className="course-modal"
      styles={{ body: { padding: 0 } }}
    >
      {/* Course Header */}
      <div className="course-modal-header">
        <div className="course-modal-header-content">
          <div className="course-modal-header-category">
            <Tag color={getCategoryColor()} icon={<TagOutlined />}>
              {course.category}
            </Tag>
            <Tag icon={<ClockCircleOutlined />} color="#87d068">
              {course.duration}
            </Tag>
          </div>
          <Title level={4} className="course-modal-header-title">
            {course.name}
          </Title>
          <Paragraph className="course-modal-header-description">
            {course.description ||
              'This course provides comprehensive training on the subject matter.'}
          </Paragraph>
        </div>
      </div>

      {/* Course Content - Direct without tabs */}
      <div className="course-modal-content">
        <Row gutter={24} className="course-modal-container">
          {/* Left side: Module steps */}
          <Col xs={24} md={8}>
            <Card className="course-modal-overview-card">
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Statistic
                    title="Modules"
                    value={modules.length}
                    prefix={<BookOutlined />}
                    className="course-modal-stat"
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="Items"
                    value={getTotalItems()}
                    prefix={<AppstoreOutlined />}
                    className="course-modal-stat"
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="Minutes"
                    value={getTotalDuration()}
                    prefix={<ClockCircleOutlined />}
                    className="course-modal-stat"
                  />
                </Col>
              </Row>
            </Card>

            <Divider orientation="left">Course Modules</Divider>

            <Steps
              direction="vertical"
              size="small"
              current={activeModuleIndex}
              onChange={setActiveModuleIndex}
              className="course-modal-steps"
            >
              {modules.map((module, index) => (
                <Steps.Step
                  key={module.id}
                  title={module.title}
                  description={`${module.module_items.length} items`}
                  className="course-modal-step"
                />
              ))}
            </Steps>
          </Col>

          {/* Right side: Module content */}
          <Col xs={24} md={16}>
            {modules.length > 0 ? (
              <div className="course-modal-module-content">
                <div className="course-modal-module-header">
                  <Title level={5} className="course-modal-module-title">
                    {activeModuleIndex + 1}. {modules[activeModuleIndex].title}
                  </Title>
                  <Progress
                    percent={0}
                    size="small"
                    showInfo={false}
                    className="course-modal-module-progress"
                  />
                </div>

                <List
                  itemLayout="horizontal"
                  dataSource={modules[activeModuleIndex].module_items}
                  className="course-modal-items-list"
                  renderItem={(item, index) => (
                    <List.Item className="course-modal-item">
                      <div className="course-modal-item-number">
                        {index + 1}
                      </div>
                      <div className="course-modal-item-content">
                        <div className="course-modal-item-title-row">
                          <Space>
                            {getItemTypeIcon(item.item_type)}
                            <Text strong>{item.title}</Text>
                          </Space>
                          <Tag
                            color={getItemTypeColor(item.item_type)}
                            icon={<ClockCircleOutlined />}
                            className="course-modal-item-duration"
                          >
                            {item.required_time}
                          </Tag>
                        </div>
                        <div className="course-modal-item-resource">
                          <Text type="secondary">
                            Resource: {item.resource}
                          </Text>
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
              </div>
            ) : (
              <Empty description="No module content available" />
            )}
          </Col>
        </Row>
      </div>
    </Modal>
  )
}

CourseDetailModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  course: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    description: PropTypes.string,
    category: PropTypes.string,
    duration: PropTypes.string,
    modules: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        title: PropTypes.string,
        position: PropTypes.number,
        module_items: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            title: PropTypes.string,
            item_type: PropTypes.string,
            position: PropTypes.number,
            required_time: PropTypes.string,
            resource: PropTypes.string,
          }),
        ),
      }),
    ),
  }),
  onClose: PropTypes.func.isRequired,
}

export default CourseDetailModal
