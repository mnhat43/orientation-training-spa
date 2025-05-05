import React from 'react'
import { Button, Tooltip, Tag, Divider, Typography, Space } from 'antd'
import {
  MenuOutlined,
  DeleteOutlined,
  BookOutlined,
  InfoCircleOutlined,
  CarryOutOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons'
import { CATEGORY_COLORS } from '@constants/categories'

const { Paragraph } = Typography

const CourseItem = ({
  course,
  index,
  isDragging,
  expandedItems,
  toggleExpand,
  onRemove,
  dragHandleProps,
  courseCount,
  readOnly = false,
}) => {
  const isExpanded = expandedItems.includes(course.id)

  return (
    <div
      className={`course-item ${isDragging ? 'dragging' : ''} ${isExpanded ? 'expanded' : ''}`}
    >
      <div className="course-number">{index + 1}</div>

      <div className="course-content">
        <div className="course-header">
          <div className="course-title">
            <BookOutlined style={{ color: '#1890ff', marginRight: '8px' }} />
            <span className="course-name">{course.title || course.name}</span>
          </div>

          <div className="course-actions">
            {!readOnly && (
              <Tooltip title="Drag to reorder">
                <div className="drag-handle" {...dragHandleProps}>
                  <MenuOutlined />
                </div>
              </Tooltip>
            )}

            <Tooltip title="View details">
              <Button
                type="text"
                size="small"
                icon={<InfoCircleOutlined />}
                onClick={(e) => {
                  e.stopPropagation()
                  toggleExpand(course.id)
                }}
                className="expand-button"
              />
            </Tooltip>

            {!readOnly && (
              <Tooltip title="Remove course">
                <Button
                  type="text"
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={(e) => {
                    e.stopPropagation()
                    onRemove(course.id)
                  }}
                  danger
                  className="remove-button"
                />
              </Tooltip>
            )}
          </div>
        </div>

        <div className="course-details">
          <div className="course-tags">
            {course.category && (
              <Tag color={CATEGORY_COLORS[course.category] || 'default'}>
                {course.category}
              </Tag>
            )}
            {course.duration && (
              <Tag className="duration-tag">
                <ClockCircleOutlined style={{ marginRight: 4 }} />
                {course.duration}
              </Tag>
            )}
          </div>
        </div>

        {isExpanded && (
          <div className="course-expanded-content">
            <Divider style={{ margin: '12px 0 8px' }} />

            {course.description && (
              <Paragraph type="secondary" style={{ marginBottom: 8 }}>
                {course.description}
              </Paragraph>
            )}

            <Space size="middle">
              <Tag icon={<CarryOutOutlined />}>
                Position: {index + 1} of {courseCount}
              </Tag>
            </Space>
          </div>
        )}
      </div>
    </div>
  )
}

export default React.memo(CourseItem)
