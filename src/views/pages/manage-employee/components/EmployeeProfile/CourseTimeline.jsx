import React, { useState } from 'react'
import {
  Typography,
  Card,
  Tag,
  Progress,
  Badge,
  Divider,
  Timeline,
  Rate,
  Button,
  Empty,
  Form,
  Input,
  Space,
} from 'antd'
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  LockOutlined,
  UserOutlined,
  BookOutlined,
  CommentOutlined,
  EditOutlined,
} from '@ant-design/icons'
import './CourseTimeline.scss'

const { Text } = Typography

const CourseTimeline = ({ processInfo, handleCreateAssessment }) => {
  const [assessingCourseId, setAssessingCourseId] = useState(null)
  const [form] = Form.useForm()

  if (!processInfo || processInfo.length === 0) {
    return (
      <Card
        title={
          <div className="section-title">
            <BookOutlined className="section-icon" />
            <span>Course Completion Status</span>
          </div>
        }
        className="courses-card"
        bordered={false}
      >
        <Empty description="No courses found for this employee" />
      </Card>
    )
  }

  const completedCourses = processInfo.filter(
    (course) => course.status === 'completed',
  )
  const inProgressCourses = processInfo.filter(
    (course) => course.status === 'in_progress',
  )
  const lockedCourses = processInfo.filter(
    (course) => course.status === 'locked' || course.status === 'not_started',
  )

  const orderedCourses = [
    ...completedCourses,
    ...inProgressCourses,
    ...lockedCourses,
  ]

  const submitAssessment = (courseTitle, values) => {
    handleCreateAssessment(courseTitle, values)
    setAssessingCourseId(null)
    form.resetFields()
  }

  const cancelAssessment = () => {
    setAssessingCourseId(null)
    form.resetFields()
  }

  const renderAssessmentForm = (course) => {
    return (
      <div className="inline-assessment-form">
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => submitAssessment(course.course_title, values)}
          initialValues={{ rating: 4 }}
        >
          <Form.Item
            name="rating"
            label={
              <span className="rating-label">
                How would you rate this course completion?
              </span>
            }
            rules={[{ required: true, message: 'Please provide a rating' }]}
          >
            <Rate allowHalf className="rating-stars" />
          </Form.Item>

          <Form.Item
            name="feedback"
            label={<span className="feedback-label">Feedback</span>}
            rules={[{ required: true, message: 'Please provide feedback' }]}
          >
            <Input.TextArea
              placeholder="Share your thoughts on the learner's performance..."
              className="feedback-textarea"
              autoSize={{ minRows: 3, maxRows: 5 }}
            />
          </Form.Item>

          <Form.Item className="form-actions">
            <Space>
              <Button onClick={cancelAssessment}>Cancel</Button>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
    )
  }

  const generateTimelineItems = () => {
    return orderedCourses.map((course, index) => {
      const isAvailable =
        index === 0 || orderedCourses[index - 1].status === 'completed'

      if (course.status === 'completed') {
        return {
          key: course.course_id,
          dot: <CheckCircleOutlined className="timeline-dot completed" />,
          color: course.hasAssessment ? 'green' : 'orange',
          children: (
            <Card
              className={`timeline-course-card completed ${!course.hasAssessment ? 'needs-assessment' : ''}`}
            >
              <div className="course-header">
                <div className="course-badge">
                  <div className="badge-icon">
                    <BookOutlined />
                  </div>
                </div>
                <div className="course-info">
                  <div className="course-status-wrapper">
                    <Tag color="success">Completed</Tag>
                    {course.hasAssessment ? (
                      <Tag color="cyan">Assessed</Tag>
                    ) : (
                      <Tag color="warning">Needs Assessment</Tag>
                    )}
                  </div>
                  <Text strong className="course-title">
                    {course.course_title}
                  </Text>
                  <div className="course-meta">
                    <Badge
                      status={
                        course.userScore / course.totalScore >= 0.8
                          ? 'success'
                          : course.userScore / course.totalScore >= 0.6
                            ? 'warning'
                            : 'error'
                      }
                      text={`Score: ${course.userScore}/${course.totalScore}`}
                    />
                    <span className="completion-date">
                      Completed: {course.completedDate}
                    </span>
                  </div>
                </div>
              </div>

              <Divider style={{ margin: '12px 0' }} />

              {course.hasAssessment ? (
                <div className="assessment-section">
                  <div className="assessment-header">
                    <div className="assessment-title">
                      <CommentOutlined className="assessment-icon" />
                      <Text strong>Manager Feedback</Text>
                    </div>
                  </div>

                  <div className="assessment-content">
                    <div className="rating-row">
                      <Text type="secondary">Performance Rating:</Text>
                      <Rate
                        disabled
                        defaultValue={course.assessment.rating}
                        allowHalf
                        className="learner-rating"
                      />
                    </div>

                    <div className="feedback-box">
                      <Text italic className="feedback-text">
                        "{course.assessment.feedback}"
                      </Text>
                      <div className="feedback-author">
                        <UserOutlined className="author-icon" />
                        <Text type="secondary">{course.assessment.author}</Text>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="assessment-section">
                  {assessingCourseId === course.course_id ? (
                    renderAssessmentForm(course)
                  ) : (
                    <div className="assessment-needed compact">
                      <Space>
                        <Text className="assessment-prompt">
                          Please provide your assessment for this completed
                          course
                        </Text>
                        <Button
                          type="primary"
                          size="small"
                          icon={<EditOutlined />}
                          onClick={() => setAssessingCourseId(course.course_id)}
                          className="assessment-button"
                        >
                          Assess
                        </Button>
                      </Space>
                    </div>
                  )}
                </div>
              )}
            </Card>
          ),
        }
      } else if (course.status === 'in_progress' && isAvailable) {
        return {
          key: course.course_id,
          dot: <ClockCircleOutlined className="timeline-dot in-progress" />,
          color: 'blue',
          children: (
            <Card className="timeline-course-card in-progress">
              <div className="course-header">
                <div className="course-badge">
                  <div className="badge-icon progress">
                    <BookOutlined />
                  </div>
                </div>
                <div className="course-info">
                  <div className="course-status">
                    <Tag color="processing">In Progress</Tag>
                  </div>
                  <Text strong className="course-title">
                    {course.course_title}
                  </Text>
                  <div className="course-meta">
                    <span className="progress-percent">
                      {course.progress}% complete
                    </span>
                  </div>
                </div>
              </div>

              <div className="progress-details">
                {course.currentModule && (
                  <div className="current-module">
                    <Text>Current Module: {course.currentModule}</Text>
                  </div>
                )}
                <Progress
                  percent={course.progress}
                  size="small"
                  status="active"
                  strokeColor={{
                    from: '#108ee9',
                    to: '#1890ff',
                  }}
                />
              </div>
            </Card>
          ),
        }
      } else {
        return {
          key: course.course_id,
          dot: <LockOutlined className="timeline-dot locked" />,
          color: 'gray',
          children: (
            <Card className="timeline-course-card locked">
              <div className="course-header">
                <div className="course-badge">
                  <div className="badge-icon locked">
                    <LockOutlined />
                  </div>
                </div>
                <div className="course-info">
                  <div className="course-status">
                    <Tag color="default">Locked</Tag>
                  </div>
                  <Text strong className="course-title">
                    {course.course_title}
                  </Text>
                </div>
              </div>

              <div className="locked-message">
                <Text type="secondary">
                  {index > 0
                    ? `Complete "${orderedCourses[index - 1].course_title}" to unlock this course`
                    : 'This course is currently locked'}
                </Text>
              </div>
            </Card>
          ),
        }
      }
    })
  }

  return (
    <Card
      title={
        <div className="section-title">
          <BookOutlined className="section-icon" />
          <span>Learning Path </span>
        </div>
      }
      className="courses-card"
      bordered={false}
    >
      <Timeline
        mode="left"
        className="course-timeline sequential"
        items={generateTimelineItems()}
      />
    </Card>
  )
}

export default CourseTimeline
