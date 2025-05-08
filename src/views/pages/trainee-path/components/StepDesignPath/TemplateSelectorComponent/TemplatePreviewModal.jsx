import React, { useState } from 'react'
import { Modal, Button, Typography, Tag, List, Badge, Tooltip } from 'antd'
import {
  ClockCircleOutlined,
  CheckOutlined,
  BookOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons'
import { CATEGORY_COLORS } from '@constants/categories'
import './TemplatePreviewModal.scss'
import CourseList from '@components/CourseList'

const { Text, Title, Paragraph } = Typography

const TemplatePreviewModal = ({ visible, template, onCancel, isSelected }) => {
  const [showDesc, setShowDesc] = useState(false)

  if (!template) return null

  // Calculate total duration
  const totalDuration = template.courses.reduce((sum, course) => {
    const durationMatch = course.duration?.match(/(\d+)/)
    return sum + (durationMatch ? parseInt(durationMatch[1], 10) : 0)
  }, 0)

  return (
    <Modal
      title={null}
      open={visible}
      onCancel={onCancel}
      width={650}
      centered
      styles={{
        body: { padding: 0, overflow: 'hidden', borderRadius: '6px' },
      }}
      footer={null}
      className="template-preview-modal-compact"
    >
      <div className="template-container">
        {/* Header */}
        <div className="template-header-redesign">
          <div className="header-top">
            <div className="title-section">
              <Title level={4} className="template-title">
                {template.title}
              </Title>
              {isSelected && (
                <Badge
                  count="Applied"
                  style={{ backgroundColor: '#52c41a' }}
                  className="applied-badge"
                />
              )}
            </div>
            <div className="stats-section">
              <div className="stat-item">
                <BookOutlined className="stat-icon" />
                <span className="stat-value">{template.courses.length}</span>
                <span className="stat-label">Courses</span>
              </div>
              <div className="stat-item">
                <ClockCircleOutlined className="stat-icon" />
                <span className="stat-value">{totalDuration}</span>
                <span className="stat-label">Hours</span>
              </div>
            </div>
          </div>

          {template.description && (
            <div className="description-section">
              <div className="description-header">
                <InfoCircleOutlined className="description-icon" />
                <Text className="description-label">Overview</Text>
              </div>
              <div className="description-content">
                <Paragraph className="template-description">
                  {template.description}
                </Paragraph>
              </div>
            </div>
          )}
        </div>

        <div className="courses-section">
          <div className="section-title">
            <BookOutlined /> Courses
          </div>

          <div className="course-list">
            <CourseList courses={template.courses} />
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default TemplatePreviewModal
