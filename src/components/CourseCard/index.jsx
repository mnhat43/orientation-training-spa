import React from 'react'
import { Card, Button, Typography, Popconfirm, Tooltip, Tag } from 'antd'
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  TagOutlined,
  BookOutlined,
} from '@ant-design/icons'
import { CATEGORIES, CATEGORY_COLORS } from '@constants/categories'
import './index.scss'

const { Meta } = Card
const { Paragraph } = Typography

const CourseCard = ({
  CourseID,
  Title,
  Thumbnail,
  Description,
  Category,
  onDelete,
  onEdit,
  onClick,
  onEnroll,
}) => {
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
        <Tooltip title="Add to training path" key="add-to-path">
          <Button
            type="text"
            icon={<BookOutlined />}
            className="action-button"
            onClick={(e) => {
              e.stopPropagation()
              onEnroll && onEnroll()
            }}
          />
        </Tooltip>,
        <Popconfirm
          key="delete"
          title="Delete this course?"
          description="Are you sure you want to delete this course and all its contents?"
          onConfirm={(e) => {
            e.stopPropagation()
            onDelete(CourseID)
          }}
          okText="Yes"
          cancelText="No"
          placement="left"
        >
          <Button
            danger
            type="text"
            className="action-button"
            icon={<DeleteOutlined />}
            onClick={(e) => e.stopPropagation()}
          />
        </Popconfirm>,
      ]}
    >
      <div className="course-category">
        <Tag color={CATEGORY_COLORS[Category]} icon={<TagOutlined />}>
          {CATEGORIES[Category]}
        </Tag>
      </div>
      <Meta
        title={Title}
        description={
          <Paragraph
            ellipsis={{
              rows: 2,
              expandable: false,
              symbol: '...',
              tooltip: true,
            }}
            className="course-description"
          >
            {Description || 'No description available'}
          </Paragraph>
        }
      />
    </Card>
  )
}

export default CourseCard
