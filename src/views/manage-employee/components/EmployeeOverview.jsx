import React, { useState, useEffect } from 'react'
import {
  Table,
  Tag,
  Button,
  Space,
  Avatar,
  Input,
  Select,
  Empty,
  message,
  Row,
  Col,
  Tooltip,
} from 'antd'
import {
  UserOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  PlusOutlined,
  SearchOutlined,
  FilterOutlined,
  BarsOutlined,
  SolutionOutlined,
  UserAddOutlined,
  TagsOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import './EmployeeOverview.scss'
import AddEmployeeForm from './AddEmployeeForm'
import { DEPARTMENT_NAMES, STATUS_PROGRESS } from '@constants'
import userApi from '@api/user'
import skillkeywordApi from '@api/skillkeyword'

const { Option } = Select

const EmployeeOverview = ({ overviewData, onSelectEmployee, onRefresh }) => {
  const navigate = useNavigate()
  const [searchText, setSearchText] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [skillKeywordFilter, setSkillKeywordFilter] = useState([])
  const [filteredOverview, setFilteredOverview] = useState([])
  const [addEmployeeVisible, setAddEmployeeVisible] = useState(false)
  const [isAddingEmployee, setIsAddingEmployee] = useState(false)
  const [availableSkills, setAvailableSkills] = useState([])
  const [loading, setLoading] = useState(false)

  // Fetch skill keywords from API
  useEffect(() => {
    const fetchSkillKeywords = async () => {
      setLoading(true)
      try {
        const response = await skillkeywordApi.list()
        if (response && response.data) {
          setAvailableSkills(response.data)
        }
      } catch (error) {
        console.error('Error fetching skill keywords:', error)
        message.error('Failed to load skill keywords')
      } finally {
        setLoading(false)
      }
    }

    fetchSkillKeywords()
  }, [])

  useEffect(() => {
    let result = [...overviewData]

    if (searchText) {
      result = result.filter(
        (employee) =>
          employee.fullname.toLowerCase().includes(searchText.toLowerCase()) ||
          employee.department
            .toLowerCase()
            .includes(searchText.toLowerCase()) ||
          (employee.skill_keywords &&
            employee.skill_keywords.some((skill) =>
              skill.toLowerCase().includes(searchText.toLowerCase()),
            )),
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

    if (skillKeywordFilter.length > 0) {
      result = result.filter(
        (employee) =>
          employee.skill_keywords &&
          skillKeywordFilter.every((filterSkill) =>
            employee.skill_keywords.includes(filterSkill),
          ),
      )
    }

    setFilteredOverview(result)
  }, [
    searchText,
    departmentFilter,
    statusFilter,
    skillKeywordFilter,
    overviewData,
  ])

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
  const handleAddEmployee = async (employeeData) => {
    setIsAddingEmployee(true)
    try {
      const response = await userApi.register(employeeData)

      if (response && response.data) {
        message.success({
          content: `Employee ${employeeData.first_name} ${employeeData.last_name} created successfully!`,
          duration: 5,
        })
        onRefresh()
        setAddEmployeeVisible(false)
      } else {
        message.error('Failed to create employee. Please try again.')
      }
    } catch (error) {
      console.error('Error creating employee:', error)
      const errorMessage =
        error.response?.data?.message ||
        'Failed to create employee. Please try again.'
      message.error(errorMessage)
    } finally {
      setIsAddingEmployee(false)
    }
  }

  const employeeColumns = [
    {
      title: 'Employee',
      key: 'employee',
      render: (_, record) => (
        <Space>
          <Avatar
            src={record.avatar || null}
            icon={<UserOutlined />}
            size="large"
          />
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
      title: 'Skills',
      key: 'skills',
      render: (_, record) => (
        <div className="skill-keywords">
          {record.skill_keywords && record.skill_keywords.length > 0 ? (
            <Space wrap>
              {record.skill_keywords.map((skill) => (
                <Tag color="blue" key={skill}>
                  {skill}
                </Tag>
              ))}
            </Space>
          ) : (
            <span className="no-skills">No skills</span>
          )}
        </div>
      ),
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
          {record.status === 'Not Assigned' ? (
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              className="create-path-btn"
              onClick={() =>
                navigate(`/learning-paths/create?employeeId=${record.user_id}`)
              }
            >
              Create Path
            </Button>
          ) : (
            <Button
              type="primary"
              onClick={() => onSelectEmployee(record.user_id)}
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
      <>
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={24} md={24} lg={8} xl={8}>
            <Input
              placeholder="Search by name, department or skills..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
              style={{ height: '42px' }}
            />
          </Col>
          <Col xs={8} sm={8} md={6} lg={4} xl={4}>
            <Select
              placeholder="Department"
              value={departmentFilter}
              onChange={setDepartmentFilter}
              suffixIcon={<BarsOutlined />}
              style={{ height: '42px', width: '100%' }}
            >
              <Option value="all">All Departments</Option>
              {DEPARTMENT_NAMES.map((dept) => (
                <Option key={dept} value={dept}>
                  {dept}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={8} sm={8} md={6} lg={4} xl={4}>
            <Select
              placeholder="Status"
              value={statusFilter}
              onChange={setStatusFilter}
              suffixIcon={<FilterOutlined />}
              style={{ height: '42px', width: '100%' }}
            >
              <Option value="all">All Statuses</Option>
              {Object.values(STATUS_PROGRESS).map((status) => (
                <Option key={status} value={status}>
                  {status}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={8} sm={8} md={6} lg={4} xl={4}>
            <Select
              placeholder="Skills"
              value={skillKeywordFilter}
              onChange={setSkillKeywordFilter}
              suffixIcon={<TagsOutlined />}
              style={{ height: '42px', width: '100%' }}
              loading={loading}
              mode="multiple"
              maxTagCount={1}
              maxTagPlaceholder={(omittedValues) =>
                `+${omittedValues.length} skills`
              }
              allowClear
            >
              {availableSkills.map((skill) => (
                <Option key={skill._id || skill.id} value={skill.name}>
                  {skill.name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={8} sm={8} md={6} lg={4} xl={4}>
            <Button
              type="primary"
              icon={<UserAddOutlined />}
              onClick={() => setAddEmployeeVisible(true)}
              style={{ height: '42px' }}
            >
              Add Employee
            </Button>
          </Col>
        </Row>

        <Table
          dataSource={filteredOverview}
          columns={employeeColumns}
          rowKey="user_id"
          pagination={{
            pageSize: 5,
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '20'],
            responsive: true,
          }}
          className="employee-table"
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No matching employees found"
              />
            ),
          }}
        />
      </>{' '}
      <AddEmployeeForm
        visible={addEmployeeVisible}
        onCancel={() => setAddEmployeeVisible(false)}
        onSubmit={handleAddEmployee}
        loading={isAddingEmployee}
      />
    </>
  )
}

export default EmployeeOverview
