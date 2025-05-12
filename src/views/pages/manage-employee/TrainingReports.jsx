import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Card,
  Typography,
  Row,
  Col,
  Select,
  Button,
  Tabs,
  Table,
  Progress,
  Statistic,
  DatePicker,
  Spin,
  List,
  Tag,
  Divider,
  Empty,
  Alert,
} from 'antd'
import {
  BarChartOutlined,
  PieChartOutlined,
  LineChartOutlined,
  LeftOutlined,
  UserOutlined,
  BookOutlined,
  RiseOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons'
import './styles/training-reports.scss'

const { Title, Text } = Typography
const { TabPane } = Tabs
const { Option } = Select
const { RangePicker } = DatePicker

// Mock data - replace with API calls
const mockReportData = {
  overallCompletion: 72,
  departmentMetrics: [
    {
      department: 'Engineering',
      completion: 85,
      employeeCount: 12,
      avgScore: 88,
    },
    { department: 'Marketing', completion: 67, employeeCount: 8, avgScore: 79 },
    { department: 'Sales', completion: 73, employeeCount: 10, avgScore: 82 },
    { department: 'HR', completion: 92, employeeCount: 5, avgScore: 91 },
  ],
  popularCourses: [
    {
      title: 'Introduction to React',
      participants: 20,
      completionRate: 85,
      averageScore: 88,
    },
    {
      title: 'JavaScript Fundamentals',
      participants: 18,
      completionRate: 92,
      averageScore: 90,
    },
    {
      title: 'Leadership Skills',
      participants: 15,
      completionRate: 75,
      averageScore: 82,
    },
    {
      title: 'Data Analysis',
      participants: 12,
      completionRate: 67,
      averageScore: 79,
    },
  ],
  lowPerformers: [
    {
      id: 3,
      name: 'Robert Johnson',
      completion: 35,
      coursesCompleted: 2,
      coursesAssigned: 8,
    },
    {
      id: 7,
      name: 'Emily Davis',
      completion: 42,
      coursesCompleted: 3,
      coursesAssigned: 7,
    },
  ],
  highPerformers: [
    {
      id: 1,
      name: 'John Smith',
      completion: 95,
      coursesCompleted: 9,
      coursesAssigned: 10,
    },
    {
      id: 4,
      name: 'Sarah Johnson',
      completion: 90,
      coursesCompleted: 8,
      coursesAssigned: 9,
    },
  ],
}

const TrainingReports = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [reportData, setReportData] = useState(null)
  const [timeRange, setTimeRange] = useState('all')
  const [departmentFilter, setDepartmentFilter] = useState('all')
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setReportData(mockReportData)
      setLoading(false)
    }, 1000)
  }, [timeRange, departmentFilter])

  const handleBackToList = () => {
    navigate('/manage-employee')
  }

  const handleTabChange = (key) => {
    setActiveTab(key)
  }

  const handleTimeRangeChange = (value) => {
    setTimeRange(value)
    setLoading(true)
  }

  const handleDepartmentChange = (value) => {
    setDepartmentFilter(value)
    setLoading(true)
  }

  const departmentColumns = [
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Employees',
      dataIndex: 'employeeCount',
      key: 'employeeCount',
      sorter: (a, b) => a.employeeCount - b.employeeCount,
    },
    {
      title: 'Completion Rate',
      dataIndex: 'completion',
      key: 'completion',
      render: (completion) => (
        <Progress
          percent={completion}
          size="small"
          status={completion >= 80 ? 'success' : 'active'}
        />
      ),
      sorter: (a, b) => a.completion - b.completion,
    },
    {
      title: 'Avg. Score',
      dataIndex: 'avgScore',
      key: 'avgScore',
      render: (score) => `${score}%`,
      sorter: (a, b) => a.avgScore - b.avgScore,
    },
  ]

  const courseColumns = [
    {
      title: 'Course Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Participants',
      dataIndex: 'participants',
      key: 'participants',
      sorter: (a, b) => a.participants - b.participants,
    },
    {
      title: 'Completion Rate',
      dataIndex: 'completionRate',
      key: 'completionRate',
      render: (rate) => (
        <Progress
          percent={rate}
          size="small"
          status={rate >= 80 ? 'success' : 'active'}
        />
      ),
      sorter: (a, b) => a.completionRate - b.completionRate,
    },
    {
      title: 'Avg. Score',
      dataIndex: 'averageScore',
      key: 'averageScore',
      render: (score) => `${score}%`,
      sorter: (a, b) => a.averageScore - b.averageScore,
    },
  ]

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
        <Text>Loading training reports...</Text>
      </div>
    )
  }

  return (
    <div className="training-reports-container">
      <Button
        type="link"
        icon={<LeftOutlined />}
        onClick={handleBackToList}
        className="back-button"
      >
        Back to Employee List
      </Button>

      <Card className="report-header">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={12}>
            <Title level={3}>
              <BarChartOutlined /> Training Performance Reports
            </Title>
          </Col>
          <Col xs={24} md={12}>
            <Row gutter={16} className="filter-controls">
              <Col span={12}>
                <Select
                  placeholder="Time Period"
                  style={{ width: '100%' }}
                  value={timeRange}
                  onChange={handleTimeRangeChange}
                >
                  <Option value="all">All Time</Option>
                  <Option value="month">This Month</Option>
                  <Option value="quarter">This Quarter</Option>
                  <Option value="year">This Year</Option>
                  <Option value="custom">Custom Range</Option>
                </Select>
              </Col>
              <Col span={12}>
                <Select
                  placeholder="Department"
                  style={{ width: '100%' }}
                  value={departmentFilter}
                  onChange={handleDepartmentChange}
                >
                  <Option value="all">All Departments</Option>
                  <Option value="engineering">Engineering</Option>
                  <Option value="marketing">Marketing</Option>
                  <Option value="sales">Sales</Option>
                  <Option value="hr">HR</Option>
                </Select>
              </Col>
            </Row>
            {timeRange === 'custom' && (
              <Row style={{ marginTop: 16 }}>
                <Col span={24}>
                  <RangePicker style={{ width: '100%' }} />
                </Col>
              </Row>
            )}
          </Col>
        </Row>
      </Card>

      <Tabs
        activeKey={activeTab}
        onChange={handleTabChange}
        className="report-tabs"
      >
        <TabPane
          tab={
            <span>
              <PieChartOutlined />
              Overview
            </span>
          }
          key="overview"
        >
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={8}>
              <Card className="stat-card">
                <Statistic
                  title="Overall Completion Rate"
                  value={reportData.overallCompletion}
                  suffix="%"
                  valueStyle={{
                    color:
                      reportData.overallCompletion >= 80
                        ? '#3f8600'
                        : '#1890ff',
                  }}
                  prefix={<CheckCircleOutlined />}
                />
                <Progress
                  percent={reportData.overallCompletion}
                  status={
                    reportData.overallCompletion >= 80 ? 'success' : 'active'
                  }
                  showInfo={false}
                  strokeColor={{
                    '0%': '#108ee9',
                    '100%': '#87d068',
                  }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card className="stat-card">
                <Statistic
                  title="Total Employees"
                  value={reportData.departmentMetrics.reduce(
                    (sum, dept) => sum + dept.employeeCount,
                    0,
                  )}
                  prefix={<UserOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card className="stat-card">
                <Statistic
                  title="Average Score"
                  value={Math.round(
                    reportData.departmentMetrics.reduce(
                      (sum, dept) => sum + dept.avgScore * dept.employeeCount,
                      0,
                    ) /
                      reportData.departmentMetrics.reduce(
                        (sum, dept) => sum + dept.employeeCount,
                        0,
                      ),
                  )}
                  suffix="%"
                  prefix={<RiseOutlined />}
                />
              </Card>
            </Col>
          </Row>

          <Card title="Performance by Department" className="data-card">
            <Table
              columns={departmentColumns}
              dataSource={reportData.departmentMetrics}
              rowKey="department"
              pagination={false}
            />
          </Card>

          <Row gutter={[24, 24]}>
            <Col xs={24} lg={12}>
              <Card title="Top Performers" className="data-card">
                <List
                  itemLayout="horizontal"
                  dataSource={reportData.highPerformers}
                  renderItem={(employee) => (
                    <List.Item
                      actions={[
                        <Button
                          type="link"
                          onClick={() =>
                            navigate(`/manage-employee/profile/${employee.id}`)
                          }
                        >
                          View Profile
                        </Button>,
                      ]}
                    >
                      <List.Item.Meta
                        avatar={<Avatar icon={<UserOutlined />} />}
                        title={
                          <a
                            onClick={() =>
                              navigate(
                                `/manage-employee/profile/${employee.id}`,
                              )
                            }
                          >
                            {employee.name}
                          </a>
                        }
                        description={
                          <div>
                            <Progress
                              percent={employee.completion}
                              size="small"
                              status="success"
                            />
                            <Text type="secondary">
                              Completed {employee.coursesCompleted} of{' '}
                              {employee.coursesAssigned} courses
                            </Text>
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title="Needs Improvement" className="data-card">
                <List
                  itemLayout="horizontal"
                  dataSource={reportData.lowPerformers}
                  renderItem={(employee) => (
                    <List.Item
                      actions={[
                        <Button
                          type="link"
                          onClick={() =>
                            navigate(`/manage-employee/profile/${employee.id}`)
                          }
                        >
                          View Profile
                        </Button>,
                      ]}
                    >
                      <List.Item.Meta
                        avatar={<Avatar icon={<UserOutlined />} />}
                        title={
                          <a
                            onClick={() =>
                              navigate(
                                `/manage-employee/profile/${employee.id}`,
                              )
                            }
                          >
                            {employee.name}
                          </a>
                        }
                        description={
                          <div>
                            <Progress
                              percent={employee.completion}
                              size="small"
                              status="exception"
                            />
                            <Text type="secondary">
                              Completed only {employee.coursesCompleted} of{' '}
                              {employee.coursesAssigned} courses
                            </Text>
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane
          tab={
            <span>
              <BookOutlined />
              Course Performance
            </span>
          }
          key="courses"
        >
          <Card
            title="Course Popularity and Effectiveness"
            className="data-card"
          >
            <Table
              columns={courseColumns}
              dataSource={reportData.popularCourses}
              rowKey="title"
              pagination={false}
            />
          </Card>

          <Alert
            message="Course Suggestions"
            description="Based on current completion rates and employee skills, consider adding more advanced React courses and leadership training opportunities."
            type="info"
            showIcon
            style={{ marginTop: 24 }}
          />
        </TabPane>

        <TabPane
          tab={
            <span>
              <LineChartOutlined />
              Trends
            </span>
          }
          key="trends"
        >
          <Empty
            description="Detailed trend charts will appear here"
            style={{ padding: 100 }}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Text type="secondary">
              In a full implementation, this tab would display charts showing
              training progress trends over time, completion rates, and other
              key performance indicators to help identify patterns and
              improvements.
            </Text>
          </Empty>
        </TabPane>
      </Tabs>
    </div>
  )
}

export default TrainingReports
