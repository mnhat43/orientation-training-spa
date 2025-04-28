import { useState, useEffect } from 'react'
import {
  Modal,
  Input,
  Table,
  Select,
  Tag,
  Divider,
  Typography,
  Row,
  Col,
  Button,
  Alert,
} from 'antd'
import {
  SearchOutlined,
  FilterOutlined,
  PlusCircleOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons'
import { StatusProgress } from '@constants/userprogress'
import './EnrollTraineesModal.scss'

const { Text } = Typography
const { Option } = Select

const EnrollTraineesModal = ({
  visible,
  onCancel,
  onEnroll,
  courseData,
  trainees,
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [searchTrainee, setSearchTrainee] = useState('')
  const [filterDepartment, setFilterDepartment] = useState('all')
  const [filterAssignmentStatus, setFilterAssignmentStatus] = useState('all')

  useEffect(() => {
    if (visible) {
      setSelectedRowKeys([])
      setSearchTrainee('')
      setFilterDepartment('all')
      setFilterAssignmentStatus('all')
    }
  }, [visible])

  const handleSubmit = () => {
    onEnroll({
      traineeIds: selectedRowKeys,
    })
  }

  const traineesArray = Array.isArray(trainees) ? trainees : []

  const departments = [
    ...new Set(traineesArray.map((t) => t?.department).filter(Boolean)),
  ]

  const filteredTrainees = traineesArray.filter((trainee) => {
    if (!trainee) return false

    const fullname = trainee.fullname || ''
    const email = trainee.email || ''
    const department = trainee.department || ''

    const matchesSearch =
      fullname.toLowerCase().includes(searchTrainee.toLowerCase()) ||
      email.toLowerCase().includes(searchTrainee.toLowerCase()) ||
      department.toLowerCase().includes(searchTrainee.toLowerCase())

    const matchesDepartment =
      filterDepartment === 'all' || department === filterDepartment

    const matchesAssignmentStatus =
      filterAssignmentStatus === 'all' ||
      (filterAssignmentStatus === 'completed' && trainee.status === 2) ||
      (filterAssignmentStatus === 'in-progress' && trainee.status === 1) ||
      (filterAssignmentStatus === 'not-assigned' && trainee.status === 0)

    return matchesSearch && matchesDepartment && matchesAssignmentStatus
  })

  const availableTraineesCount = traineesArray.filter(
    (t) => t && t.status === 0,
  ).length

  const getCheckboxProps = (record) => ({
    disabled: record.status > 0,
    name: record.fullname,
  })

  const selectedTrainees = traineesArray.filter(
    (trainee) => trainee && selectedRowKeys.includes(trainee.userID),
  )

  const handleRemoveSelected = (traineeId) => {
    setSelectedRowKeys(selectedRowKeys.filter((id) => id !== traineeId))
  }

  const handleClearAllSelected = () => {
    setSelectedRowKeys([])
  }

  const handleRowClick = (record) => {
    if (record.status > 0) return

    const selectedIndex = selectedRowKeys.indexOf(record.userID)
    if (selectedIndex !== -1) {
      setSelectedRowKeys(selectedRowKeys.filter((key) => key !== record.userID))
    } else {
      setSelectedRowKeys([...selectedRowKeys, record.userID])
    }
  }

  const onRow = (record) => {
    return {
      onClick: () => handleRowClick(record),
      className: record.status > 0 ? 'enrolled-row' : 'not-enrolled-row',
    }
  }

  const traineeColumns = [
    {
      title: 'Full Name',
      dataIndex: 'fullname',
      key: 'fullname',
      render: (text) => <Text>{text || 'N/A'}</Text>,
      ellipsis: true,
      width: '25%',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text) => <Text>{text || 'N/A'}</Text>,
      ellipsis: true,
      width: '35%',
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      render: (text) => <Text>{text || 'N/A'}</Text>,
      ellipsis: true,
      width: '20%',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        if (status === 2) {
          return (
            <Tag icon={<CheckCircleOutlined />} color="success">
              {StatusProgress[2]}
            </Tag>
          )
        } else if (status === 1) {
          return (
            <Tag icon={<ClockCircleOutlined />} color="processing">
              {StatusProgress[1]}
            </Tag>
          )
        } else {
          return <Tag color="default">{StatusProgress[0]}</Tag>
        }
      },
      width: '20%',
    },
  ]

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => {
      setSelectedRowKeys(newSelectedRowKeys)
    },
    getCheckboxProps,
    selections: [
      {
        key: 'all-not-enrolled',
        text: 'Select All Not Assigned',
        onSelect: () => {
          const notEnrolledTrainees = filteredTrainees
            .filter((trainee) => trainee.status === 0)
            .map((trainee) => trainee.userID)
          setSelectedRowKeys(notEnrolledTrainees)
        },
      },
      {
        key: 'clear-all',
        text: 'Clear All',
        onSelect: () => {
          setSelectedRowKeys([])
        },
      },
    ],
  }

  return (
    <Modal
      title={`Enroll Trainees - ${courseData?.title}`}
      open={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      width={800}
      okText={`Enroll ${selectedRowKeys.length} Trainee${selectedRowKeys.length !== 1 ? 's' : ''}`}
      okButtonProps={{
        disabled: selectedRowKeys.length === 0,
        icon: <PlusCircleOutlined />,
      }}
      cancelText="Cancel"
      className="enrollment-modal enrollment-modal-simple"
    >
      <Alert
        message={`${availableTraineesCount} trainees available. Only trainees without this course in their path can be selected.`}
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
        banner
      />

      <div className="trainee-selection-container">
        <Row gutter={[16, 16]} className="selection-controls">
          <Col xs={24} sm={12}>
            <Input
              className="search-input"
              placeholder="Search trainees..."
              prefix={<SearchOutlined />}
              value={searchTrainee}
              onChange={(e) => setSearchTrainee(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={12} sm={6}>
            <Select
              placeholder="Department"
              value={filterDepartment}
              onChange={(value) => setFilterDepartment(value)}
              style={{ width: '100%' }}
              suffixIcon={<FilterOutlined />}
            >
              <Option key="all-departments" value="all">
                All Departments
              </Option>
              {departments.map((dept, index) => (
                <Option key={`dept-${index}-${dept}`} value={dept}>
                  {dept}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={12} sm={6}>
            <Select
              placeholder="Assignment Status"
              value={filterAssignmentStatus}
              onChange={(value) => setFilterAssignmentStatus(value)}
              style={{ width: '100%' }}
              suffixIcon={<FilterOutlined />}
            >
              <Option key="status-all" value="all">
                All Statuses
              </Option>
              <Option key="status-completed" value="completed">
                Completed
              </Option>
              <Option key="status-in-progress" value="in-progress">
                In Progress
              </Option>
              <Option key="status-not-assigned" value="not-assigned">
                Not Assigned
              </Option>
            </Select>
          </Col>
        </Row>

        {selectedRowKeys.length > 0 && (
          <>
            <div className="selected-trainees-section">
              <div className="section-header">
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Text
                    strong
                  >{`Selected Trainees (${selectedRowKeys.length})`}</Text>
                  <Button
                    size="small"
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={handleClearAllSelected}
                  >
                    Clear All
                  </Button>
                </div>
              </div>
              <div className="selected-trainees-list">
                {selectedTrainees.map((trainee) => (
                  <Tag
                    key={`selected-${trainee.userID}`}
                    closable
                    onClose={() => handleRemoveSelected(trainee.userID)}
                    style={{
                      padding: '4px 8px',
                      margin: '4px',
                    }}
                  >
                    {trainee.fullname}
                  </Tag>
                ))}
              </div>
            </div>
            <Divider style={{ margin: '12px 0' }} />
          </>
        )}

        <Table
          className="trainees-table"
          rowSelection={rowSelection}
          columns={traineeColumns}
          dataSource={filteredTrainees}
          rowKey="userID"
          scroll={{ y: 400 }}
          size="middle"
          bordered
          pagination={false}
          tableLayout="fixed"
          locale={{
            emptyText:
              traineesArray.length === 0
                ? 'No trainees available'
                : 'No trainees match your search criteria',
            selectionAll: 'Select all available trainees',
          }}
          onRow={onRow}
        />
      </div>
    </Modal>
  )
}

export default EnrollTraineesModal
