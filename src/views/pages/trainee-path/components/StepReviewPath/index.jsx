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
      <Alert
        message={<Text strong>Step 3: Review and Confirm</Text>}
        description="Review the learning path before assigning it to the trainee."
        type="info"
        showIcon
        className="review-path-alert"
      />

      <Card
        title={
          <div className="review-path-title">
            <RocketOutlined className="review-path-title-icon" />
            <span>Review Learning Path</span>
          </div>
        }
        className="step-card review-path-card"
        variant="borderless"
        extra={
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={onPrev}
            className="review-path-navigation-back-btn"
          >
            Back
          </Button>
        }
      >
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
            />
          </Col>
        </Row>
      </Card>
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
