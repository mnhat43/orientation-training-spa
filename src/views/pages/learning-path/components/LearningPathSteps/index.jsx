import React from 'react'
import { Steps, Tag, Tooltip, Button, Rate } from 'antd'
import {
  LockOutlined,
  CheckCircleOutlined,
  RightCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { CATEGORY_COLORS } from '@constants'
import './learning-path-steps.scss'
import { formatTime } from '@helpers/common'

const { Step } = Steps

const LearningPathSteps = ({
  courses,
  userProgress,
  navigate,
  getCourseStatus,
}) => {
  const getStepStatus = (status) => {
    if (status === 'completed') return 'finish'
    if (status === 'in-progress') return 'process'
    return 'wait'
  }

  const getCourseIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircleOutlined />
      case 'in-progress':
        return <RightCircleOutlined />
      case 'locked':
        return <LockOutlined />
      default:
        return <ClockCircleOutlined />
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Completed'
      case 'in-progress':
        return 'Available Now'
      case 'locked':
        return 'Locked'
      default:
        return ''
    }
  }

  return (
    <div className="learning-path-steps">
      <h3>Your Learning Path Roadmap</h3>
      <Steps
        direction="vertical"
        current={userProgress.nextCourseIndex}
        className="course-steps"
      >
        {courses.map((course, index) => {
          const courseStatus = getCourseStatus(course, index)
          const hasAssessment =
            courseStatus.status === 'completed' &&
            course.assessment &&
            course.assessment.performance_rating

          return (
            <Step
              key={course.course_id}
              title={
                <div className="step-course-title-container">
                  <div
                    className={`step-course-title ${courseStatus.locked ? 'locked' : ''}`}
                    onClick={() =>
                      !courseStatus.locked &&
                      navigate(`/course/${course.course_id}/lectures`)
                    }
                  >
                    {course.title}
                  </div>
                  <Tag
                    icon={getCourseIcon(courseStatus.status)}
                    color={
                      courseStatus.status === 'completed'
                        ? 'success'
                        : courseStatus.status === 'in-progress'
                          ? 'processing'
                          : 'default'
                    }
                    className="course-status-tag"
                  >
                    {getStatusText(courseStatus.status)}
                  </Tag>
                </div>
              }
              description={
                <div className="step-course-details">
                  <div className="course-content">
                    <Tooltip title={course.description}>
                      <div className="course-description">
                        {course.description}
                      </div>
                    </Tooltip>
                    <div className="course-meta">
                      <Tag color={CATEGORY_COLORS[course.category] || 'blue'}>
                        {course.category}
                      </Tag>
                      {course.duration && (
                        <span className="duration">
                          <ClockCircleOutlined /> {formatTime(course.duration)}
                        </span>
                      )}
                    </div>

                    {hasAssessment && (
                      <div className="course-assessment">
                        <h4>Trainer Assessment</h4>
                        <div className="assessment-rating">
                          <span>Performance Rating: </span>
                          <Rate
                            disabled
                            defaultValue={course.assessment.performance_rating}
                          />
                        </div>
                        {course.assessment.performance_comment && (
                          <div className="assessment-comment">
                            <p>"{course.assessment.performance_comment}"</p>
                          </div>
                        )}
                        {course.assessment.reviewer_name && (
                          <div className="assessment-reviewer">
                            <UserOutlined /> {course.assessment.reviewer_name}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="course-actions">
                    {!courseStatus.locked && (
                      <Button
                        type={
                          courseStatus.status === 'completed'
                            ? 'default'
                            : 'primary'
                        }
                        size="small"
                        onClick={() =>
                          navigate(`/course/${course.course_id}/lectures`)
                        }
                      >
                        {courseStatus.status === 'completed'
                          ? 'Review'
                          : 'Start'}
                      </Button>
                    )}
                  </div>
                </div>
              }
              status={getStepStatus(courseStatus.status)}
              icon={getCourseIcon(courseStatus.status)}
            />
          )
        })}
      </Steps>
    </div>
  )
}

export default LearningPathSteps
