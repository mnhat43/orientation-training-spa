import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { Card, Row, Col, Alert, Typography, Button } from 'antd'
import { RocketOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import CourseTimeline from './components/CourseTimeline'
import AssignmentDetails from './components/AssignmentDetails'
import './index.scss'

const { Text } = Typography

const ReviewPath = ({
  selectedTrainee,
  selectedCourses,
  submitting = false,
  onSubmitPath,
  onNext,
  onPrev,
}) => {
  const getTotalDuration = () => {
    try {
      const totalHours = selectedCourses.reduce((acc, course) => {
        const hours = parseInt(course.duration?.split(' ')[0]) || 0
        return acc + hours
      }, 0)
      return `${totalHours} hours`
    } catch (error) {
      return 'Varies'
    }
  }

  return (
    <>
      <Row gutter={24}>
        <Col span={16}>
          <CourseTimeline
            courses={selectedCourses}
            totalDuration={getTotalDuration()}
          />
        </Col>

        <Col span={8}>
          <AssignmentDetails
            trainee={selectedTrainee}
            coursesCount={selectedCourses.length}
            totalDuration={getTotalDuration()}
            onSubmitPath={onSubmitPath}
            submitting={submitting}
            onPrev={onPrev}
          />
        </Col>
      </Row>
    </>
  )
}

ReviewPath.propTypes = {
  selectedTrainee: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    position: PropTypes.string,
    department: PropTypes.string,
  }),
  selectedCourses: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string,
      description: PropTypes.string,
      category: PropTypes.string,
      duration: PropTypes.string,
    }),
  ).isRequired,
  submitting: PropTypes.bool,
  onNext: PropTypes.func,
  onPrev: PropTypes.func,
  onSubmitPath: PropTypes.func.isRequired,
}

const MemoizedReviewPath = memo(ReviewPath)

export default MemoizedReviewPath
