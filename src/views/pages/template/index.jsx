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
  Dropdown,
  Menu,
  Divider,
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
} from '@ant-design/icons'
import TemplateDetails from './components/TemplateDetails'
import './index.scss'

const { Title, Text } = Typography
const { Search } = Input
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
    setTimeout(() => {
      setTemplates([
        {
          id: 1,
          name: 'Frontend Developer',
          description:
            'Comprehensive learning path for frontend developers covering HTML, CSS, JavaScript, and modern frameworks.',
          courses: 5,
          duration: 8,
        },
        {
          id: 2,
          name: 'Backend Developer',
          description:
            'Complete training for backend development skills including APIs, databases, and server architecture.',
          courses: 7,
          duration: 10,
        },
        {
          id: 3,
          name: 'Full Stack Developer',
          description:
            'End-to-end web development training covering both frontend and backend technologies.',
          courses: 12,
          duration: 16,
        },
        {
          id: 4,
          name: 'DevOps Engineer',
          description:
            'Training for DevOps practices, CI/CD pipelines, and cloud infrastructure management.',
          courses: 8,
          duration: 12,
        },
        {
          id: 5,
          name: 'Data Scientist',
          description:
            'Comprehensive data science curriculum covering statistics, machine learning, and data visualization.',
          courses: 10,
          duration: 14,
        },
        {
          id: 6,
          name: 'Mobile App Developer',
          description:
            'Training for iOS and Android application development using React Native.',
          courses: 6,
          duration: 9,
        },
        {
          id: 7,
          name: 'UI/UX Designer',
          description:
            'Design principles, user research, wireframing, and prototyping for creating effective user interfaces.',
          courses: 9,
          duration: 11,
        },
        {
          id: 8,
          name: 'QA Engineer',
          description:
            'Quality assurance methodologies, test planning, and automation frameworks.',
          courses: 7,
          duration: 9,
        },
        {
          id: 9,
          name: 'Project Manager',
          description:
            'Project management methodologies, team leadership, and resource planning.',
          courses: 8,
          duration: 10,
        },
        {
          id: 10,
          name: 'Cybersecurity Specialist',
          description:
            'Network security, penetration testing, and security compliance.',
          courses: 11,
          duration: 14,
        },
      ])
      setLoading(false)
    }, 1000)
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
        setTimeout(() => {
          setTemplates(templates.filter((item) => item.id !== id))
          message.success('Template deleted successfully')
          setLoading(false)
        }, 500)
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
      width: 300,
      ellipsis: true,
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
    },
    {
      title: 'Courses',
      dataIndex: 'courses',
      key: 'courses',
      width: 100,
      render: (text) => (
        <Tag color="blue" className="courses-tag">
          <BookOutlined /> {text}
        </Tag>
      ),
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
      width: 100,
      render: (text) => (
        <span className="duration-text">
          <ClockCircleOutlined /> {text} hours
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
      <div className="templates-content-section">
        <div className="templates-toolbar">
          <Search
            placeholder="Search templates"
            allowClear
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onSearch={(value) => setSearchText(value)}
            className="template-search"
            size="middle"
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
            className="create-template-btn"
            size="middle"
          >
            Create Template
          </Button>
        </div>

        <div className="templates-table-container">
          <Table
            columns={columns}
            dataSource={filteredTemplates}
            rowKey="id"
            loading={loading}
            pagination={pagination}
            onChange={handleTableChange}
            className="templates-table compact-table"
            size="small"
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
        </div>
      </div>

      <TemplateDetails
        template={currentTemplate}
        drawerVisible={drawerVisible}
        setDrawerVisible={setDrawerVisible}
      />
    </div>
  )
}

export default TemplatePage
