import React, { useState, useEffect } from 'react'
import {
  Table,
  Tag,
  Button,
  Card,
  Space,
  Avatar,
  Input,
  Select,
  Empty,
  message,
  Row,
  Col,
} from 'antd'
import {
  UserOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  PlusOutlined,
  SearchOutlined,
  FilterOutlined,
  BarsOutlined,
  DashboardOutlined,
  SolutionOutlined,
  UserAddOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import './EmployeeOverview.scss'
import AddEmployeeForm from './AddEmployeeForm'
import { DEPARTMENT_NAMES, STATUS_PROGRESS } from '@constants'

const { Option } = Select

const EmployeeOverview = ({ employees, selectEmployee }) => {
  const navigate = useNavigate()
  const [searchText, setSearchText] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [filteredEmployees, setFilteredEmployees] = useState([])
  const [addEmployeeVisible, setAddEmployeeVisible] = useState(false)

  useEffect(() => {
    let result = [...employees]

    if (searchText) {
      result = result.filter(
        (employee) =>
          employee.fullname.toLowerCase().includes(searchText.toLowerCase()) ||
          employee.department.toLowerCase().includes(searchText.toLowerCase()),
      )
    }

    if (departmentFilter !== 'all') {
      result = result.filter(
        (employee) => employee.department === departmentFilter,
      )
    }

    if (statusFilter !== 'all') {
      result = result.filter((employee) => employee.status === statusFilter)
    }

    setFilteredEmployees(result)
  }, [searchText, departmentFilter, statusFilter, employees])

  const getStatusTag = (status) => {
    switch (status) {
      case STATUS_PROGRESS[2]:
        return (
          <Tag color="success" icon={<CheckCircleOutlined />}>
            {status}
          </Tag>
        )
      case STATUS_PROGRESS[1]:
        return (
          <Tag color="processing" icon={<ClockCircleOutlined />}>
            {status}
          </Tag>
        )
      case STATUS_PROGRESS[0]:
        return <Tag className="not-started">{status}</Tag>
      default:
        return <Tag>{status}</Tag>
    }
  }
  const handleAddEmployee = (employeeData) => {
    console.log('New employee data:', employeeData)
    message.success(`Employee ${employeeData.fullname} created successfully!`)
    setAddEmployeeVisible(false)
  }

  const employeeColumns = [
    {
      title: 'Employee',
      key: 'employee',
      render: (_, record) => (
        <Space>
          <Avatar src={record.avatar} icon={<UserOutlined />} size="large" />
          <div>
            <div className="employee-name">{record.fullname}</div>
            <div className="employee-email">{record.email}</div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => getStatusTag(status),
    },
    {
      title: 'Contact',
      key: 'contact',
      render: (_, record) => (
        <div className="contact-info">
          {record.phone_number && <div>{record.phone_number}</div>}
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      className: 'action-column',
      render: (_, record) => (
        <Space>
          {record.totalCourses === 0 ? (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              className="create-path-btn"
              onClick={() =>
                navigate(`/learning-paths/create?employeeId=${record.id}`)
              }
            >
              Create Path
            </Button>
          ) : (
            <Button
              type="primary"
              onClick={() => selectEmployee(record)}
              icon={<SolutionOutlined />}
            >
              View Details
            </Button>
          )}
        </Space>
      ),
    },
  ]

  return (
    <>
      <Card
        title={
          <Space>
            <DashboardOutlined />
            <span>Employee Management</span>
          </Space>
        }
      >
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            <Input
              placeholder="Search employees..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={8} sm={8} md={4} lg={4} xl={4}>
            <Select
              placeholder="Department"
              value={departmentFilter}
              onChange={setDepartmentFilter}
              suffixIcon={<BarsOutlined />}
              style={{ width: '100%' }}
            >
              <Option value="all">All Departments</Option>
              {DEPARTMENT_NAMES.map((dept) => (
                <Option key={dept} value={dept}>
                  {dept}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={8} sm={8} md={4} lg={4} xl={4}>
            <Select
              placeholder="Status"
              value={statusFilter}
              onChange={setStatusFilter}
              suffixIcon={<FilterOutlined />}
              style={{ width: '100%' }}
            >
              <Option value="all">All Statuses</Option>
              {Object.values(STATUS_PROGRESS).map((status) => (
                <Option key={status} value={status}>
                  {status}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={8} sm={8} md={4} lg={4} xl={4}>
            <Button
              type="primary"
              icon={<UserAddOutlined />}
              onClick={() => setAddEmployeeVisible(true)}
            >
              Add Employee
            </Button>
          </Col>
        </Row>

        <Table
          dataSource={filteredEmployees}
          columns={employeeColumns}
          rowKey="id"
          pagination={{
            pageSize: 5,
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '20'],
            responsive: true,
          }}
          className="employee-table"
          scroll={{ x: 'max-content' }}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No matching employees found"
              />
            ),
          }}
        />
      </Card>

      <AddEmployeeForm
        visible={addEmployeeVisible}
        onCancel={() => setAddEmployeeVisible(false)}
        onSubmit={handleAddEmployee}
      />
    </>
  )
}

export default EmployeeOverview
