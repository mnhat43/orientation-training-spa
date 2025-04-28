import { useState, useEffect } from 'react'
import {
  Modal,
  Input,
  Table,
  Select,
  Space,
  Tag,
  Divider,
  Typography,
  Row,
  Col,
  Button,
  Alert,
  Empty,
} from 'antd'
import {
  SearchOutlined,
  FilterOutlined,
  PlusCircleOutlined,
  DeleteOutlined,
  BookOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons'

const { Text } = Typography
const { Option } = Select

const AddToTrainingPathModal = ({
  visible,
  onCancel,
  onEnroll,
  courseData,
  traineesData,
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [searchTrainee, setSearchTrainee] = useState('')
  const [filterDepartment, setFilterDepartment] = useState('all')
  const [filterAssignmentStatus, setFilterAssignmentStatus] = useState('all')
  const [pageSize, setPageSize] = useState(8)

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

  const departments = [...new Set(traineesData.map((t) => t.department))]

  const filteredTrainees = traineesData.filter((trainee) => {
    const matchesSearch =
      trainee.name.toLowerCase().includes(searchTrainee.toLowerCase()) ||
      trainee.email.toLowerCase().includes(searchTrainee.toLowerCase()) ||
      trainee.department.toLowerCase().includes(searchTrainee.toLowerCase())

    const matchesDepartment =
      filterDepartment === 'all' || trainee.department === filterDepartment

    const matchesAssignmentStatus =
      filterAssignmentStatus === 'all' ||
      (filterAssignmentStatus === 'assigned' && trainee.enrolled) ||
      (filterAssignmentStatus === 'not-assigned' && !trainee.enrolled)

    return matchesSearch && matchesDepartment && matchesAssignmentStatus
  })

  const availableTraineesCount = traineesData.filter((t) => !t.enrolled).length

  const getCheckboxProps = (record) => ({
    disabled: record.enrolled,
    name: record.name,
  })

  const selectedTrainees = traineesData.filter((trainee) =>
    selectedRowKeys.includes(trainee.id),
  )

  const handleRemoveSelected = (traineeId) => {
    setSelectedRowKeys(selectedRowKeys.filter((id) => id !== traineeId))
  }

  const handleClearAllSelected = () => {
    setSelectedRowKeys([])
  }

  const traineeColumns = [
    {
      title: 'Full Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <Text>{text}</Text>,
      width: 220, // Fixed width for name column
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      render: (text) => <Text>{text}</Text>,
      width: 180, // Fixed width for department column
    },
    {
      title: 'Position',
      dataIndex: 'position',
      key: 'position',
      width: 200, // Fixed width for position column
    },
    {
      title: 'Status',
      dataIndex: 'enrolled',
      key: 'status',
      render: (enrolled, record) => {
        if (enrolled) {
          if (record.progress === 100) {
            return (
              <Tag icon={<CheckCircleOutlined />} color="success">
                Completed
              </Tag>
            )
          } else if (record.progress > 0) {
            return (
              <Tag icon={<ClockCircleOutlined />} color="processing">
                In Progress ({record.progress}%)
              </Tag>
            )
          } else {
            return (
              <Tag icon={<BookOutlined />} color="warning">
                Assigned
              </Tag>
            )
          }
        } else {
          return <Tag color="default">Not Assigned</Tag>
        }
      },
      width: 150, // Keep the 150px width for status column
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
            .filter((trainee) => !trainee.enrolled)
            .map((trainee) => trainee.id)
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

  const onShowSizeChange = (current, size) => {
    setPageSize(size)
  }

  return (
    <Modal
      title={`Add Course to Training Path - ${courseData?.course_title}`}
      open={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      width={800}
      okText={`Add to ${selectedRowKeys.length} Trainee${selectedRowKeys.length !== 1 ? 's' : ''}`}
      okButtonProps={{
        disabled: selectedRowKeys.length === 0,
        icon: <PlusCircleOutlined />,
      }}
      cancelText="Cancel"
    >
      <Alert
        message={`${availableTraineesCount} trainees available. Only trainees without this course in their path can be selected.`}
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
        banner
      />

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12}>
          <Input
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
            <Option value="all">All Departments</Option>
            {departments.map((dept) => (
              <Option key={dept} value={dept}>
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
            <Option value="all">All Statuses</Option>
            <Option value="assigned">Assigned</Option>
            <Option value="not-assigned">Not Assigned</Option>
          </Select>
        </Col>
      </Row>

      {selectedRowKeys.length > 0 && (
        <>
          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 8,
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
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                padding: '12px',
                background: '#f5f5f5',
                borderRadius: '4px',
                maxHeight: '120px',
                overflowY: 'auto',
              }}
            >
              {selectedTrainees.map((trainee) => (
                <Tag
                  key={trainee.id}
                  closable
                  onClose={() => handleRemoveSelected(trainee.id)}
                  style={{
                    padding: '4px 8px',
                    margin: '4px',
                  }}
                >
                  {trainee.name}
                </Tag>
              ))}
            </div>
          </div>
          <Divider style={{ margin: '12px 0' }} />
        </>
      )}

      <Table
        rowSelection={rowSelection}
        columns={traineeColumns}
        dataSource={filteredTrainees}
        rowKey="id"
        scroll={{ x: 750 }} // Enable horizontal scrolling based on column widths
        pagination={{
          pageSize: pageSize,
          showSizeChanger: true,
          pageSizeOptions: ['5', '8', '10', '15', '20'],
          onShowSizeChange: onShowSizeChange,
          showTotal: (total) => `Total ${total} trainees`,
        }}
        size="middle"
        bordered
        locale={{
          emptyText: 'No trainees match your search criteria',
          selectionAll: 'Select all available trainees',
        }}
      />
    </Modal>
  )
}

export default AddToTrainingPathModal
