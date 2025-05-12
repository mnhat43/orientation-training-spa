import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Card,
  Tabs,
  Button,
  Typography,
  Row,
  Col,
  Avatar,
  Tag,
  Progress,
  Statistic,
  Divider,
  Spin,
  Alert,
} from 'antd'
import {
  UserOutlined,
  BookOutlined,
  TrophyOutlined,
  LeftOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ArrowUpOutlined,
} from '@ant-design/icons'

// Import components - replace TrainingProgressCards with TrainingProgressTimeline
import TrainingProgressTimeline from './components/TrainingProgressTimeline'
import EnhancedTimeline from './components/EnhancedTimeline'
import './styles/employee-profile.scss'

const { Title, Text } = Typography
const { TabPane } = Tabs

// Mock data - replace with API calls
const mockEmployee = {
  id: 1,
  name: 'John Smith',
  email: 'john.smith@example.com',
  department: 'Engineering',
  role: 'Frontend Developer',
  avatar: null,
  joinedDate: '2022-01-15',
  manager: 'Lisa Wong',
  bio: 'Full-stack developer with 3 years of experience. Passionate about learning new technologies.',
  skills: ['JavaScript', 'React', 'Node.js', 'HTML/CSS'],
  trainingProgress: 78,
  coursesCompleted: [
    {
      id: 101,
      title: 'React Fundamentals',
      completedDate: '2022-03-10',
      score: 92,
      status: 'completed',
      managerReview: {
        rating: 4.5,
        comment: 'Great understanding of React core concepts.',
        reviewer: 'Lisa Wong',
        date: '2022-03-15',
      },
    },
    {
      id: 102,
      title: 'JavaScript Advanced Concepts',
      completedDate: '2022-04-22',
      score: 88,
      status: 'completed',
      managerReview: null,
    },
  ],
  coursesInProgress: [
    {
      id: 103,
      title: 'Node.js Masterclass',
      progress: 65,
      dueDate: '2022-08-30',
      status: 'in-progress',
    },
  ],
  upcomingCourses: [
    {
      id: 104,
      title: 'Advanced TypeScript',
      startDate: '2022-09-15',
      status: 'not-started',
    },
  ],
  performanceMetrics: {
    overallScore: 90,
    learningSpeed: 85,
    completionRate: 95,
    assessmentAverage: 90,
    skillGrowth: 82,
  },
}

const EmployeeProfile = () => {
  const { employeeId } = useParams()
  const navigate = useNavigate()
  const [employee, setEmployee] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('training')

  useEffect(() => {
    // Simulate API call to fetch employee data
    setTimeout(() => {
      setEmployee(mockEmployee)
      setLoading(false)
    }, 800)
  }, [employeeId])

  const handleBackToList = () => {
    navigate('/manage-employee')
  }

  const handleTabChange = (key) => {
    setActiveTab(key)
  }

  const handleReviewSubmit = (reviewData) => {
    // Logic to submit review
    console.log('Review submitted:', reviewData)

    // Update UI optimistically
    // In a real implementation, you would wait for API confirmation
    const updatedEmployee = { ...employee }
    const courseIndex = updatedEmployee.coursesCompleted.findIndex(
      (course) => course.id === reviewData.courseId,
    )

    if (courseIndex !== -1) {
      updatedEmployee.coursesCompleted[courseIndex].managerReview = {
        rating: reviewData.rating,
        comment: reviewData.comment,
        reviewer: 'Current Manager', // In real app, get from auth context
        date: new Date().toISOString().split('T')[0],
      }
      setEmployee(updatedEmployee)
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
        <Text>Loading employee profile...</Text>
      </div>
    )
  }

  if (!employee) {
    return (
      <div className="error-container">
        <Alert
          message="Employee Not Found"
          description="The requested employee profile does not exist or you don't have permission to view it."
          type="error"
          showIcon
          action={
            <Button size="small" type="primary" onClick={handleBackToList}>
              Back to Employee List
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <div className="employee-profile-container">
      <Button
        type="link"
        icon={<LeftOutlined />}
        onClick={handleBackToList}
        className="back-button"
      >
        Back to Employee List
      </Button>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={8}>
          <Card className="employee-info-card">
            <div className="employee-header">
              <Avatar
                size={100}
                icon={<UserOutlined />}
                src={employee.avatar}
                className="employee-avatar"
              />
              <div className="employee-title">
                <Title level={3}>{employee.name}</Title>
                <Text type="secondary">
                  {employee.role} • {employee.department}
                </Text>
              </div>
            </div>

            <Divider />

            <div className="employee-details">
              <p>
                <strong>Email:</strong> {employee.email}
              </p>
              <p>
                <strong>Joined:</strong> {employee.joinedDate}
              </p>
              <p>
                <strong>Manager:</strong> {employee.manager}
              </p>

              <Divider orientation="left">Skills</Divider>
              <div className="skills-container">
                {employee.skills.map((skill) => (
                  <Tag key={skill} color="blue">
                    {skill}
                  </Tag>
                ))}
              </div>

              <Divider orientation="left">Training Overview</Divider>
              <Progress
                percent={employee.trainingProgress}
                status="active"
                strokeColor={{
                  '0%': '#108ee9',
                  '100%': '#87d068',
                }}
              />
              <Row gutter={16} className="training-stats">
                <Col span={8}>
                  <Statistic
                    title="Completed"
                    value={employee.coursesCompleted.length}
                    valueStyle={{ color: '#3f8600' }}
                    prefix={<CheckCircleOutlined />}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="In Progress"
                    value={employee.coursesInProgress.length}
                    valueStyle={{ color: '#1890ff' }}
                    prefix={<ClockCircleOutlined />}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="Upcoming"
                    value={employee.upcomingCourses.length}
                    valueStyle={{ color: '#faad14' }}
                    prefix={<BookOutlined />}
                  />
                </Col>
              </Row>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={16}>
          <Card className="employee-content-card">
            <Tabs
              activeKey={activeTab}
              onChange={handleTabChange}
              className="profile-tabs"
            >
              <TabPane
                tab={
                  <span>
                    <BookOutlined />
                    Training Progress
                  </span>
                }
                key="training"
              >
                {/* Use the new timeline component */}
                <TrainingProgressTimeline
                  employee={employee}
                  onReviewSubmit={handleReviewSubmit}
                />
              </TabPane>

              <TabPane
                tab={
                  <span>
                    <TrophyOutlined />
                    Performance Metrics
                  </span>
                }
                key="performance"
              >
                <div className="performance-container">
                  <Row gutter={[24, 24]}>
                    <Col xs={24} sm={8}>
                      <Card className="metric-card">
                        <Statistic
                          title="Overall Score"
                          value={employee.performanceMetrics.overallScore}
                          suffix="%"
                          valueStyle={{ color: '#3f8600' }}
                          prefix={<TrophyOutlined />}
                        />
                      </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                      <Card className="metric-card">
                        <Statistic
                          title="Completion Rate"
                          value={employee.performanceMetrics.completionRate}
                          suffix="%"
                          valueStyle={{ color: '#1890ff' }}
                          prefix={<CheckCircleOutlined />}
                        />
                      </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                      <Card className="metric-card">
                        <Statistic
                          title="Assessment Average"
                          value={employee.performanceMetrics.assessmentAverage}
                          suffix="%"
                          valueStyle={{ color: '#722ed1' }}
                          prefix={<ArrowUpOutlined />}
                        />
                      </Card>
                    </Col>
                  </Row>

                  <EnhancedTimeline
                    coursesData={{
                      completed: employee.coursesCompleted,
                      inProgress: employee.coursesInProgress,
                      upcoming: employee.upcomingCourses,
                    }}
                  />
                </div>
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default EmployeeProfile
