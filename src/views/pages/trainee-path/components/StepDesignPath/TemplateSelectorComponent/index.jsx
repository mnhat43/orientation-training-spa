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
import { formatTime } from '@helpers/common'
import apiTemplatepath from '@api/templatepath'
import TemplatePreviewModal from './TemplatePreviewModal'
import './index.scss'

const { Title, Paragraph } = Typography
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
  const [previewLoading, setPreviewLoading] = useState(false)

  // Fetch templates
  useEffect(() => {
    if (templateDrawerVisible) {
      fetchTemplates()
    }
  }, [templateDrawerVisible])

  const fetchTemplates = () => {
    setLoading(true)

    apiTemplatepath
      .getTemplatePathList()
      .then((response) => {
        if (response && response.data && response.status == 1) {
          setTemplates(response.data)
        } else {
          setTemplates([])
        }
      })
      .catch((error) => {
        console.error('Failed to load templates:', error)
        setTemplates([])
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const filteredTemplates = templates.filter(
    (template) =>
      searchText === '' ||
      template.name.toLowerCase().includes(searchText.toLowerCase()) ||
      template.description.toLowerCase().includes(searchText.toLowerCase()),
  )

  const isTemplateSelected = (templateId) => {
    return selectedTemplates.some((template) => template.id === templateId)
  }

  const handleSelectTemplate = (template) => {
    if (!isTemplateSelected(template.id)) {
      setSelectedTemplates([...selectedTemplates, template])

      const newCourses = template.course_ids.map((courseId, index) => ({
        id: courseId,
        title: `Course ${courseId}`,
        description: `Description for Course ${courseId}`,
        category: 'Development',
        duration: Math.floor(Math.random() * 3600) + 1800,
        position: index,
      }))

      const filteredNewCourses = newCourses.filter(
        (newCourse) =>
          !selectedCourses.some((course) => course.id === newCourse.id),
      )

      if (filteredNewCourses.length > 0) {
        setSelectedCourses([...selectedCourses, ...filteredNewCourses])
      }
    }
  }

  const handleRemoveTemplate = (templateId) => {
    const templateToRemove = selectedTemplates.find((t) => t.id === templateId)

    if (templateToRemove) {
      setSelectedTemplates(selectedTemplates.filter((t) => t.id !== templateId))

      const courseIdsToRemove = templateToRemove.course_ids
      setSelectedCourses(
        selectedCourses.filter((c) => !courseIdsToRemove.includes(c.id)),
      )
    }
  }

  // Preview template details with API call
  const showTemplatePreview = (template) => {
    setPreviewLoading(true)
    setPreviewModalVisible(true)

    apiTemplatepath
      .getTemplatePath({ id: template.id })
      .then((response) => {
        if (response && response.status === 1 && response.data) {
          setPreviewTemplate(response.data)
        } else {
          // Fallback to basic template data if full data can't be loaded
          setPreviewTemplate(template)
          console.error(
            'Failed to load template details:',
            response?.message || 'Unknown error',
          )
        }
      })
      .catch((error) => {
        console.error('Error fetching template details:', error)
        setPreviewTemplate(template) // Fallback to basic data
      })
      .finally(() => {
        setPreviewLoading(false)
      })
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
                              {template.name}
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
                                <BookOutlined /> {template.course_ids.length}{' '}
                                courses
                              </div>
                              <div className="meta-item">
                                <ClockCircleOutlined />{' '}
                                {formatTime(template.duration)}
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
        onCancel={() => {
          setPreviewModalVisible(false)
          setPreviewTemplate(null)
        }}
        isSelected={
          previewTemplate ? isTemplateSelected(previewTemplate.id) : false
        }
        formatTime={formatTime}
        loading={previewLoading}
      />
    </Drawer>
  )
}

export default TemplateSelector
