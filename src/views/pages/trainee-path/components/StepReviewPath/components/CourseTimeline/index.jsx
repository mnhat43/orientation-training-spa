import React from 'react'
import PropTypes from 'prop-types'
import { Timeline, Typography, Card, Empty } from 'antd'
import { RocketOutlined, ClockCircleOutlined } from '@ant-design/icons'
import CourseCard from '../CourseCard'
import './index.scss'

const { Title, Text } = Typography

const CourseTimeline = ({ courses = [], totalDuration }) => {
  if (!courses || courses.length === 0) {
    return (
      <Card variant="borderless" className="timeline-container">
        <Empty description="No courses selected" />
      </Card>
    )
  }

  // Create timeline items from courses
  const timelineItems = courses.map((course, index) => ({
    key: course.id || index,
    dot: <RocketOutlined className="timeline-dot" />,
    children: <CourseCard course={course} index={index} />,
  }))

  return (
    <Card variant="borderless" className="timeline-container">
      <div className="timeline-header">
        <Title level={4} className="timeline-title">
          Learning Path Overview
        </Title>
        <div className="timeline-meta">
          <Text className="timeline-course-count">
            {courses.length} {courses.length === 1 ? 'Course' : 'Courses'}
          </Text>
          <Text className="timeline-duration">
            <ClockCircleOutlined /> {totalDuration}
          </Text>
        </div>
      </div>

      <div className="timeline-content">
        <Timeline mode="left" items={timelineItems} />
      </div>
    </Card>
  )
}

CourseTimeline.propTypes = {
  courses: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string,
      title: PropTypes.string, // Allow title as an alternative to name
      description: PropTypes.string,
      category: PropTypes.string,
      duration: PropTypes.string,
    }),
  ),
  totalDuration: PropTypes.string.isRequired,
}

export default CourseTimeline
