import React, { useState } from 'react'
import { List, Card, Badge, Typography, Tag, Button, Tooltip } from 'antd'
import { ClockCircleOutlined, EyeOutlined } from '@ant-design/icons'
import { formatTime } from '@helpers/common'
import './index.scss'
import { CATEGORIES, CATEGORY_COLORS } from '@constants/categories'
import CourseDetailModal from './CourseDetailModal'
import apiCourse from '@api/course'

const { Text, Paragraph } = Typography

const CourseList = ({ courses }) => {
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  const showCourseDetail = (course) => {
    setLoading(true)

    // Fetch detailed course information
    apiCourse
      .getCourseDetail({ course_id: course.id })
      .then((response) => {
        if (response && response.status === 1 && response.data) {
          setSelectedCourse(response.data)
          setDetailModalVisible(true)
        } else {
          console.error(
            'Failed to load course details:',
            response?.message || 'Unknown error',
          )
          // Fallback to basic course data if detailed data can't be loaded
          setSelectedCourse(course)
          setDetailModalVisible(true)
        }
      })
      .catch((error) => {
        console.error('Error fetching course details:', error)
        // Fallback to basic course data
        setSelectedCourse(course)
        setDetailModalVisible(true)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const handleCloseModal = () => {
    setDetailModalVisible(false)
    setSelectedCourse(null)
  }

  return (
    <>
      <List
        className="courses-list"
        itemLayout="vertical"
        dataSource={courses}
        renderItem={(course, index) => (
          <Card
            className="course-card-material"
            key={course.id}
            bordered={true}
          >
            <div className="card-left">
              <Badge
                count={index + 1}
                className="course-number-badge"
                overflowCount={999}
              />
            </div>

            <div className="card-content">
              <div className="card-header">
                <Text strong className="course-title">
                  {course.title}
                </Text>
                <Tooltip title="View Details">
                  <Button
                    type="text"
                    icon={<EyeOutlined />}
                    onClick={() => showCourseDetail(course)}
                    className="course-detail-btn"
                    size="small"
                    loading={loading}
                  />
                </Tooltip>
              </div>

              {course.description && (
                <Paragraph
                  ellipsis={{
                    rows: 2,
                    expandable: true,
                    symbol: 'more',
                  }}
                  className="course-description"
                >
                  {course.description}
                </Paragraph>
              )}

              <div className="card-meta">
                <div className="meta-item">
                  <Tag
                    color={CATEGORY_COLORS[course.category]}
                    className="category-tag"
                  >
                    {CATEGORIES[course.category]}
                  </Tag>
                </div>
                <div className="meta-item">
                  <ClockCircleOutlined />
                  <span>{formatTime(course.duration)}</span>
                </div>
              </div>
            </div>
          </Card>
        )}
      />

      <CourseDetailModal
        visible={detailModalVisible}
        course={selectedCourse}
        onClose={handleCloseModal}
      />
    </>
  )
}

export default CourseList
