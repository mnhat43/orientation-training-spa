import React, { useState } from 'react'
import {
  Row,
  Col,
  Card,
  Progress,
  Statistic,
  Tag,
  Badge,
  Button,
  Tabs,
  Typography,
  Space,
  message,
  Tooltip,
  Avatar,
  Empty,
  Collapse,
} from 'antd'
import {
  AuditOutlined,
  CalendarOutlined,
  MessageOutlined,
  FormOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  RightCircleOutlined,
  BarChartOutlined,
  BookOutlined,
  DownOutlined,
  UpOutlined,
} from '@ant-design/icons'
import { CATEGORY_COLORS } from '../../../../../constants/categories'
import ReviewList from './ReviewList'

const { Text, Title, Paragraph } = Typography
const { TabPane } = Tabs
const { Panel } = Collapse

const CoursesTab = ({
  mockCourses,
  coursesNeedingReview,
  showCommentForm,
  pendingReviewRef,
}) => {
  const [activeCategory, setActiveCategory] = useState(null)

  // Group courses by category
  const groupedCourses = mockCourses.reduce((acc, course) => {
    if (!acc[course.category]) {
      acc[course.category] = []
    }
    acc[course.category].push(course)
    return acc
  }, {})

  // Calculate overall stats for each category
  const categoryStats = Object.entries(groupedCourses).map(
    ([category, courses]) => {
      const total = courses.length
      const completed = courses.filter((c) => c.status === 'completed').length
      const inProgress = courses.filter(
        (c) => c.status === 'in-progress',
      ).length
      const notStarted = total - completed - inProgress
      const progress = total > 0 ? Math.round((completed / total) * 100) : 0

      return {
        category,
        total,
        completed,
        inProgress,
        notStarted,
        progress,
      }
    },
  )

  // Find the first course that needs review for scrolling and direct review
  const coursesWithPendingReviews = mockCourses.filter(
    (course) =>
      course.status === 'completed' &&
      (!course.managerComments || course.managerComments.length === 0),
  )

  // Calculate overall progress
  const overallStats = {
    total: mockCourses.length,
    completed: mockCourses.filter((c) => c.status === 'completed').length,
    inProgress: mockCourses.filter((c) => c.status === 'in-progress').length,
    notStarted: mockCourses.filter(
      (c) => c.status !== 'completed' && c.status !== 'in-progress',
    ).length,
    progress:
      mockCourses.length > 0
        ? Math.round(
            (mockCourses.filter((c) => c.status === 'completed').length /
              mockCourses.length) *
              100,
          )
        : 0,
  }

  // Handler for clicking on the pending review badge
  const handlePendingReviewClick = () => {
    if (coursesWithPendingReviews.length > 0) {
      // If there are pending reviews, open the comment form for the first one
      const firstPendingCourse = coursesWithPendingReviews[0]
      showCommentForm(firstPendingCourse.id)
    } else {
      message.info('No courses need performance reviews at this time.')
    }
  }

  // Set the initial active tab to be the category that has pending reviews
  React.useEffect(() => {
    if (coursesWithPendingReviews.length > 0) {
      const firstPendingCourse = coursesWithPendingReviews[0]
      setActiveCategory(firstPendingCourse.category)
    } else if (categoryStats.length > 0) {
      setActiveCategory(categoryStats[0].category)
    }
  }, [])

  // Render course card
  const renderCourseCard = (item) => {
    // Determine the course status display
    let statusBadge
    let statusColor
    let statusIcon

    switch (item.status) {
      case 'completed':
        statusBadge = <Badge status="success" text="Completed" />
        statusColor = '#52c41a'
        statusIcon = <CheckCircleOutlined style={{ color: statusColor }} />
        break
      case 'in-progress':
        statusBadge = <Badge status="processing" text="In Progress" />
        statusColor = '#1890ff'
        statusIcon = <ClockCircleOutlined style={{ color: statusColor }} />
        break
      default:
        statusBadge = <Badge status="default" text="Not Started" />
        statusColor = '#d9d9d9'
        statusIcon = <RightCircleOutlined style={{ color: statusColor }} />
    }

    // Check if this course needs review
    const needsReview =
      item.status === 'completed' &&
      (!item.managerComments || item.managerComments.length === 0)

    // Set reference for the first course that needs review
    const shouldSetRef =
      coursesWithPendingReviews.length > 0 &&
      coursesWithPendingReviews[0].id === item.id

    return (
      <Card
        key={item.id}
        ref={shouldSetRef ? pendingReviewRef : null}
        className={shouldSetRef ? 'highlight-card' : ''}
        style={{
          marginBottom: 16,
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.09)',
          borderLeft: `4px solid ${statusColor}`,
        }}
        bodyStyle={{ padding: '16px' }}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} md={18}>
            <Space direction="vertical" style={{ width: '100%' }} size={2}>
              <Space align="center">
                {statusIcon}
                <Title level={5} style={{ margin: 0 }}>
                  {item.title}
                </Title>
                {needsReview && <Tag color="orange">Needs Review</Tag>}
              </Space>

              <Paragraph
                type="secondary"
                style={{ margin: '8px 0' }}
                ellipsis={{ rows: 2, expandable: true, symbol: 'more' }}
              >
                {item.description}
              </Paragraph>

              <div
                style={{ display: 'flex', alignItems: 'center', marginTop: 4 }}
              >
                <div style={{ flex: 1 }}>
                  <Progress
                    percent={item.progress}
                    size="small"
                    status={item.progress === 100 ? 'success' : 'active'}
                    strokeColor={{
                      '0%': '#108ee9',
                      '100%': '#52c41a',
                    }}
                  />
                </div>
                <div
                  style={{
                    marginLeft: 10,
                    minWidth: '60px',
                    textAlign: 'right',
                  }}
                >
                  {statusBadge}
                </div>
              </div>
            </Space>
          </Col>

          <Col
            xs={24}
            md={6}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              {item.grade && (
                <div style={{ textAlign: 'center', marginBottom: 12 }}>
                  <Tooltip title="Course Grade">
                    <Avatar
                      size={64}
                      style={{
                        backgroundColor:
                          item.grade >= 90
                            ? '#52c41a'
                            : item.grade >= 80
                              ? '#1890ff'
                              : item.grade >= 70
                                ? '#faad14'
                                : '#f5222d',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {item.grade}
                    </Avatar>
                  </Tooltip>
                </div>
              )}

              {item.completedDate && (
                <div style={{ textAlign: 'center', marginBottom: 8 }}>
                  <Text type="secondary" style={{ fontSize: '0.85rem' }}>
                    <CalendarOutlined /> {item.completedDate}
                  </Text>
                </div>
              )}
            </div>

            {item.status === 'completed' && (
              <Button
                type={needsReview ? 'primary' : 'default'}
                icon={<FormOutlined />}
                onClick={() => showCommentForm(item.id)}
                block
                style={{ borderRadius: '4px' }}
              >
                {needsReview ? 'Add Review' : 'View Review'}
              </Button>
            )}
          </Col>

          {/* Manager Comments Section */}
          {item.managerComments && item.managerComments.length > 0 && (
            <Col span={24}>
              <Collapse
                ghost
                bordered={false}
                expandIconPosition="end"
                style={{ marginTop: 8 }}
              >
                <Panel
                  header={
                    <div
                      style={{
                        background: '#f9f9f9',
                        padding: '12px',
                        borderRadius: '4px',
                      }}
                    >
                      <Text strong>
                        <MessageOutlined /> Performance Reviews (
                        {item.managerComments.length})
                      </Text>
                    </div>
                  }
                  key="performance-reviews"
                  style={{ borderBottom: 'none' }}
                >
                  <div
                    style={{
                      background: '#f9f9f9',
                      padding: '0 12px 12px 12px',
                      borderBottomLeftRadius: '4px',
                      borderBottomRightRadius: '4px',
                      marginTop: -16,
                    }}
                  >
                    <ReviewList comments={item.managerComments} />
                  </div>
                </Panel>
              </Collapse>
            </Col>
          )}
        </Row>
      </Card>
    )
  }

  return (
    <>
      {/* Dashboard summary */}
      <Card
        style={{
          marginBottom: 24,
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.09)',
          background: 'linear-gradient(to right, #f5f5f5, #ffffff)',
        }}
      >
        <Row gutter={[24, 24]} align="middle">
          <Col xs={24} md={16}>
            <div style={{ marginBottom: 16 }}>
              <Title level={4} style={{ margin: 0 }}>
                Training Progress
              </Title>
              <Text type="secondary">
                Overall completion and category breakdown
              </Text>
            </div>

            <Row gutter={[16, 16]}>
              <Col xs={8}>
                <Statistic
                  title={
                    <Space>
                      <CheckCircleOutlined style={{ color: '#52c41a' }} />
                      <span>Completed</span>
                    </Space>
                  }
                  value={overallStats.completed}
                  suffix={`/ ${overallStats.total}`}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Col>
              <Col xs={8}>
                <Statistic
                  title={
                    <Space>
                      <ClockCircleOutlined style={{ color: '#1890ff' }} />
                      <span>In Progress</span>
                    </Space>
                  }
                  value={overallStats.inProgress}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Col>
              <Col xs={8}>
                <Statistic
                  title={
                    <Space>
                      <RightCircleOutlined style={{ color: '#8c8c8c' }} />
                      <span>Not Started</span>
                    </Space>
                  }
                  value={overallStats.notStarted}
                  valueStyle={{ color: '#8c8c8c' }}
                />
              </Col>
            </Row>
          </Col>

          <Col xs={24} md={8}>
            <div style={{ textAlign: 'center' }}>
              <Progress
                type="dashboard"
                percent={overallStats.progress}
                format={(percent) => (
                  <span
                    style={{
                      fontSize: '24px',
                      fontWeight: 'bold',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {percent}%
                    <span
                      style={{
                        fontSize: '12px',
                        fontWeight: 'normal',
                        marginTop: '4px',
                      }}
                    >
                      Complete
                    </span>
                  </span>
                )}
                width={160}
                strokeColor={{
                  '0%': '#108ee9',
                  '100%': '#52c41a',
                }}
              />
            </div>
          </Col>
        </Row>
      </Card>

      {/* Category stat cards */}
      <div style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]}>
          {categoryStats.map((stat) => (
            <Col xs={24} sm={12} md={8} lg={6} key={stat.category}>
              <Card
                hoverable
                onClick={() => setActiveCategory(stat.category)}
                style={{
                  height: '100%',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.09)',
                  borderTop: `3px solid ${CATEGORY_COLORS[stat.category] || '#1890ff'}`,
                  background:
                    activeCategory === stat.category ? '#f0f5ff' : '#fff',
                }}
              >
                <Space direction="vertical" style={{ width: '100%' }} size={4}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Tag color={CATEGORY_COLORS[stat.category] || 'blue'}>
                      {stat.category}
                    </Tag>
                    <Text>
                      {stat.completed}/{stat.total} Complete
                    </Text>
                  </div>

                  <Progress
                    percent={stat.progress}
                    size="small"
                    status={stat.progress === 100 ? 'success' : 'active'}
                    strokeColor={CATEGORY_COLORS[stat.category] || '#1890ff'}
                  />

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginTop: 4,
                    }}
                  >
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      <CheckCircleOutlined /> {stat.completed}
                    </Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      <ClockCircleOutlined /> {stat.inProgress}
                    </Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      <RightCircleOutlined /> {stat.notStarted}
                    </Text>
                  </div>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Courses by Category */}
      <Card
        style={{
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.09)',
        }}
      >
        <Tabs
          activeKey={
            activeCategory ||
            (categoryStats.length > 0 ? categoryStats[0].category : '')
          }
          onChange={setActiveCategory}
          tabPosition="top"
          style={{ minHeight: 300 }}
          tabBarExtraContent={
            <Space>
              <BookOutlined />
              <Text strong>{mockCourses.length} Total Courses</Text>
            </Space>
          }
        >
          {Object.entries(groupedCourses).map(([category, courses]) => (
            <TabPane
              tab={
                <Space>
                  <Tag color={CATEGORY_COLORS[category] || 'blue'}>
                    {category}
                  </Tag>
                  <Badge
                    count={
                      courses.filter(
                        (c) =>
                          c.status === 'completed' &&
                          (!c.managerComments ||
                            c.managerComments.length === 0),
                      ).length
                    }
                    style={{ backgroundColor: '#fa8c16' }}
                    showZero={false}
                  />
                </Space>
              }
              key={category}
            >
              {courses.length > 0 ? (
                courses.map(renderCourseCard)
              ) : (
                <Empty description="No courses in this category" />
              )}
            </TabPane>
          ))}
        </Tabs>
      </Card>

      {/* Add some custom CSS */}
      <style jsx>{`
        .highlight-card {
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(250, 140, 22, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(250, 140, 22, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(250, 140, 22, 0);
          }
        }
      `}</style>
    </>
  )
}

export default CoursesTab
