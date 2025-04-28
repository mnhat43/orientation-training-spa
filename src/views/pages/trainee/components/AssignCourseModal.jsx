import React, { useState, useEffect } from 'react'
import {
  Modal,
  Form,
  Button,
  message,
  Spin,
  Input,
  Space,
  Tag,
  Card,
  Tabs,
  Badge,
  Typography,
  Row,
  Col,
  Empty,
  Divider,
  Tooltip,
} from 'antd'
import {
  BookOutlined,
  SearchOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  PlusOutlined,
  CloseOutlined,
  ClearOutlined,
} from '@ant-design/icons'

const { TabPane } = Tabs
const { Text } = Typography

const AssignCourseModal = ({
  visible,
  onClose,
  trainee = null,
  traineeIds = [],
  isBulkAssign = false,
  onSuccess,
}) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [courses, setCourses] = useState([])
  const [filteredCourses, setFilteredCourses] = useState([])
  const [selectedCourses, setSelectedCourses] = useState([])
  const [searchText, setSearchText] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')

  useEffect(() => {
    if (visible) {
      fetchAvailableCourses()
    }
  }, [visible])

  useEffect(() => {
    if (visible) {
      form.resetFields()
      setSelectedCourses([])
      setSearchText('')
      setActiveCategory('all')
    }
  }, [visible, form])

  useEffect(() => {
    let filtered = [...courses]

    if (searchText) {
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(searchText.toLowerCase()) ||
          course.description.toLowerCase().includes(searchText.toLowerCase()) ||
          course.category.toLowerCase().includes(searchText.toLowerCase()),
      )
    }

    if (activeCategory !== 'all') {
      filtered = filtered.filter((course) => course.category === activeCategory)
    }

    setFilteredCourses(filtered)
  }, [courses, searchText, activeCategory])

  const fetchAvailableCourses = async () => {
    try {
      setLoading(true)
      const mockCourses = [
        {
          id: 1,
          title: 'Introduction to Company',
          description: 'Learn about our company history and values',
          duration: '1 hour',
          category: 'Onboarding',
          level: 'Beginner',
          format: 'Video',
        },
        {
          id: 2,
          title: 'HR Policies',
          description: 'Overview of HR policies and procedures',
          duration: '2 hours',
          category: 'Compliance',
          level: 'Beginner',
          format: 'Document',
        },
        {
          id: 3,
          title: 'IT Security',
          description: 'IT security best practices and protocols',
          duration: '3 hours',
          category: 'Technical',
          level: 'Intermediate',
          format: 'Interactive',
        },
        {
          id: 4,
          title: 'Product Knowledge',
          description: 'Core product knowledge training',
          duration: '4 hours',
          category: 'Technical',
          level: 'Advanced',
          format: 'Video',
        },
        {
          id: 5,
          title: 'Customer Service',
          description: 'Customer service standards and practices',
          duration: '2 hours',
          category: 'Soft Skills',
          level: 'Intermediate',
          format: 'Interactive',
        },
        {
          id: 6,
          title: 'Communication Skills',
          description: 'Effective communication in the workplace',
          duration: '3 hours',
          category: 'Soft Skills',
          level: 'Beginner',
          format: 'Video',
        },
        {
          id: 7,
          title: 'Advanced Security Protocols',
          description: 'Advanced security measures and risk management',
          duration: '5 hours',
          category: 'Technical',
          level: 'Advanced',
          format: 'Document',
        },
      ]

      setCourses(mockCourses)
      setFilteredCourses(mockCourses)
    } catch (error) {
      message.error('Failed to load available courses')
    } finally {
      setLoading(false)
    }
  }

  const handleOk = async () => {
    try {
      if (selectedCourses.length === 0) {
        message.warning('Please select at least one course to assign')
        return
      }

      setLoading(true)

      const data = {
        courses: selectedCourses,
        trainees: isBulkAssign ? traineeIds : [trainee.id],
      }

      await new Promise((resolve) => setTimeout(resolve, 1000))

      message.success(
        isBulkAssign
          ? `${selectedCourses.length} courses assigned to ${traineeIds.length} trainees successfully`
          : `${selectedCourses.length} courses assigned to ${trainee.name} successfully`,
      )

      onSuccess()
      onClose()
    } catch (error) {
      console.error('Failed to assign courses:', error)
      message.error('Failed to assign courses. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const toggleCourseSelection = (courseId) => {
    if (selectedCourses.includes(courseId)) {
      setSelectedCourses(selectedCourses.filter((id) => id !== courseId))
    } else {
      setSelectedCourses([...selectedCourses, courseId])
    }
  }

  const removeSelectedCourse = (courseId) => {
    setSelectedCourses(selectedCourses.filter((id) => id !== courseId))
  }

  const clearAllSelectedCourses = () => {
    setSelectedCourses([])
  }

  const categories = [
    'all',
    ...new Set(courses.map((course) => course.category)),
  ]

  const getSelectedCourses = () => {
    return selectedCourses
      .map((id) => courses.find((course) => course.id === id))
      .filter(Boolean)
  }

  return (
    <Modal
      title={
        <Space>
          <BookOutlined style={{ color: '#1890ff', fontSize: '20px' }} />
          <span>
            {isBulkAssign
              ? `Assign Courses to Trainees (${traineeIds.length})`
              : `Assign Courses to ${trainee?.name}`}
          </span>
        </Space>
      }
      visible={visible}
      onCancel={onClose}
      width={900}
      centered
      styles={{
        body: { padding: '16px 24px', maxHeight: '70vh', overflowY: 'auto' },
      }}
      footer={[
        <Button key="back" onClick={onClose}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleOk}
          disabled={selectedCourses.length === 0}
        >
          Assign{' '}
          {selectedCourses.length > 0 ? `(${selectedCourses.length})` : ''}
        </Button>,
      ]}
    >
      <Spin spinning={loading}>
        <div
          className="selected-courses-section"
          style={{
            marginBottom: 16,
            borderRadius: '6px',
            border: selectedCourses.length > 0 ? '1px solid #d9d9d9' : 'none',
            padding: selectedCourses.length > 0 ? '12px' : '0',
            background: selectedCourses.length > 0 ? '#fafafa' : 'transparent',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: selectedCourses.length > 0 ? 12 : 8,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Badge
                count={selectedCourses.length}
                style={{ backgroundColor: '#1890ff', marginRight: 8 }}
              />
              <Text strong style={{ fontSize: '16px' }}>
                Selected Courses
              </Text>
            </div>
            {selectedCourses.length > 0 && (
              <Button
                type="text"
                size="small"
                danger
                icon={<ClearOutlined />}
                onClick={clearAllSelectedCourses}
              >
                Clear All
              </Button>
            )}
          </div>

          {selectedCourses.length > 0 ? (
            <div
              className="selected-courses-container"
              style={{
                padding: '8px 12px',
                background: '#f0f8ff',
                borderRadius: '6px',
                border: '1px solid #91d5ff',
                maxHeight: '120px',
                overflowY: 'auto',
              }}
            >
              {getSelectedCourses().map((course) => (
                <Tag
                  key={course.id}
                  closable
                  onClose={(e) => {
                    e.preventDefault()
                    removeSelectedCourse(course.id)
                  }}
                  style={{ margin: '3px', padding: '4px 8px' }}
                  color="blue"
                  closeIcon={<CloseOutlined style={{ fontSize: '10px' }} />}
                >
                  {course.title}
                </Tag>
              ))}
            </div>
          ) : (
            <Text type="secondary" style={{ fontStyle: 'italic' }}>
              No courses selected yet. Click on a course to select it.
            </Text>
          )}
        </div>

        <Divider style={{ margin: '12px 0' }} />

        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={16}>
            <Input
              placeholder="Search courses..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col span={8}>
            <Text type="secondary">
              {filteredCourses.length}{' '}
              {filteredCourses.length === 1 ? 'course' : 'courses'} available
            </Text>
          </Col>
        </Row>

        <Tabs
          activeKey={activeCategory}
          onChange={setActiveCategory}
          type="card"
          size="small"
          style={{ marginBottom: 16 }}
        >
          {categories.map((category) => (
            <TabPane
              tab={
                <>
                  {category.charAt(0).toUpperCase() + category.slice(1)}{' '}
                  <Badge
                    count={
                      category === 'all'
                        ? courses.length
                        : courses.filter((c) => c.category === category).length
                    }
                    size="small"
                    style={{
                      marginLeft: 4,
                      fontSize: '10px',
                      padding: '0 4px',
                      backgroundColor:
                        category === activeCategory ? '#1890ff' : '#999',
                    }}
                  />
                </>
              }
              key={category}
            />
          ))}
        </Tabs>

        {filteredCourses.length === 0 ? (
          <Empty description="No courses match your filters" />
        ) : (
          <div className="course-card-container">
            <Row gutter={[12, 12]}>
              {filteredCourses.map((course) => (
                <Col xs={24} sm={12} md={8} key={course.id}>
                  <Card
                    hoverable
                    size="small"
                    className={
                      selectedCourses.includes(course.id)
                        ? 'course-card-selected'
                        : 'course-card'
                    }
                    style={{
                      borderLeft: selectedCourses.includes(course.id)
                        ? '3px solid #1890ff'
                        : 'none',
                      backgroundColor: selectedCourses.includes(course.id)
                        ? '#f0f8ff'
                        : 'white',
                    }}
                    onClick={() => toggleCourseSelection(course.id)}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div style={{ flex: 1, paddingRight: '8px' }}>
                        <Tooltip title={course.title}>
                          <Text
                            strong
                            ellipsis
                            style={{ fontSize: '14px', display: 'block' }}
                          >
                            {course.title}
                          </Text>
                        </Tooltip>
                        <Tooltip title={course.description}>
                          <Text
                            type="secondary"
                            style={{
                              fontSize: '12px',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              height: '36px',
                              marginTop: '4px',
                              marginBottom: '8px',
                              lineHeight: '18px',
                              wordBreak: 'break-word',
                            }}
                          >
                            {course.description}
                          </Text>
                        </Tooltip>
                        <div style={{ marginTop: '4px' }}>
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            <ClockCircleOutlined
                              style={{ marginRight: '4px' }}
                            />
                            {course.duration} · {course.category}
                          </Text>
                        </div>
                      </div>
                      <div style={{ padding: '0 0 0 4px' }}>
                        <Button
                          type={
                            selectedCourses.includes(course.id)
                              ? 'primary'
                              : 'default'
                          }
                          shape="circle"
                          size="small"
                          icon={
                            selectedCourses.includes(course.id) ? (
                              <CheckCircleOutlined />
                            ) : (
                              <PlusOutlined />
                            )
                          }
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleCourseSelection(course.id)
                          }}
                        />
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        )}
      </Spin>
    </Modal>
  )
}

export default AssignCourseModal
