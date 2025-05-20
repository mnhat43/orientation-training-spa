import { useState, useEffect } from 'react'
import {
  Button,
  Spin,
  Empty,
  Tag,
  Progress,
  Row,
  Col,
  Steps,
  Tooltip,
  Avatar,
} from 'antd'
import {
  LockOutlined,
  CheckCircleOutlined,
  RightCircleOutlined,
  BookOutlined,
  TrophyOutlined,
  FireOutlined,
  StarOutlined,
  RocketOutlined,
  CrownOutlined,
  CompassOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import courseApi from '@api/course'
import { toast } from 'react-toastify'
import BannerComponent from '@components/Banner/index.jsx'
import CourseCard from '@components/CourseCard/index.jsx'
import { ROLES } from '@constants/roles'
import './learning-path.scss'
import { CATEGORY_COLORS } from '@constants/categories'

const { Step } = Steps

const MyLearningPath = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [userProgress, setUserProgress] = useState({
    totalCompleted: 0,
    progressPercentage: 0,
    nextCourseIndex: 0,
    allCompleted: false,
  })
  const navigate = useNavigate()
  const userRole = ROLES.EMPLOYEE

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      setLoading(true)
      const response = await courseApi.getListCourse()

      if (response.status === 1) {
        const sortedCourses = [...response.data.courses].sort(
          (a, b) => a.course_position - b.course_position,
        )

        const completedCount = sortedCourses.filter(
          (course) => course.completed,
        ).length

        const nextCourseIndex = sortedCourses.findIndex(
          (course) => !course.completed,
        )

        const allCompleted =
          nextCourseIndex === -1 || completedCount === sortedCourses.length

        setUserProgress({
          totalCompleted: completedCount,
          progressPercentage: (completedCount / sortedCourses.length) * 100,
          nextCourseIndex: nextCourseIndex !== -1 ? nextCourseIndex : 0,
          allCompleted: allCompleted,
        })

        setCourses(sortedCourses)
      }
    } catch (error) {
      toast.error(
        'Error fetching learning path: ' + (error.message || 'Unknown error'),
      )
    } finally {
      setLoading(false)
    }
  }

  const getCourseStatus = (course, index) => {
    if (course.completed) {
      return {
        status: 'completed',
        locked: false,
        progress: 100,
        completed: true,
      }
    }

    if (index <= userProgress.nextCourseIndex) {
      return {
        status: 'in-progress',
        locked: false,
        progress: 0,
        completed: false,
      }
    }

    return { status: 'locked', locked: true, progress: 0, completed: false }
  }

  const handleCourseClick = (course, courseStatus) => {
    if (courseStatus.locked) {
      toast.warning('Complete the previous courses to unlock this course.')
      return
    }
    navigate(`/course/${course.course_id}/lectures`)
  }

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

  const formatDuration = (minutes) => {
    if (!minutes) return 'No duration set'

    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60

    if (hours > 0) {
      return `${hours}h ${mins > 0 ? `${mins}m` : ''}`
    }
    return `${mins}m`
  }

  if (loading) {
    return (
      <div className="learning-path-container">
        <BannerComponent
          title="Your Learning Path"
          description="Follow the recommended sequence to complete your training"
          icon={CompassOutlined}
        />
        <div className="loading-container">
          <Spin size="large" />
          <p>Loading your learning path...</p>
        </div>
      </div>
    )
  }

  if (courses.length === 0) {
    return (
      <div className="learning-path-container">
        <BannerComponent
          title="Your Learning Path"
          description="Follow the recommended sequence to complete your training"
          icon={CompassOutlined}
        />
        <div className="empty-path">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No learning path has been assigned to you yet"
          />
          <p>Your manager will set up your personalized learning path soon.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="learning-path-container">
      <BannerComponent
        title="Your Learning Path"
        description="Follow the recommended sequence to complete your training"
        icon={CompassOutlined}
      />

      <div className="learning-path-content">
        <div className="progress-overview">
          <div className="overview-layout">
            <div className="left-column">
              <div className="learning-path-steps">
                <h3>Your Learning Path Roadmap</h3>
                <Steps
                  direction="vertical"
                  current={userProgress.nextCourseIndex}
                  className="course-steps"
                >
                  {courses.map((course, index) => {
                    const courseStatus = getCourseStatus(course, index)
                    return (
                      <Step
                        key={course.course_id}
                        title={
                          <div
                            className={`step-course-title ${courseStatus.locked ? 'locked' : ''}`}
                            onClick={() =>
                              !courseStatus.locked &&
                              navigate(`/course/${course.course_id}/modules`)
                            }
                          >
                            {course.title}
                          </div>
                        }
                        description={
                          <div className="step-course-details">
                            <Tooltip title={course.description}>
                              <div className="course-description">
                                {course.description}
                              </div>
                            </Tooltip>
                            <div className="course-meta">
                              <Tag
                                color={
                                  CATEGORY_COLORS[course.category] || 'blue'
                                }
                              >
                                {course.category}
                              </Tag>
                              {course.duration && (
                                <span className="duration">
                                  <ClockCircleOutlined />{' '}
                                  {formatDuration(course.duration)}
                                </span>
                              )}
                              <span className="created-date">
                                <CalendarOutlined /> {course.created_at}
                              </span>
                            </div>
                            <div className="course-actions">
                              <Tag
                                icon={getCourseIcon(courseStatus.status)}
                                color={
                                  courseStatus.status === 'completed'
                                    ? 'success'
                                    : courseStatus.status === 'in-progress'
                                      ? 'processing'
                                      : 'default'
                                }
                              >
                                {getStatusText(courseStatus.status)}
                              </Tag>

                              {!courseStatus.locked && (
                                <Button
                                  type={
                                    courseStatus.status === 'completed'
                                      ? 'default'
                                      : 'primary'
                                  }
                                  size="small"
                                  onClick={() =>
                                    navigate(
                                      `/course/${course.course_id}/modules`,
                                    )
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
            </div>

            <div className="right-column">
              <div className="stat-card combined-progress-card">
                <div className="progress-section">
                  <h3>Your Learning Journey</h3>

                  <div className="progress-wrapper">
                    <div className="progress-circle-container">
                      <Progress
                        type="circle"
                        percent={Math.round(userProgress.progressPercentage)}
                        width={90}
                        strokeColor={{
                          '0%': '#108ee9',
                          '100%': '#87d068',
                        }}
                        format={(percent) => (
                          <div className="progress-text">
                            <span className="percent">{percent}%</span>
                          </div>
                        )}
                      />
                    </div>

                    <div className="progress-info">
                      <div className="progress-stat">
                        <div className="stat-label">Completed</div>
                        <div className="stat-value">
                          <CheckCircleOutlined /> {userProgress.totalCompleted}
                        </div>
                      </div>
                      <div className="progress-stat">
                        <div className="stat-label">Total Courses</div>
                        <div className="stat-value">
                          <BookOutlined /> {courses.length}
                        </div>
                      </div>
                      <div className="progress-stat">
                        <div className="stat-label">Remaining</div>
                        <div className="stat-value">
                          <RightCircleOutlined />{' '}
                          {courses.length - userProgress.totalCompleted}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="next-action-section">
                  {!userProgress.allCompleted ? (
                    <>
                      <div className="next-course-header">
                        <FireOutlined className="fire-icon" />
                        <span>Continue Your Learning</span>
                      </div>

                      <div className="next-course-content">
                        <div className="course-preview">
                          <Avatar
                            shape="square"
                            size={64}
                            src={
                              courses[userProgress.nextCourseIndex].thumbnail
                                ? `data:image/jpeg;base64,${courses[userProgress.nextCourseIndex].thumbnail}`
                                : null
                            }
                            icon={
                              !courses[userProgress.nextCourseIndex]
                                .thumbnail && <BookOutlined />
                            }
                            className="course-avatar"
                          />
                          <div className="course-info">
                            <h4 className="course-title">
                              {courses[userProgress.nextCourseIndex].title}
                            </h4>
                            <Tag
                              color={
                                CATEGORY_COLORS[
                                  courses[userProgress.nextCourseIndex].category
                                ] || 'blue'
                              }
                            >
                              {courses[userProgress.nextCourseIndex].category}
                            </Tag>
                            <div className="course-meta">
                              <span className="duration">
                                <ClockCircleOutlined />{' '}
                                {formatDuration(
                                  courses[userProgress.nextCourseIndex]
                                    .duration || 0,
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button
                          type="primary"
                          size="large"
                          block
                          icon={<RocketOutlined />}
                          onClick={() =>
                            navigate(
                              `/course/${courses[userProgress.nextCourseIndex].course_id}/modules`,
                            )
                          }
                          className="start-button"
                        >
                          Start Now
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="all-completed">
                      <div className="completed-header">
                        <TrophyOutlined className="trophy-icon" />
                        <span>Mission Accomplished!</span>
                      </div>
                      <div className="completed-content">
                        <div className="trophy-container">
                          <CrownOutlined className="crown-icon" />
                        </div>
                        <h3>All Courses Completed!</h3>
                        <p>
                          Congratulations on completing your learning path.
                          You've mastered all the required skills.
                        </p>
                        <Button type="primary" icon={<StarOutlined />}>
                          View Certificate
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="learning-path-courses">
          <h3>Course Cards</h3>
          <Row gutter={[16, 16]}>
            {courses.map((course, index) => {
              const courseStatus = getCourseStatus(course, index)

              return (
                <Col xs={24} sm={12} md={8} lg={6} key={course.course_id}>
                  <CourseCard
                    course={course}
                    role={userRole}
                    onClick={() => handleCourseClick(course, courseStatus)}
                    status={{
                      locked: courseStatus.locked,
                      completed: courseStatus.completed,
                    }}
                    position={course.course_position || index + 1}
                  />
                </Col>
              )
            })}
          </Row>
        </div>
      </div>
    </div>
  )
}

export default MyLearningPath
