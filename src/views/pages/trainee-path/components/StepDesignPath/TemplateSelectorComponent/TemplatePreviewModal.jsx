import React, { useEffect } from 'react'
import { Modal, Typography, Badge, Spin, Empty, Row, Col } from 'antd'
import {
  ClockCircleOutlined,
  BookOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons'
import './TemplatePreviewModal.scss'
import CourseList from '@components/CourseList'

const { Title, Paragraph } = Typography

const TemplatePreviewModal = ({
  visible,
  template,
  onCancel,
  isSelected,
  formatTime,
  loading,
}) => {
  if (!template) return null

  const hasDetailedData = !!template.course_list

  return (
    <Modal
      title={null}
      open={visible}
      onCancel={onCancel}
      width={550}
      centered
      footer={null}
      className="template-preview-modal"
    >
      {loading ? (
        <div className="loading-container">
          <Spin size="large" />
          <div style={{ marginTop: '16px' }}>Loading template details...</div>
        </div>
      ) : (
        <>
          <div className="template-content">
            <div className="template-title">
              <Title
                level={4}
                className="template-title"
                style={{ margin: '0 0 4px 0' }}
              >
                {template.name}
              </Title>
              {isSelected && (
                <Badge
                  count="Applied"
                  style={{ backgroundColor: '#52c41a' }}
                  className="applied-badge"
                />
              )}
            </div>

            <div className="template-detail">
              <Row gutter={24}>
                <Col span={18} className="overview-section">
                  <div className="overview-title">
                    <InfoCircleOutlined /> Overview
                  </div>
                  <Paragraph className="description-content">
                    {template.description
                      ? template.description
                      : 'No description provided.'}
                  </Paragraph>
                </Col>
                <Col span={6} className="meta-info">
                  <div className="meta-item">
                    <BookOutlined />
                    <span className="meta-text">
                      {template.course_ids.length} Courses
                    </span>
                  </div>

                  <div className="meta-item">
                    <ClockCircleOutlined />
                    <span className="meta-text">
                      {formatTime(template.duration)}
                    </span>
                  </div>
                </Col>
              </Row>
            </div>
          </div>

          <div className="courses-content">
            <div className="courses-header">
              <BookOutlined /> Courses
            </div>

            <div className="scrollable-course-list">
              {hasDetailedData ? (
                <CourseList courses={template.course_list} />
              ) : (
                <Empty
                  description="No courses in this template"
                  className="empty-course-message"
                />
              )}
            </div>
          </div>
        </>
      )}
    </Modal>
  )
}

export default TemplatePreviewModal
