import React, { memo } from 'react'
import { Row, Col, Typography, Card } from 'antd'
import AssignmentDetails from './components/AssignmentDetails'
import './index.scss'
import CourseList from '@components/CourseList'

const { Title } = Typography

const ReviewPath = ({
  selectedTrainee,
  selectedCourses,
  submitting = false,
  onSubmitPath,
  onPrev,
}) => {
  return (
    <Row gutter={24}>
      <Col span={16}>
        <Card className="review-card">
          <Title level={4} className="timeline-title">
            Learning Path Overview
          </Title>
          <CourseList courses={selectedCourses} />
        </Card>
      </Col>

      <Col span={8}>
        <AssignmentDetails
          trainee={selectedTrainee}
          onSubmitPath={onSubmitPath}
          submitting={submitting}
          onPrev={onPrev}
        />
      </Col>
    </Row>
  )
}

export default memo(ReviewPath)
