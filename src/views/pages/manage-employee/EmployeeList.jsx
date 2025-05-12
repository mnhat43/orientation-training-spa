import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Table,
  Input,
  Button,
  Card,
  Tag,
  Space,
  Typography,
  Select,
  Badge,
  Row,
  Col,
} from 'antd'
import { SearchOutlined, UserOutlined, FilterOutlined } from '@ant-design/icons'
import './styles/employee-list.scss'

const { Title } = Typography
const { Option } = Select

// Mock data - replace with API calls in production
const mockEmployees = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@example.com',
    department: 'Engineering',
    joinedDate: '2022-01-15',
    coursesCompleted: 7,
    coursesInProgress: 2,
    coursesNotStarted: 3,
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    department: 'Marketing',
    joinedDate: '2022-03-10',
    coursesCompleted: 3,
    coursesInProgress: 4,
    coursesNotStarted: 5,
  },
  {
    id: 3,
    name: 'Michael Williams',
    email: 'michael.williams@example.com',
    department: 'Sales',
    joinedDate: '2022-02-05',
    coursesCompleted: 5,
    coursesInProgress: 1,
    coursesNotStarted: 4,
  },
  {
    id: 4,
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    department: 'HR',
    joinedDate: '2022-04-20',
    coursesCompleted: 8,
    coursesInProgress: 0,
    coursesNotStarted: 2,
  },
]

const EmployeeList = () => {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchText, setSearchText] = useState('')
  const [filters, setFilters] = useState({
    department: 'all',
  })

  const navigate = useNavigate()

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setEmployees(mockEmployees)
      setLoading(false)
    }, 800)
  }, [])

  const handleSearch = (value) => {
    setSearchText(value)
  }

  const handleFilterChange = (type, value) => {
    setFilters({
      ...filters,
      [type]: value,
    })
  }

  const viewEmployeeProfile = (employeeId) => {
    navigate(`/manage-employee/profile/${employeeId}`)
  }

  const columns = [
    {
      title: 'Full Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <a onClick={() => viewEmployeeProfile(record.id)}>{text}</a>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Join Date',
      dataIndex: 'joinedDate',
      key: 'joinedDate',
    },
    {
      title: 'Courses',
      key: 'courses',
      render: (_, record) => (
        <Space>
          <Badge count={record.coursesCompleted} color="green" showZero>
            <Tag color="green">Completed</Tag>
          </Badge>
          <Badge count={record.coursesInProgress} color="blue" showZero>
            <Tag color="blue">In Progress</Tag>
          </Badge>
          <Badge count={record.coursesNotStarted} color="gray" showZero>
            <Tag color="default">Not Started</Tag>
          </Badge>
        </Space>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => viewEmployeeProfile(record.id)}>
            View Profile
          </Button>
        </Space>
      ),
    },
  ]

  // Filter employees based on search text and department filter
  const filteredEmployees = employees.filter((employee) => {
    // Search filter (name or email)
    const searchFilter = searchText.toLowerCase()
    const matchesSearch =
      !searchText ||
      employee.name.toLowerCase().includes(searchFilter) ||
      employee.email.toLowerCase().includes(searchFilter)

    // Department filter
    const matchesDepartment =
      filters.department === 'all' ||
      employee.department.toLowerCase() === filters.department.toLowerCase()

    return matchesSearch && matchesDepartment
  })

  return (
    <div className="employee-list-container">
      <Card className="employee-list-header">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={16}>
            <Title level={3}>
              <UserOutlined /> Employee Management
            </Title>
          </Col>
          <Col xs={24} sm={12} md={8} className="action-buttons">
            <Button
              type="primary"
              onClick={() => navigate('/manage-employee/reports')}
            >
              View Reports
            </Button>
          </Col>
        </Row>

        <Row gutter={[16, 16]} className="filter-row">
          <Col xs={24} md={16}>
            <Input
              placeholder="Search by name or email..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} md={8}>
            <Select
              placeholder="Department"
              style={{ width: '100%' }}
              value={filters.department}
              onChange={(value) => handleFilterChange('department', value)}
            >
              <Option value="all">All Departments</Option>
              <Option value="engineering">Engineering</Option>
              <Option value="marketing">Marketing</Option>
              <Option value="sales">Sales</Option>
              <Option value="hr">HR</Option>
            </Select>
          </Col>
        </Row>
      </Card>

      <Table
        columns={columns}
        dataSource={filteredEmployees}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        className="employee-table"
      />
    </div>
  )
}

export default EmployeeList
