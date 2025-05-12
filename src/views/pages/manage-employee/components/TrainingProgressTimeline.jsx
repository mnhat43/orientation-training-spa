import React, { useState } from 'react'
import {
  Card,
  Typography,
  Row,
  Col,
  Progress,
  Badge,
  Tag,
  Statistic,
  Button,
  Space,
  Rate,
  Form,
  Input,
  Empty,
  Timeline,
  Tooltip,
  Collapse,
  Avatar,
  Divider,
  Modal,
  Table,
  List,
  Steps,
  Alert,
} from 'antd'
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  TrophyOutlined,
  FileTextOutlined,
  BookOutlined,
  StarOutlined,
  UserOutlined,
  DownOutlined,
  UpOutlined,
  EditOutlined,
  DownloadOutlined,
  FileOutlined,
  TeamOutlined,
} from '@ant-design/icons'
import '../styles/training-progress-timeline.scss'

const { Title, Text, Paragraph } = Typography
const { TextArea } = Input
const { Panel } = Collapse
const { Step } = Steps

const TrainingProgressTimeline = ({ employee, onReviewSubmit }) => {
  const [expandedReview, setExpandedReview] = useState(null)
  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    comment: '',
  })
  const [detailsModalVisible, setDetailsModalVisible] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState(null)

  // Calculate average score for completed courses
  const averageScore =
    employee.coursesCompleted.length > 0
      ? Math.round(
          employee.coursesCompleted.reduce(
            (sum, course) => sum + course.score,
            0,
          ) / employee.coursesCompleted.length,
        )
      : 0

  // Calculate overall progress
  const calculateOverallProgress = () => {
    const total =
      employee.coursesCompleted.length +
      employee.coursesInProgress.length +
      employee.upcomingCourses.length

    const completed = employee.coursesCompleted.length
    const inProgress = employee.coursesInProgress.reduce(
      (sum, course) => sum + course.progress / 100,
      0,
    )

    return Math.round(((completed + inProgress) / total) * 100)
  }

  // Combine and sort all courses for the timeline
  const allCourses = [
    ...employee.coursesCompleted.map((course) => ({
      ...course,
      dateForSort: new Date(course.completedDate),
      dateLabel: course.completedDate,
      displayStatus: 'completed',
    })),
    ...employee.coursesInProgress.map((course) => ({
      ...course,
      dateForSort: new Date(course.dueDate),
      dateLabel: course.dueDate,
      displayStatus: 'in-progress',
    })),
    ...employee.upcomingCourses.map((course) => ({
      ...course,
      dateForSort: new Date(course.startDate),
      dateLabel: course.startDate,
      displayStatus: 'not-started',
    })),
  ].sort((a, b) => b.dateForSort - a.dateForSort)

  // Mock data for course details
  const mockCourseDetails = {
    description:
      'This course covers fundamental concepts and practices in the specified area. Participants will learn through a combination of theory and hands-on exercises.',
    duration: '4 weeks',
    instructors: ['John Doe', 'Jane Smith'],
    prerequisites: [
      'Basic knowledge of the subject',
      'Completion of introductory courses',
    ],
    assignments: [
      {
        name: 'Assignment 1',
        dueDate: 'Week 1',
        status: 'Completed',
        score: '90%',
      },
      {
        name: 'Assignment 2',
        dueDate: 'Week 2',
        status: 'Completed',
        score: '85%',
      },
      {
        name: 'Project Work',
        dueDate: 'Week 3-4',
        status: 'Completed',
        score: '95%',
      },
    ],
  }

  const handleStartReview = (courseId) => {
    setExpandedReview(courseId)
    setReviewForm({
      rating: 0,
      comment: '',
    })
  }

  const handleCancelReview = () => {
    setExpandedReview(null)
    setReviewForm({
      rating: 0,
      comment: '',
    })
  }

  const handleReviewChange = (field, value) => {
    setReviewForm({
      ...reviewForm,
      [field]: value,
    })
  }

  const handleSubmitReview = (courseId) => {
    onReviewSubmit({
      courseId,
      ...reviewForm,
    })
    setExpandedReview(null)
    setReviewForm({
      rating: 0,
      comment: '',
    })
  }

  const showDetailsModal = (course, e) => {
    e.stopPropagation() // Prevent the card from expanding/collapsing
    setSelectedCourse(course)
    setDetailsModalVisible(true)
  }

  const renderDetailsModal = () => {
    if (!selectedCourse) return null

    const details = mockCourseDetails // In a real app, you'd fetch this data based on selectedCourse.id
    const isCompleted = selectedCourse.displayStatus === 'completed'
    const isInProgress = selectedCourse.displayStatus === 'in-progress'
    const isNotStarted = selectedCourse.displayStatus === 'not-started'

    return (
      <Modal
        title={
          <div className="course-detail-modal-title">
            <BookOutlined style={{ marginRight: 8 }} />
            {selectedCourse.title}
          </div>
        }
        visible={detailsModalVisible}
        onCancel={() => setDetailsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailsModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={650}
        className="course-detail-modal"
      >
        <div className="course-detail-content">
          {/* Status Banner */}
          <div className={`status-banner ${selectedCourse.displayStatus}`}>
            {isCompleted && 'Course Completed'}
            {isInProgress && 'Course In Progress'}
            {isNotStarted && 'Course Not Started'}
          </div>

          <Row gutter={[16, 24]}>
            {/* Course Overview Card */}
            <Col span={24}>
              <Card className="detail-summary-card">
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12}>
                    <div className="detail-item">
                      <Text strong>Status:</Text>
                      <div>
                        {isCompleted && <Tag color="success">COMPLETED</Tag>}
                        {isInProgress && (
                          <Tag color="processing">IN PROGRESS</Tag>
                        )}
                        {isNotStarted && <Tag color="default">NOT STARTED</Tag>}
                      </div>
                    </div>

                    <div className="detail-item">
                      <Text strong>Duration:</Text>
                      <div>{details.duration}</div>
                    </div>

                    <div className="detail-item">
                      <Text strong>Instructors:</Text>
                      <div>{details.instructors.join(', ')}</div>
                    </div>
                  </Col>

                  <Col xs={24} md={12}>
                    {isCompleted && (
                      <>
                        <div className="detail-item">
                          <Text strong>Completed On:</Text>
                          <div>{selectedCourse.completedDate}</div>
                        </div>
                        <div className="detail-item">
                          <Text strong>Score:</Text>
                          <div>
                            <Badge
                              count={`${selectedCourse.score}%`}
                              style={{ backgroundColor: '#52c41a' }}
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {isInProgress && (
                      <>
                        <div className="detail-item">
                          <Text strong>Progress:</Text>
                          <div>
                            <Progress
                              percent={selectedCourse.progress}
                              size="small"
                              status="active"
                              style={{ width: 120 }}
                            />
                          </div>
                        </div>
                        <div className="detail-item">
                          <Text strong>Due Date:</Text>
                          <div>{selectedCourse.dueDate}</div>
                        </div>
                      </>
                    )}

                    {isNotStarted && (
                      <>
                        <div className="detail-item">
                          <Text strong>Starts On:</Text>
                          <div>{selectedCourse.startDate}</div>
                        </div>
                      </>
                    )}
                  </Col>
                </Row>
              </Card>
            </Col>

            {/* Description */}
            <Col span={24}>
              <Card className="description-card">
                <Title level={5}>About This Course</Title>
                <Paragraph>{details.description}</Paragraph>
              </Card>
            </Col>

            {/* Progress Visualization for In-Progress Courses */}
            {isInProgress && (
              <Col span={24}>
                <Card className="progress-card">
                  <Title level={5}>Current Progress</Title>
                  <Steps size="small" current={1} status="process">
                    <Step
                      title="Started"
                      description="Course enrollment confirmed"
                    />
                    <Step
                      title="In Progress"
                      description="Working on assignments"
                    />
                    <Step title="Completion" description="Final assessment" />
                  </Steps>
                </Card>
              </Col>
            )}

            {/* Assessment Results for Completed Courses */}
            {isCompleted && (
              <Col span={24}>
                <Card className="assessment-card">
                  <Title level={5}>Assessment Results</Title>
                  <Table
                    size="small"
                    dataSource={details.assignments}
                    columns={[
                      {
                        title: 'Assignment',
                        dataIndex: 'name',
                        key: 'name',
                        width: '40%',
                      },
                      {
                        title: 'Due Date',
                        dataIndex: 'dueDate',
                        key: 'dueDate',
                        width: '20%',
                      },
                      {
                        title: 'Status',
                        dataIndex: 'status',
                        key: 'status',
                        width: '20%',
                        render: (status) => (
                          <Tag
                            color={
                              status === 'Completed' ? 'success' : 'processing'
                            }
                          >
                            {status}
                          </Tag>
                        ),
                      },
                      {
                        title: 'Score',
                        dataIndex: 'score',
                        key: 'score',
                        width: '20%',
                      },
                    ]}
                    pagination={false}
                  />
                </Card>
              </Col>
            )}

            {/* Manager Review Section for Completed Courses */}
            {isCompleted && selectedCourse.managerReview && (
              <Col span={24}>
                <Card className="review-card">
                  <Title level={5}>Manager Feedback</Title>
                  <div className="manager-review-content">
                    <div className="review-header">
                      <div className="reviewer-info">
                        <Avatar
                          size="small"
                          icon={<UserOutlined />}
                          style={{ marginRight: 8 }}
                        />
                        <Text type="secondary">
                          {selectedCourse.managerReview.reviewer} •{' '}
                          {selectedCourse.managerReview.date}
                        </Text>
                      </div>
                      <div className="rating-display">
                        <Rate
                          disabled
                          allowHalf
                          value={selectedCourse.managerReview.rating}
                          style={{ fontSize: 14 }}
                        />
                      </div>
                    </div>
                    <div className="review-text">
                      <Paragraph style={{ margin: 0 }}>
                        "{selectedCourse.managerReview.comment}"
                      </Paragraph>
                    </div>
                  </div>
                </Card>
              </Col>
            )}

            {/* Information for Not Started Courses */}
            {isNotStarted && (
              <Col span={24}>
                <Card className="upcoming-card">
                  <Title level={5}>Preparation</Title>
                  <Alert
                    message="Course Starting Soon"
                    description="Be prepared for this course by reviewing the prerequisites and setting aside dedicated time for your learning journey."
                    type="info"
                    showIcon
                  />
                  <Divider orientation="left">Prerequisites</Divider>
                  <ul className="prerequisite-list">
                    {details.prerequisites.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </Card>
              </Col>
            )}
          </Row>
        </div>
      </Modal>
    )
  }

  const renderTimeline = () => {
    if (allCourses.length === 0) {
      return <Empty description="No courses found" />
    }

    return (
      <div className="courses-timeline">
        <Timeline mode="left">
          {allCourses.map((course) => {
            const isCompleted = course.displayStatus === 'completed'
            const isInProgress = course.displayStatus === 'in-progress'
            const isNotStarted = course.displayStatus === 'not-started'
            const needsReview = isCompleted && !course.managerReview

            // Get the correct icon and color for the timeline item
            let dotColor, dotIcon
            if (isCompleted) {
              dotColor = 'green'
              dotIcon = <CheckCircleOutlined />
            } else if (isInProgress) {
              dotColor = 'blue'
              dotIcon = <ClockCircleOutlined />
            } else {
              dotColor = 'gray'
              dotIcon = <CalendarOutlined />
            }

            return (
              <Timeline.Item
                key={course.id}
                dot={dotIcon}
                color={dotColor}
                label={course.dateLabel}
              >
                <Card
                  className={`timeline-course-card ${course.displayStatus} ${needsReview ? 'needs-review' : ''}`}
                  bordered={true}
                >
                  <div className="card-status-indicator"></div>

                  <div className="card-header">
                    <div className="card-title">
                      <BookOutlined className="title-icon" />
                      <Text strong>{course.title}</Text>
                      {isCompleted && (
                        <Badge
                          count={`${course.score}%`}
                          style={{ backgroundColor: '#52c41a' }}
                        />
                      )}
                    </div>

                    <div className="card-meta">
                      {isCompleted && <Tag color="success">COMPLETED</Tag>}
                      {isInProgress && (
                        <Tag color="processing">IN PROGRESS</Tag>
                      )}
                      {isNotStarted && <Tag color="default">NOT STARTED</Tag>}
                    </div>
                  </div>

                  {isInProgress && (
                    <div className="progress-section">
                      <div className="progress-info">
                        <Text>{course.progress}% Complete</Text>
                        <Text type="secondary">Due: {course.dueDate}</Text>
                      </div>
                      <Progress
                        percent={course.progress}
                        status="active"
                        showInfo={false}
                        strokeColor="#1890ff"
                      />
                    </div>
                  )}

                  {isNotStarted && (
                    <div className="upcoming-section">
                      <Text type="secondary">
                        <CalendarOutlined style={{ marginRight: 8 }} />
                        Course starts on {course.startDate}
                      </Text>
                    </div>
                  )}

                  {isCompleted && course.managerReview && (
                    <div className="review-display">
                      <div className="review-header">
                        <div className="reviewer-info">
                          <Avatar
                            size="small"
                            icon={<UserOutlined />}
                            style={{ marginRight: 8 }}
                          />
                          <Text type="secondary">
                            Reviewed by {course.managerReview.reviewer} on{' '}
                            {course.managerReview.date}
                          </Text>
                        </div>
                        <div className="rating-display">
                          <Rate
                            disabled
                            allowHalf
                            value={course.managerReview.rating}
                            style={{ fontSize: 14 }}
                          />
                        </div>
                      </div>
                      <div className="review-content">
                        <Paragraph
                          ellipsis={{
                            rows: 2,
                            expandable: true,
                            symbol: 'more',
                          }}
                          style={{ margin: 0, fontStyle: 'italic' }}
                        >
                          "{course.managerReview.comment}"
                        </Paragraph>
                      </div>
                    </div>
                  )}

                  {isCompleted && !course.managerReview && (
                    <div className="review-section">
                      {expandedReview === course.id ? (
                        <div className="review-form">
                          <div className="form-header">
                            <Text strong>Your Feedback</Text>
                          </div>
                          <div className="rating-input">
                            <Text>Rating:</Text>
                            <Rate
                              allowHalf
                              value={reviewForm.rating}
                              onChange={(value) =>
                                handleReviewChange('rating', value)
                              }
                            />
                          </div>
                          <TextArea
                            rows={3}
                            placeholder="What did the employee do well? Where can they improve?"
                            value={reviewForm.comment}
                            onChange={(e) =>
                              handleReviewChange('comment', e.target.value)
                            }
                            className="comment-input"
                          />
                          <div className="form-actions">
                            <Button onClick={handleCancelReview}>Cancel</Button>
                            <Button
                              type="primary"
                              disabled={
                                !reviewForm.rating || !reviewForm.comment.trim()
                              }
                              onClick={() => handleSubmitReview(course.id)}
                            >
                              Submit Review
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button
                          type="primary"
                          ghost
                          icon={<EditOutlined />}
                          onClick={() => handleStartReview(course.id)}
                          className="review-button"
                        >
                          Add Review
                        </Button>
                      )}
                    </div>
                  )}

                  <div className="card-actions">
                    <Space>
                      <Tooltip title="View details">
                        <Button
                          type="text"
                          size="small"
                          icon={<FileOutlined />}
                          onClick={(e) => showDetailsModal(course, e)}
                        >
                          Details
                        </Button>
                      </Tooltip>
                    </Space>
                  </div>
                </Card>
              </Timeline.Item>
            )
          })}
        </Timeline>
      </div>
    )
  }

  return (
    <div className="training-progress-timeline">
      <Row gutter={[24, 24]}>
        <Col xs={24}>
          <Card className="progress-overview-card">
            <Row gutter={[24, 24]} align="middle">
              <Col xs={24} md={8}>
                <div className="progress-circle">
                  <Progress
                    type="circle"
                    percent={calculateOverallProgress()}
                    format={(percent) => (
                      <div className="progress-circle-content">
                        <div className="percent-value">{percent}%</div>
                        <div className="percent-label">Complete</div>
                      </div>
                    )}
                    width={120}
                    strokeColor={{
                      '0%': '#108ee9',
                      '100%': '#87d068',
                    }}
                  />
                </div>
              </Col>

              <Col xs={24} md={16}>
                <Row gutter={16}>
                  <Col xs={24} sm={8}>
                    <Statistic
                      title="Completed"
                      value={employee.coursesCompleted.length}
                      prefix={
                        <CheckCircleOutlined style={{ color: '#52c41a' }} />
                      }
                    />
                  </Col>
                  <Col xs={24} sm={8}>
                    <Statistic
                      title="In Progress"
                      value={employee.coursesInProgress.length}
                      prefix={
                        <ClockCircleOutlined style={{ color: '#1890ff' }} />
                      }
                    />
                  </Col>
                  <Col xs={24} sm={8}>
                    <Statistic
                      title="Upcoming"
                      value={employee.upcomingCourses.length}
                      prefix={<CalendarOutlined style={{ color: '#faad14' }} />}
                    />
                  </Col>
                </Row>

                <Divider style={{ margin: '16px 0' }} />

                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <div className="stat-item">
                      <Text strong>Average Score</Text>
                      <div className="stat-value">
                        <TrophyOutlined style={{ color: '#52c41a' }} />{' '}
                        {averageScore}%
                      </div>
                    </div>
                  </Col>
                  <Col xs={24} sm={12}>
                    <div className="stat-item">
                      <Text strong>Reviews Needed</Text>
                      <div className="stat-value">
                        <Badge
                          status={
                            employee.coursesCompleted.every(
                              (c) => c.managerReview,
                            )
                              ? 'success'
                              : 'warning'
                          }
                        />
                        {employee.coursesCompleted.every((c) => c.managerReview)
                          ? 'All courses reviewed'
                          : `${employee.coursesCompleted.filter((c) => !c.managerReview).length} pending reviews`}
                      </div>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <div className="timeline-section">
        <div className="timeline-header">
          <Title level={4}>Learning Journey Timeline</Title>
          <Text type="secondary">
            Showing all training activities in chronological order
          </Text>
        </div>

        {renderTimeline()}
      </div>

      {renderDetailsModal()}
    </div>
  )
}

export default TrainingProgressTimeline
