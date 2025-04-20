import React from 'react'
import { Card, Button, Tooltip, Tag } from 'antd'
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  BookOutlined,
  TagOutlined,
} from '@ant-design/icons'
import PropTypes from 'prop-types'
import './index.scss'

const CourseCard = ({
  CourseID,
  Title,
  Thumbnail,
  Description,
  Category,
  onDelete,
  onEdit,
  onClick,
}) => {
  // Map course ID to a default category if none is provided
  const defaultCategories = [
    // 'Onboarding',
    'Technical Skills',
    'Company Policies',
    'Technical Skills',
    'Technical Skills',
    // 'Soft Skills',
  ]
  const displayCategory =
    Category || defaultCategories[CourseID % defaultCategories.length]

  // Category color mapping
  const categoryColors = {
    Onboarding: 'blue',
    'Company Policies': 'red',
    'Technical Skills': 'green',
    'Soft Skills': 'purple',
    Compliance: 'orange',
  }

  const categoryColor = categoryColors[displayCategory] || 'default'

  return (
    <Card
      hoverable
      className="course-card"
      cover={
        <div className="thumbnail-container">
          <img
            alt={Title}
            src={
              Thumbnail
                ? `data:image/png;base64,${Thumbnail}`
                : '/default-course-image.png'
            }
            className="thumbnail-image"
          />
          <div className="course-badge">Training Course</div>
          <div className="view-course-overlay">
            <Button
              icon={<EyeOutlined />}
              className="view-button"
              onClick={onClick}
            >
              View Modules
            </Button>
          </div>
        </div>
      }
      onClick={onClick}
      actions={[
        <Tooltip key="edit" title="Edit Course">
          <Button
            type="text"
            icon={<EditOutlined />}
            className="action-button edit-button"
            onClick={(e) => {
              e.stopPropagation()
              onEdit(CourseID)
            }}
            aria-label="Edit course"
          />
        </Tooltip>,
        <Tooltip key="delete" title="Delete Course">
          <Button
            type="text"
            icon={<DeleteOutlined />}
            className="action-button delete-button"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(CourseID)
            }}
            aria-label="Delete course"
          />
        </Tooltip>,
      ]}
    >
      <div className="course-category">
        <Tag color={categoryColor} icon={<TagOutlined />}>
          {displayCategory}
        </Tag>
      </div>
      <div className="course-title">{Title}</div>
      <div className="course-description">
        {Description || 'No description available'}
      </div>
    </Card>
  )
}

CourseCard.propTypes = {
  CourseID: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  Title: PropTypes.string.isRequired,
  Thumbnail: PropTypes.string,
  Description: PropTypes.string,
  Category: PropTypes.string,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
}

export default CourseCard
