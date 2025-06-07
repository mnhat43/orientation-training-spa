import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Button,
  Space,
  Typography,
  message,
  Input,
  Table,
  Tooltip,
  Tag,
  Modal,
  Row,
  Col,
} from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ClockCircleOutlined,
  BookOutlined,
  FileTextOutlined,
  ExclamationCircleOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import templatepath from '@api/templatepath'
import TemplateDetails from './components/TemplateDetails'
import { formatTime } from '@helpers/common'
import './index.scss'

const { Title, Text } = Typography
const { confirm } = Modal

const TemplatePage = () => {
  const navigate = useNavigate()
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [currentTemplate, setCurrentTemplate] = useState(null)
  const [searchText, setSearchText] = useState('')
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    showSizeChanger: true,
    pageSizeOptions: ['5', '10', '20', '50'],
    showTotal: (total) => `Total ${total} templates`,
  })

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = () => {
    setLoading(true)
    templatepath
      .getTemplatePathList()
      .then((response) => {
        if (response && response.data) {
          setTemplates(response.data)
        } else {
          setTemplates([])
        }
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching templates:', error)
        setTemplates([])
        setLoading(false)
      })
  }

  const filteredTemplates = templates.filter(
    (template) =>
      searchText === '' ||
      template.name.toLowerCase().includes(searchText.toLowerCase()) ||
      template.description.toLowerCase().includes(searchText.toLowerCase()),
  )

  const handleAdd = () => {
    navigate('/templates/new')
  }

  const handleEdit = (template) => {
    navigate(`/templates/${template.id}/edit`)
  }

  const handleView = (template) => {
    setCurrentTemplate(template)
    setDrawerVisible(true)
  }

  const handleDelete = (id) => {
    confirm({
      title: 'Are you sure you want to delete this template?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        setLoading(true)
        templatepath
          .deleteTemplatePath({ id: parseInt(id) })
          .then((response) => {
            if (response && response.status === 1) {
              setTemplates(templates.filter((item) => item.id !== id))
              message.success('Template deleted successfully')
            } else {
              message.error(
                'Failed to delete template: ' +
                  (response?.message || 'Unknown error'),
              )
            }
          })
          .catch((error) => {
            console.error('Error deleting template:', error)
            message.error('Failed to delete template')
          })
          .finally(() => {
            setLoading(false)
          })
      },
    })
  }

  const handleTableChange = (pagination) => {
    setPagination({
      ...pagination,
    })
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 350,
      ellipsis: true,
      align: 'left',
      render: (text, record) => (
        <a className="template-name-link" onClick={() => handleView(record)}>
          {text}
        </a>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      align: 'left',
    },
    {
      title: 'Courses',
      dataIndex: 'course_ids',
      key: 'course_ids',
      width: 100,
      align: 'center',
      render: (course_ids) => (
        <Tag color="blue" className="courses-tag">
          <BookOutlined /> {course_ids.length}
        </Tag>
      ),
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
      width: 100,
      align: 'center',
      render: (duration) => (
        <span className="duration-text">
          <ClockCircleOutlined /> {formatTime(duration)}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 200,
      align: 'center',
      render: (_, record) => (
        <Space size="small" className="template-actions">
          <Tooltip title="View Details">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleView(record)}
              className="action-btn view-btn"
            />
          </Tooltip>
          <Tooltip title="Edit Template">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              className="action-btn edit-btn"
            />
          </Tooltip>
          <Tooltip title="Delete Template">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id)}
              className="action-btn delete-btn"
            />
          </Tooltip>
        </Space>
      ),
    },
  ]

  return (
    <div className="template-page-container">
      <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
        <Col xs={24} sm={24} md={16} lg={16} xl={16}>
          <Input
            placeholder="Search templates"
            allowClear
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            prefix={<SearchOutlined />}
            style={{ height: '42px' }}
          />
        </Col>
        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
            style={{ height: '42px' }}
          >
            Create Template
          </Button>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={filteredTemplates}
        rowKey="id"
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
        locale={{
          emptyText: (
            <div className="empty-table-content">
              <FileTextOutlined className="empty-icon" />
              <Title level={5}>No Templates Found</Title>
              <Text type="secondary">
                Create your first template or adjust your search criteria
              </Text>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAdd}
                className="create-first-template"
              >
                Create Template
              </Button>
            </div>
          ),
        }}
      />
      <TemplateDetails
        template={currentTemplate}
        drawerVisible={drawerVisible}
        setDrawerVisible={setDrawerVisible}
      />
    </div>
  )
}

export default TemplatePage
