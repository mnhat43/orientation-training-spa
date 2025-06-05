import React, { useState, useEffect } from 'react'
import {
  Row,
  Col,
  Card,
  Statistic,
  List,
  Progress,
  Typography,
  Space,
  Divider,
  Avatar,
  Table,
  Tag,
  Badge,
  Tooltip,
} from 'antd'
import {
  UserOutlined,
  CalendarOutlined,
  ProjectOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  BookOutlined,
  FormOutlined,
  FileTextOutlined,
  ReadOutlined,
  TrophyOutlined,
  ApartmentOutlined,
  UserSwitchOutlined,
} from '@ant-design/icons'

const { Title, Text } = Typography

const ManagerDashboard = () => {
  // Mock data based on database schema
  // In real implementation, this would come from API calls

  const courseStatistics = {
    total: 15,
    active: 8,
    completed: 5,
    upcoming: 2,
  }

  const userStatistics = {
    total: 124,
    active: 98,
    completed: 42,
    inProgress: 56,
  }

  const quizStatistics = {
    total: 35,
    avgScore: 82,
    highestScore: 98,
    lowestScore: 65,
  }

  // Sample data for Top Courses
  const topCourses = [
    {
      id: 1,
      title: 'Company Introduction',
      enrollments: 48,
      completion_rate: 92,
      modules: 5,
    },
    {
      id: 2,
      title: 'Health & Safety',
      enrollments: 43,
      completion_rate: 87,
      modules: 4,
    },
    {
      id: 3,
      title: 'Ethics Training',
      enrollments: 36,
      completion_rate: 75,
      modules: 6,
    },
    {
      id: 4,
      title: 'IT Security',
      enrollments: 32,
      completion_rate: 68,
      modules: 3,
    },
    {
      id: 5,
      title: 'Career Development',
      enrollments: 29,
      completion_rate: 72,
      modules: 4,
    },
  ]

  // Sample Module Completion Data
  const moduleCompletionData = [
    { module: 'Company History', views: 112, completion: 95 },
    { module: 'Company Structure', views: 98, completion: 88 },
    { module: 'Workplace Safety', views: 105, completion: 92 },
    { module: 'Data Protection', views: 87, completion: 76 },
    { module: 'Career Paths', views: 68, completion: 62 },
  ]

  // Sample User Progress Data
  const userProgressData = [
    {
      name: 'Alex Smith',
      department: 'IT',
      courses_enrolled: 3,
      courses_completed: 2,
      avg_quiz_score: 88,
    },
    {
      name: 'Sarah Johnson',
      department: 'HR',
      courses_enrolled: 4,
      courses_completed: 4,
      avg_quiz_score: 94,
    },
    {
      name: 'David Lee',
      department: 'Finance',
      courses_enrolled: 2,
      courses_completed: 1,
      avg_quiz_score: 76,
    },
    {
      name: 'Maria Garcia',
      department: 'Marketing',
      courses_enrolled: 3,
      courses_completed: 2,
      avg_quiz_score: 85,
    },
    {
      name: 'James Wilson',
      department: 'Operations',
      courses_enrolled: 5,
      courses_completed: 3,
      avg_quiz_score: 82,
    },
  ]

  // Sample Quiz Performance Data
  const quizPerformanceData = [
    {
      quiz: 'Company Values Quiz',
      participants: 45,
      avg_score: 86,
      passing_rate: 93,
    },
    {
      quiz: 'Safety Procedures',
      participants: 42,
      avg_score: 79,
      passing_rate: 88,
    },
    {
      quiz: 'IT Security Basics',
      participants: 38,
      avg_score: 72,
      passing_rate: 82,
    },
    { quiz: 'HR Policies', participants: 36, avg_score: 91, passing_rate: 97 },
  ]

  // Define table columns (simplified)
  const courseColumns = [
    {
      title: 'Course',
      dataIndex: 'title',
      key: 'title',
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: 'Enrollments',
      dataIndex: 'enrollments',
      key: 'enrollments',
    },
    {
      title: 'Completion Rate',
      dataIndex: 'completion_rate',
      key: 'completion_rate',
      render: (rate) => (
        <Tooltip title={`${rate}%`}>
          <Progress percent={rate} size="small" />
        </Tooltip>
      ),
    },
  ]

  const userColumns = [
    {
      title: 'Employee',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      render: (dept) => <Tag color="blue">{dept}</Tag>,
    },
    {
      title: 'Progress',
      key: 'progress',
      render: (_, record) => (
        <Progress
          percent={Math.round(
            (record.courses_completed / record.courses_enrolled) * 100,
          )}
          size="small"
          format={() =>
            `${record.courses_completed}/${record.courses_enrolled}`
          }
        />
      ),
    },
  ]

  const quizColumns = [
    {
      title: 'Quiz',
      dataIndex: 'quiz',
      key: 'quiz',
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: 'Participants',
      dataIndex: 'participants',
      key: 'participants',
    },
    {
      title: 'Avg Score',
      dataIndex: 'avg_score',
      key: 'avg_score',
      render: (score) => {
        let color =
          score >= 90 ? '#52c41a' : score >= 75 ? '#1890ff' : '#faad14'
        return <Text style={{ color }}>{score}%</Text>
      },
    },
  ]

  return (
    <div className="role-dashboard manager-dashboard">
      <Title level={2}>Training Manager Dashboard</Title>
      <Divider />

      <Row gutter={[16, 16]} className="stats-row">
        <Col xs={24} md={8}>
          <Card bordered={false} className="stat-card">
            <Statistic
              title="Course Management"
              value={courseStatistics.total}
              prefix={<BookOutlined />}
              suffix={<Text type="secondary">courses</Text>}
            />
            <div className="stat-details">
              <Badge
                status="success"
                text={`${courseStatistics.active} Active`}
              />
              <Badge
                status="warning"
                text={`${courseStatistics.upcoming} Upcoming`}
              />
              <Badge
                status="default"
                text={`${courseStatistics.completed} Completed`}
              />
            </div>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card bordered={false} className="stat-card">
            <Statistic
              title="User Enrollment"
              value={userStatistics.total}
              prefix={<TeamOutlined />}
              suffix={<Text type="secondary">users</Text>}
            />
            <div className="stat-details">
              <Badge
                status="processing"
                text={`${userStatistics.active} Active Users`}
              />
              <Badge
                status="success"
                text={`${userStatistics.completed} Completed All Courses`}
              />
            </div>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card bordered={false} className="stat-card">
            <Statistic
              title="Quiz Performance"
              value={quizStatistics.avgScore}
              prefix={<FormOutlined />}
              suffix={<Text type="secondary">avg score</Text>}
            />
            <div className="stat-details">
              <Badge
                status="success"
                text={`${quizStatistics.highestScore}% Highest`}
              />
              <Badge
                status="warning"
                text={`${quizStatistics.lowestScore}% Lowest`}
              />
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <BookOutlined />
                <span>Top Courses</span>
              </Space>
            }
            bordered={false}
          >
            <Table
              dataSource={topCourses.slice(0, 3)}
              columns={courseColumns}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <FormOutlined />
                <span>Quiz Performance</span>
              </Space>
            }
            bordered={false}
          >
            <Table
              dataSource={quizPerformanceData.slice(0, 3)}
              columns={quizColumns}
              rowKey="quiz"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <TeamOutlined />
                <span>Employee Progress</span>
              </Space>
            }
            bordered={false}
          >
            <Table
              dataSource={userProgressData.slice(0, 4)}
              columns={userColumns}
              rowKey="name"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <ReadOutlined />
                <span>Module Completion</span>
              </Space>
            }
            bordered={false}
          >
            <Row gutter={[16, 16]}>
              {moduleCompletionData.slice(0, 4).map((module, index) => (
                <Col xs={24} sm={12} key={index}>
                  <Card size="small" bordered={false} className="module-card">
                    <Text strong>{module.module}</Text>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginTop: 4,
                      }}
                    >
                      <Text type="secondary">{module.views} Views</Text>
                      <Text>{module.completion}%</Text>
                    </div>
                    <Progress
                      percent={module.completion}
                      size="small"
                      status={module.completion >= 80 ? 'success' : 'active'}
                      showInfo={false}
                      style={{ marginTop: 8 }}
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Activity Timeline */}
      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        <Col xs={24}>
          <Card
            title={
              <Space>
                <ClockCircleOutlined />
                <span>Course Engagement Overview</span>
              </Space>
            }
            bordered={false}
          >
            <Row gutter={[32, 16]}>
              <Col xs={24} sm={8}>
                <Statistic
                  title="Average Completion Time"
                  value="14"
                  suffix="days"
                  valueStyle={{ color: '#1890ff' }}
                />
                <div style={{ marginTop: 16 }}>
                  <Text strong>Most Completed Course:</Text>
                  <div>Company Introduction (92%)</div>
                </div>
              </Col>

              <Col xs={24} sm={8}>
                <Statistic
                  title="Course Feedback Rating"
                  value={4.7}
                  suffix="/5"
                  precision={1}
                  valueStyle={{ color: '#52c41a' }}
                />
                <div style={{ marginTop: 16 }}>
                  <Text strong>Highest Rated Module:</Text>
                  <div>Company History (4.9/5)</div>
                </div>
              </Col>

              <Col xs={24} sm={8}>
                <Statistic
                  title="Overall Course Pass Rate"
                  value={88}
                  suffix="%"
                  valueStyle={{ color: '#52c41a' }}
                />
                <div style={{ marginTop: 16 }}>
                  <Text strong>Latest Course Completion:</Text>
                  <div>Safety Training (Today)</div>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default ManagerDashboard
