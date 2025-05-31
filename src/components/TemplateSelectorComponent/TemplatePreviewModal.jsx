import React from 'react'
import {
  Modal,
  Button,
  Typography,
  Tag,
  List,
  Space,
  Badge,
  Tooltip,
} from 'antd'
import {
  FileTextOutlined,
  ClockCircleOutlined,
  CheckOutlined,
  BookOutlined,
} from '@ant-design/icons'
import { CATEGORY_COLORS } from '@constants'
import './TemplatePreviewModal.scss'

const { Text } = Typography

const TemplatePreviewModal = ({
  visible,
  template,
  onCancel,
  onApply,
  isSelected,
}) => {
  if (!template) return null

  const totalDuration = template.courses.reduce((sum, course) => {
    const durationMatch = course.duration?.match(/(\d+)/)
    return sum + (durationMatch ? parseInt(durationMatch[1], 10) : 0)
  }, 0)

  return (
    <Modal
      title={
        <div className="template-title">
          <FileTextOutlined className="title-icon" />
          <Tooltip title={template.title}>
            <div className="title-text">{template.title}</div>
          </Tooltip>
          {isSelected && (
            <Badge
              className="applied-badge"
              count="Applied"
              style={{ backgroundColor: '#52c41a' }}
            />
          )}
        </div>
      }
      open={visible}
      onCancel={onCancel}
      width={550}
      centered
      bodyStyle={{
        padding: '12px',
        maxHeight: '70vh',
        overflow: 'hidden',
      }}
      footer={[
        <Button key="cancel" size="middle" onClick={onCancel}>
          {' '}
          Cancel
        </Button>,
        isSelected ? (
          <Button
            key="applied"
            size="middle"
            type="primary"
            disabled
            style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
          >
            Already Applied
          </Button>
        ) : (
          <Button
            key="apply"
            size="middle"
            type="primary"
            onClick={() => onApply(template)}
            icon={<CheckOutlined />}
          >
            Apply
          </Button>
        ),
      ]}
      className="template-preview-modal-simple"
    >
      <div className="template-info">
        <div className="template-summary-compact">
          <div className="template-meta-row">
            <div className="meta-item category">
              <Tag color={CATEGORY_COLORS[template.category] || 'blue'}>
                {template.category}
              </Tag>
            </div>
            <span className="meta-dot"></span>
            <div className="meta-item">
              <BookOutlined className="meta-icon" />
              <span className="meta-text">
                {template.courses.length} courses
              </span>
            </div>
            <span className="meta-dot"></span>
            <div className="meta-item">
              <ClockCircleOutlined className="meta-icon" />
              <span className="meta-text">{totalDuration} hours</span>
            </div>
          </div>

          {template.description && (
            <Text
              type="secondary"
              className="compact-description"
              ellipsis={{ rows: 2, expandable: true, symbol: 'more' }}
            >
              {template.description}
            </Text>
          )}
        </div>

        <div className="course-list-container-compact">
          <List
            size="small"
            className="scrollable-course-list"
            itemLayout="horizontal"
            dataSource={template.courses}
            renderItem={(course, index) => (
              <List.Item key={course.id} className="course-item-compact">
                <span className="course-number">{index + 1}</span>
                <div className="course-content">
                  <div className="course-main-row">
                    <Text strong ellipsis={{ tooltip: course.title }}>
                      {course.title}
                    </Text>
                    <Space size={2} className="course-meta">
                      <Tag
                        size="small"
                        color={CATEGORY_COLORS[course.category]}
                      >
                        {course.category}
                      </Tag>
                      <Text type="secondary" className="duration">
                        <ClockCircleOutlined /> {course.duration}
                      </Text>
                    </Space>
                  </div>

                  {course.description && (
                    <Text type="secondary" className="course-desc" ellipsis>
                      {course.description}
                    </Text>
                  )}
                </div>
              </List.Item>
            )}
          />
        </div>
      </div>
    </Modal>
  )
}

export default TemplatePreviewModal
