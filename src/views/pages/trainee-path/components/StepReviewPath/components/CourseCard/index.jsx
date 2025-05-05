import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Card, Typography, Tag, Tooltip } from 'antd'
import {
  ClockCircleOutlined,
  TagOutlined,
  EyeOutlined,
} from '@ant-design/icons'
import CourseDetailModal from '../CourseDetailModal'
import { CATEGORIES, CATEGORY_COLORS } from '@constants/categories'
import './index.scss'

const { Text } = Typography

const CourseCard = ({ course, index }) => {
  const [modalVisible, setModalVisible] = useState(false)
  const courseName = course.name || course.title || 'Unnamed Course'

  const getCategoryColor = () => {
    try {
      return CATEGORY_COLORS[course.category] || '#108ee9'
    } catch (error) {
      return '#108ee9'
    }
  }

  return (
    <>
      <Card className="compact-course-card" bordered={false} size="small">
        <div className="compact-course-card-content">
          {/* Title with course number */}
          <div className="compact-course-card-title-row">
            <Text
              strong
              className="compact-course-card-title"
              title={courseName}
            >
              {index + 1}. {courseName}
            </Text>

            <Tooltip title="View course details">
              <EyeOutlined
                className="compact-course-card-view-icon"
                onClick={() => setModalVisible(true)}
              />
            </Tooltip>
          </div>

          {/* Meta information row */}
          <div className="compact-course-card-meta">
            <Tag
              color={getCategoryColor()}
              icon={<TagOutlined />}
              className="compact-course-card-tag"
            >
              {course.category}
            </Tag>

            <Tag
              color="#87d068"
              icon={<ClockCircleOutlined />}
              className="compact-course-card-tag"
            >
              {course.duration}
            </Tag>
          </div>

          {/* Description - only shows if it exists */}
          {course.description && (
            <Text
              ellipsis={{ tooltip: course.description }}
              className="compact-course-card-description"
              type="secondary"
            >
              {course.description}
            </Text>
          )}
        </div>
      </Card>

      <CourseDetailModal
        visible={modalVisible}
        course={{ ...course, name: courseName }}
        onClose={() => setModalVisible(false)}
      />
    </>
  )
}

CourseCard.propTypes = {
  course: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    category: PropTypes.string,
    duration: PropTypes.string,
  }).isRequired,
  index: PropTypes.number.isRequired,
}

export default CourseCard
