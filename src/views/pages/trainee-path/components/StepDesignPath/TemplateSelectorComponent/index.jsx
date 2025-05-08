import React, { useState, useEffect } from 'react'
import {
  Card,
  Button,
  Typography,
  Input,
  Empty,
  Spin,
  Drawer,
  List,
  Badge,
  Space,
  Tooltip,
} from 'antd'
import {
  BookOutlined,
  ClockCircleOutlined,
  CheckOutlined,
  CloseOutlined,
  SearchOutlined,
  EyeOutlined,
} from '@ant-design/icons'
import TemplatePreviewModal from './TemplatePreviewModal'
import './index.scss'

const { Title, Text, Paragraph } = Typography
const { Search } = Input

const TemplateSelector = ({
  selectedCourses,
  setSelectedCourses,
  selectedTemplates,
  setSelectedTemplates,
  templateDrawerVisible,
  setTemplateDrawerVisible,
}) => {
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [previewModalVisible, setPreviewModalVisible] = useState(false)
  const [previewTemplate, setPreviewTemplate] = useState(null)

  // Fetch templates
  useEffect(() => {
    if (templateDrawerVisible) {
      fetchTemplates()
    }
  }, [templateDrawerVisible])

  const fetchTemplates = async () => {
    setLoading(true)
    try {
      setTimeout(() => {
        const mockTemplates = Array(20)
          .fill()
          .map((_, i) => {
            const courseCount = Math.floor(Math.random() * 5) + 2

            return {
              id: `template-${i + 1}`,
              title: `Training Template ${i + 1}`,
              description: `This template contains essential training materials for new employees. It covers fundamental skills and knowledge required for onboarding.`,
              courses: Array(courseCount)
                .fill()
                .map((_, j) => ({
                  id: `course-${i}-${j}`,
                  title: `Course ${j + 1}`,
                  description: `Description for Course ${j + 1}`,
                  category: `Development`,
                  duration: `${Math.floor(Math.random() * 5) + 1} hours`,
                  position: j,
                })),
            }
          })

        setTemplates(mockTemplates)
        setLoading(false)
      }, 800)
    } catch (error) {
      console.error('Failed to load templates:', error)
      setLoading(false)
    }
  }

  const filteredTemplates = templates.filter(
    (template) =>
      searchText === '' ||
      template.title.toLowerCase().includes(searchText.toLowerCase()) ||
      template.description.toLowerCase().includes(searchText.toLowerCase()),
  )

  // Check if a template is selected
  const isTemplateSelected = (templateId) => {
    return selectedTemplates.some((template) => template.id === templateId)
  }

  // Calculate total hours from all courses
  const calculateTotalHours = (courses) => {
    return courses.reduce((total, course) => {
      const match = course.duration?.match(/(\d+)/)
      return total + (match ? parseInt(match[1], 10) : 0)
    }, 0)
  }

  // Handle selecting a template
  const handleSelectTemplate = (template) => {
    if (!isTemplateSelected(template.id)) {
      setSelectedTemplates([...selectedTemplates, template])

      const newCourses = template.courses.filter(
        (templateCourse) =>
          !selectedCourses.some((course) => course.id === templateCourse.id),
      )

      if (newCourses.length > 0) {
        setSelectedCourses([...selectedCourses, ...newCourses])
      }
    }
  }

  // Handle removing a template
  const handleRemoveTemplate = (templateId) => {
    const templateToRemove = selectedTemplates.find((t) => t.id === templateId)

    if (templateToRemove) {
      setSelectedTemplates(selectedTemplates.filter((t) => t.id !== templateId))

      const courseIdsToRemove = templateToRemove.courses.map((c) => c.id)
      setSelectedCourses(
        selectedCourses.filter((c) => !courseIdsToRemove.includes(c.id)),
      )
    }
  }

  // Preview template details
  const showTemplatePreview = (template) => {
    setPreviewTemplate(template)
    setPreviewModalVisible(true)
  }

  return (
    <Drawer
      title={
        <div className="drawer-title">
          <span>Template Library</span>
          {selectedTemplates.length > 0 && (
            <Badge count={selectedTemplates.length} style={{ marginLeft: 8 }} />
          )}
        </div>
      }
      placement="right"
      onClose={() => setTemplateDrawerVisible(false)}
      open={templateDrawerVisible}
      width={650}
      footer={
        <div className="drawer-footer">
          <Button onClick={() => setTemplateDrawerVisible(false)}>
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={() => setTemplateDrawerVisible(false)}
            disabled={selectedTemplates.length === 0}
          >
            Apply Templates ({selectedTemplates.length})
          </Button>
        </div>
      }
    >
      <div className="simplified-template-selector">
        {/* Search box */}
        <div className="template-search-container">
          <Search
            placeholder="Search templates..."
            allowClear
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="template-search"
            prefix={<SearchOutlined />}
          />
        </div>

        {/* Templates List */}
        <div className="templates-list-container">
          {loading ? (
            <div className="templates-loading">
              <Spin size="large" />
            </div>
          ) : filteredTemplates.length === 0 ? (
            <Empty description="No templates match your search" />
          ) : (
            <List
              className="templates-list"
              dataSource={filteredTemplates}
              renderItem={(template) => {
                const isSelected = isTemplateSelected(template.id)
                const totalHours = calculateTotalHours(template.courses)

                return (
                  <List.Item className="template-list-item">
                    <Card
                      className={`template-card ${isSelected ? 'selected' : ''}`}
                      bodyStyle={{ padding: '12px 16px' }}
                    >
                      <div className="template-card-content">
                        <div className="template-info">
                          <div className="template-title-container">
                            <Title level={5} className="template-title">
                              {template.title}
                            </Title>

                            <div className="template-actions">
                              <Space>
                                <Tooltip title="View Details">
                                  <Button
                                    type="text"
                                    icon={<EyeOutlined />}
                                    onClick={() =>
                                      showTemplatePreview(template)
                                    }
                                    className="preview-btn"
                                    size="small"
                                  />
                                </Tooltip>

                                {isSelected ? (
                                  <Button
                                    danger
                                    type="primary"
                                    icon={<CloseOutlined />}
                                    onClick={() =>
                                      handleRemoveTemplate(template.id)
                                    }
                                    size="small"
                                  >
                                    Remove
                                  </Button>
                                ) : (
                                  <Button
                                    type="primary"
                                    icon={<CheckOutlined />}
                                    onClick={() =>
                                      handleSelectTemplate(template)
                                    }
                                    size="small"
                                  >
                                    Apply
                                  </Button>
                                )}
                              </Space>
                            </div>
                          </div>

                          <Paragraph
                            ellipsis={{ rows: 2 }}
                            className="template-description"
                          >
                            {template.description}
                          </Paragraph>

                          <div className="template-meta">
                            <Space size="large">
                              <div className="meta-item">
                                <BookOutlined /> {template.courses.length}{' '}
                                courses
                              </div>
                              <div className="meta-item">
                                <ClockCircleOutlined /> {totalHours} hours
                              </div>
                            </Space>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </List.Item>
                )
              }}
            />
          )}
        </div>
      </div>

      <TemplatePreviewModal
        visible={previewModalVisible}
        template={previewTemplate}
        onCancel={() => setPreviewModalVisible(false)}
        isSelected={
          previewTemplate ? isTemplateSelected(previewTemplate.id) : false
        }
      />
    </Drawer>
  )
}

export default TemplateSelector
