import React, { useState } from 'react'
import {
  Card,
  Tag,
  Typography,
  Row,
  Col,
  Progress,
  Badge,
  Divider,
  Button,
  Collapse,
  Tooltip,
  Space,
} from 'antd'
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  ScheduleOutlined,
  TrophyOutlined,
  CalendarOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
  RightOutlined,
  DownOutlined,
} from '@ant-design/icons'
import '../styles/enhanced-timeline.scss'

const { Text, Title, Paragraph } = Typography
const { Panel } = Collapse

const EnhancedTimeline = ({ coursesData }) => {
  const { completed, inProgress, upcoming } = coursesData
  const [expandedItems, setExpandedItems] = useState([])

  // Helper to calculate how many days ago/from now
  const getRelativeTime = (dateString) => {
    const date = new Date(dateString)
    const today = new Date()
    const diffTime = Math.abs(today - date)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (date < today) {
      return diffDays === 1 ? 'Yesterday' : `${diffDays} days ago`
    } else if (date > today) {
      return diffDays === 1 ? 'Tomorrow' : `In ${diffDays} days`
    } else {
      return 'Today'
    }
  }

  // Group timeline items by year and month
  const groupByDate = (courses) => {
    const grouped = {}

    courses.forEach((course) => {
      let dateKey
      if (course.status === 'completed') {
        dateKey = course.completedDate
      } else if (course.status === 'in-progress') {
        dateKey = course.dueDate
      } else {
        dateKey = course.startDate
      }

      const date = new Date(dateKey)
      const yearMonth = `${date.getFullYear()}-${date.getMonth() + 1}`

      if (!grouped[yearMonth]) {
        grouped[yearMonth] = []
      }

      grouped[yearMonth].push(course)
    })

    // Sort by date
    return Object.entries(grouped)
      .sort(([a], [b]) => new Date(b) - new Date(a))
      .map(([yearMonth, courses]) => {
        const [year, month] = yearMonth.split('-')
        const monthName = new Date(year, month - 1).toLocaleString('default', {
          month: 'long',
        })
        return {
          title: `${monthName} ${year}`,
          courses,
        }
      })
  }

  // Combine all courses and sort them
  const allCourses = [...completed, ...inProgress, ...upcoming].sort((a, b) => {
    // Get the relevant date for each course
    const getDate = (course) => {
      if (course.status === 'completed') return new Date(course.completedDate)
      if (course.status === 'in-progress') return new Date(course.dueDate)
      return new Date(course.startDate)
    }

    return getDate(b) - getDate(a) // Sort descending (newest first)
  })

  const groupedCourses = groupByDate(allCourses)

  const toggleExpand = (id) => {
    setExpandedItems((prev) => {
      if (prev.includes(id)) {
        return prev.filter((itemId) => itemId !== id)
      } else {
        return [...prev, id]
      }
    })
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />
      case 'in-progress':
        return <ClockCircleOutlined style={{ color: '#1890ff' }} />
      default:
        return <ScheduleOutlined style={{ color: '#faad14' }} />
    }
  }

  const getStatusTag = (status) => {
    switch (status) {
      case 'completed':
        return <Tag color="success">COMPLETED</Tag>
      case 'in-progress':
        return <Tag color="processing">IN PROGRESS</Tag>
      default:
        return <Tag color="default">NOT STARTED</Tag>
    }
  }

  return (
    <div className="enhanced-timeline">
      <Title level={4}>Learning Journey Timeline</Title>
      <Paragraph>
        This timeline shows all your learning activities, from completed courses
        to upcoming training. Click on any item to see more details.
      </Paragraph>

      <div className="timeline-legend">
        <Space size="large">
          <span>
            <CheckCircleOutlined style={{ color: '#52c41a' }} /> Completed
          </span>
          <span>
            <ClockCircleOutlined style={{ color: '#1890ff' }} /> In Progress
          </span>
          <span>
            <ScheduleOutlined style={{ color: '#faad14' }} /> Upcoming
          </span>
        </Space>
      </div>

      <div className="timeline-container">
        {groupedCourses.map((group, groupIndex) => (
          <div key={group.title} className="timeline-group">
            <div className="timeline-group-header">
              <CalendarOutlined /> {group.title}
            </div>

            {group.courses.map((course, index) => {
              const isExpanded = expandedItems.includes(course.id)
              const isCompleted = course.status === 'completed'
              const isInProgress = course.status === 'in-progress'

              return (
                <div
                  key={course.id}
                  className={`timeline-item ${course.status}`}
                >
                  <div className="timeline-connector">
                    <div className="timeline-line-top"></div>
                    <div className="timeline-dot"></div>
                    <div className="timeline-line-bottom"></div>
                  </div>

                  <Card
                    className="timeline-card"
                    onClick={() => toggleExpand(course.id)}
                  >
                    <div className="timeline-card-header">
                      <div className="timeline-status-icon">
                        {getStatusIcon(course.status)}
                      </div>

                      <div className="timeline-content">
                        <div className="title-row">
                          <Text strong>{course.title}</Text>
                          {isCompleted && (
                            <Badge
                              count={`${course.score}%`}
                              style={{ backgroundColor: '#52c41a' }}
                            />
                          )}
                        </div>

                        <div className="meta-row">
                          {isCompleted && (
                            <Text type="secondary">
                              Completed on {course.completedDate} (
                              {getRelativeTime(course.completedDate)})
                            </Text>
                          )}

                          {isInProgress && (
                            <Text type="secondary">
                              Due by {course.dueDate} (
                              {getRelativeTime(course.dueDate)})
                            </Text>
                          )}

                          {!isCompleted && !isInProgress && (
                            <Text type="secondary">
                              Starts on {course.startDate} (
                              {getRelativeTime(course.startDate)})
                            </Text>
                          )}

                          {getStatusTag(course.status)}
                        </div>
                      </div>

                      <div className="timeline-expand-icon">
                        {isExpanded ? <DownOutlined /> : <RightOutlined />}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="timeline-card-detail">
                        <Divider style={{ margin: '12px 0' }} />

                        {isInProgress && (
                          <>
                            <Paragraph>
                              <Text strong>Progress: </Text>
                              <Text>{course.progress}% complete</Text>
                            </Paragraph>
                            <Progress
                              percent={course.progress}
                              size="small"
                              status="active"
                            />
                          </>
                        )}

                        {isCompleted && course.managerReview && (
                          <div className="manager-review">
                            <Paragraph>
                              <Text strong>Manager's Feedback:</Text>
                              <div className="review-meta">
                                <Text type="secondary">
                                  {course.managerReview.reviewer} •{' '}
                                  {course.managerReview.date}
                                </Text>
                                <div className="review-stars">
                                  {[...Array(5)].map((_, i) => (
                                    <span
                                      key={i}
                                      className={`star ${i < Math.floor(course.managerReview.rating) ? 'filled' : ''} ${
                                        i ===
                                          Math.floor(
                                            course.managerReview.rating,
                                          ) &&
                                        course.managerReview.rating % 1 !== 0
                                          ? 'half-filled'
                                          : ''
                                      }`}
                                    >
                                      ★
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </Paragraph>
                            <Paragraph>
                              "{course.managerReview.comment}"
                            </Paragraph>
                          </div>
                        )}

                        {isCompleted && !course.managerReview && (
                          <div className="no-review">
                            <InfoCircleOutlined /> No manager review yet
                          </div>
                        )}

                        <Space className="timeline-actions" size="small">
                          <Tooltip title="View course details">
                            <Button
                              type="default"
                              size="small"
                              icon={<FileTextOutlined />}
                            >
                              View Details
                            </Button>
                          </Tooltip>

                          {isCompleted && (
                            <Tooltip title="View certificate">
                              <Button
                                type="primary"
                                size="small"
                                icon={<TrophyOutlined />}
                              >
                                Certificate
                              </Button>
                            </Tooltip>
                          )}
                        </Space>
                      </div>
                    )}
                  </Card>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

export default EnhancedTimeline
