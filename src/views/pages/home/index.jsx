import React from 'react'
import {
  Row,
  Col,
  Card,
  Typography,
  Statistic,
  Button,
  List,
  Tag,
  Progress,
} from 'antd'
import { Link } from 'react-router-dom'
import {
  BookOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FireOutlined,
  TeamOutlined,
  CalendarOutlined,
  FileTextOutlined,
  RightOutlined,
  QuestionCircleOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import './home.scss'

const { Title, Text, Paragraph } = Typography

const Home = () => {
  // Mock data for recent activities
  const recentActivities = [
    {
      id: 1,
      title: 'Completed React Basics Quiz',
      time: '2 hours ago',
      type: 'quiz',
      course: 'React JS Training',
    },
    {
      id: 2,
      title: 'Assignment submission: State Management',
      time: 'Yesterday',
      type: 'assignment',
      course: 'React JS Training',
    },
    {
      id: 3,
      title: 'Started new course: Advanced TypeScript',
      time: '3 days ago',
      type: 'course',
      course: 'TypeScript Masterclass',
    },
    {
      id: 4,
      title: 'Commented on discussion: React Hooks',
      time: '5 days ago',
      type: 'discussion',
      course: 'React JS Training',
    },
  ]

  // Mock data for quick access courses
  const quickAccessCourses = [
    {
      id: 16,
      title: 'React JS Training',
      progress: 65,
      nextTask: 'Complete Redux Assignment',
      dueDate: 'Tomorrow',
    },
    {
      id: 22,
      title: 'TypeScript Masterclass',
      progress: 30,
      nextTask: 'Watch Generics Lecture',
      dueDate: 'In 3 days',
    },
    {
      id: 8,
      title: 'Git & GitHub Essentials',
      progress: 90,
      nextTask: 'Final Project Submission',
      dueDate: 'Next week',
    },
  ]

  // Get tag color based on activity type
  const getTagColor = (type) => {
    const colors = {
      quiz: 'green',
      assignment: 'blue',
      course: 'purple',
      discussion: 'orange',
    }
    return colors[type] || 'default'
  }

  return (
    <div className="home-page">
      {/* Welcome Section */}
      <Row gutter={[24, 24]} className="welcome-section">
        <Col xs={24} lg={16}>
          <Card className="welcome-card">
            <Title level={2}>Welcome back, Admin!</Title>
            <Paragraph>
              Continue your training journey. You have some pending tasks to
              complete.
            </Paragraph>
            <div className="welcome-stats">
              <Statistic
                title="In Progress"
                value={3}
                prefix={<ClockCircleOutlined />}
                className="welcome-stat"
              />
              <Statistic
                title="Completed"
                value={12}
                prefix={<CheckCircleOutlined />}
                className="welcome-stat"
              />
              <Statistic
                title="Achievements"
                value={8}
                prefix={<FireOutlined />}
                className="welcome-stat"
              />
            </div>
            <div className="action-buttons">
              <Button type="primary" size="large" icon={<BookOutlined />}>
                <Link to="/courses">My Courses</Link>
              </Button>
              <Button size="large" icon={<CalendarOutlined />}>
                <Link to="/calendar">Calendar</Link>
              </Button>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card className="announcement-card">
            <Title level={4}>Announcements</Title>
            <div className="announcement-item">
              <Text strong>New Course Available</Text>
              <Paragraph>
                Docker & Kubernetes Fundamentals course is now available!
              </Paragraph>
              <Text type="secondary">Today</Text>
            </div>
            <div className="announcement-item">
              <Text strong>System Maintenance</Text>
              <Paragraph>
                Scheduled maintenance on Saturday, 10PM-12AM.
              </Paragraph>
              <Text type="secondary">Yesterday</Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Quick Access Courses & Recent Activities */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16} className="quick-access-section">
          <Card title="Continue Learning" className="section-card">
            {quickAccessCourses.map((course) => (
              <div key={course.id} className="course-item">
                <div className="course-info">
                  <Link to={`/course/${course.id}/modules`}>
                    <Title level={5}>{course.title}</Title>
                  </Link>
                  <Progress percent={course.progress} status="active" />
                  <div className="course-next-task">
                    <Text type="secondary">Next: {course.nextTask}</Text>
                    <Tag color="blue">
                      <ClockCircleOutlined /> Due {course.dueDate}
                    </Tag>
                  </div>
                </div>
                <Link to={`/course/${course.id}/modules`}>
                  <Button
                    type="primary"
                    shape="circle"
                    icon={<RightOutlined />}
                  />
                </Link>
              </div>
            ))}
            <div className="view-all">
              <Button type="link">
                <Link to="/courses">
                  View all courses <RightOutlined />
                </Link>
              </Button>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={8} className="activities-section">
          <Card title="Recent Activities" className="section-card">
            <List
              dataSource={recentActivities}
              renderItem={(item) => (
                <List.Item className="activity-item">
                  <div>
                    <div className="activity-header">
                      <Text strong>{item.title}</Text>
                      <Tag color={getTagColor(item.type)}>{item.type}</Tag>
                    </div>
                    <Text type="secondary">{item.course}</Text>
                    <div>
                      <Text type="secondary">
                        <ClockCircleOutlined /> {item.time}
                      </Text>
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* Quick Links Section */}
      <Row gutter={[24, 24]} className="quick-links-section">
        <Col xs={24}>
          <Card className="section-card">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6}>
                <Link to="/teams">
                  <Card className="quick-link-card">
                    <TeamOutlined className="quick-link-icon" />
                    <Text strong>Teams</Text>
                  </Card>
                </Link>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Link to="/resources">
                  <Card className="quick-link-card">
                    <FileTextOutlined className="quick-link-icon" />
                    <Text strong>Resources</Text>
                  </Card>
                </Link>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Link to="/help">
                  <Card className="quick-link-card">
                    <QuestionCircleOutlined className="quick-link-icon" />
                    <Text strong>Help Center</Text>
                  </Card>
                </Link>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Link to="/setting">
                  <Card className="quick-link-card">
                    <SettingOutlined className="quick-link-icon" />
                    <Text strong>Settings</Text>
                  </Card>
                </Link>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Home
