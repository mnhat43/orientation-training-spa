import React, { useState, useEffect } from 'react'
import {
  Card,
  List,
  Tag,
  Button,
  Typography,
  Input,
  Empty,
  Spin,
  Select,
  Pagination,
  Row,
  Col,
  Tabs,
  Badge,
  Tooltip,
  Drawer,
} from 'antd'
import {
  BookOutlined,
  SearchOutlined,
  FileTextOutlined,
  CheckOutlined,
  ScheduleOutlined,
  FilterOutlined,
  CloseCircleFilled,
} from '@ant-design/icons'
import { CATEGORY_COLORS } from '@constants'
import './index.scss'
import TemplatePreviewModal from './TemplatePreviewModal'

const { Text, Paragraph } = Typography
const { Option } = Select

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
  const [activeTab, setActiveTab] = useState('all')

  const [searchText, setSearchText] = useState('')
  const [categoryFilter, setCategoryFilter] = useState(null)

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(6)

  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewTemplate, setPreviewTemplate] = useState(null)

  useEffect(() => {
    if (templateDrawerVisible) {
      const fetchTemplates = async () => {
        setLoading(true)
        try {
          setTimeout(() => {
            const categories = [
              'Engineering',
              'Marketing',
              'Sales',
              'HR',
              'Design',
              'Product',
              'Leadership',
            ]

            const mockTemplates = Array(20)
              .fill()
              .map((_, i) => {
                const randomCategory =
                  categories[Math.floor(Math.random() * categories.length)]
                const courseCount = Math.floor(Math.random() * 8) + 3

                return {
                  id: `template-${i + 1}`,
                  title: `${randomCategory} ${['Onboarding', 'Training', 'Fundamentals', 'Advanced', 'Essentials'][Math.floor(Math.random() * 5)]} ${i + 1}`,
                  description: `${['Standard', 'Core', 'Essential', 'Comprehensive', 'Basic'][Math.floor(Math.random() * 5)]} ${randomCategory.toLowerCase()} training for ${['new hires', 'experienced staff', 'managers', 'team members', 'specialists'][Math.floor(Math.random() * 5)]}.`,
                  category: randomCategory,
                  createdAt: new Date(
                    Date.now() - Math.floor(Math.random() * 10000000000),
                  ),
                  popularity: Math.floor(Math.random() * 100),
                  courses: Array(courseCount)
                    .fill()
                    .map((_, j) => ({
                      id: Number(j + 1),
                      title: `${randomCategory} Course ${j + 1}`,
                      description: `Description for ${randomCategory} Course ${j + 1}`,
                      category: randomCategory,
                      duration: `${Math.floor(Math.random() * 5) + 1} hours`,
                      position: j,
                    })),
                }
              })

            setTemplates(mockTemplates)
            setLoading(false)
          }, 1000)
        } catch (error) {
          console.error('Failed to load templates:', error)
          setLoading(false)
        }
      }

      fetchTemplates()
      setCurrentPage(1)
    }
  }, [templateDrawerVisible])

  const isTemplateSelected = (templateId) => {
    return selectedTemplates.some((template) => template.id === templateId)
  }

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

  const showPreview = (template) => {
    setPreviewTemplate(template)
    setPreviewVisible(true)
  }

  const closePreview = () => {
    setPreviewVisible(false)
  }

  const getFilteredTemplates = () => {
    let filtered = [...templates]

    if (activeTab === 'applied') {
      filtered = filtered.filter((t) => isTemplateSelected(t.id))
    }

    if (searchText) {
      const lowerSearch = searchText.toLowerCase()
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(lowerSearch) ||
          t.description.toLowerCase().includes(lowerSearch),
      )
    }

    if (categoryFilter) {
      filtered = filtered.filter((t) => t.category === categoryFilter)
    }

    return filtered
  }

  const getCategories = () => {
    const categories = [...new Set(templates.map((t) => t.category))]
    return categories
  }

  const filteredTemplates = getFilteredTemplates()
  const paginatedTemplates = filteredTemplates.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  )

  const tabItems = [
    {
      key: 'all',
      label: 'All Templates',
    },
    {
      key: 'applied',
      label: (
        <Badge count={selectedTemplates.length} size="small" offset={[10, 0]}>
          Applied Templates
        </Badge>
      ),
    },
  ]

  return (
    <Drawer
      title="Apply Template to Learning Path"
      placement="right"
      onClose={() => setTemplateDrawerVisible(false)}
      open={templateDrawerVisible}
      width={800}
      styles={{
        body: {
          paddingTop: 0,
        },
      }}
    >
      <div className="template-selector">
        <div className="filter-controls">
          <Row gutter={[16, 16]} align="middle">
            <Col flex="auto">
              <Input
                placeholder="Search templates..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
              />
            </Col>

            <Col>
              <Select
                placeholder="Filter by category"
                style={{ width: '100%' }}
                onChange={setCategoryFilter}
                value={categoryFilter}
                allowClear
                suffixIcon={<FilterOutlined />}
              >
                {getCategories().map((category) => (
                  <Option key={category} value={category}>
                    {category}
                  </Option>
                ))}
              </Select>
            </Col>
          </Row>
        </div>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          className="template-tabs"
          items={tabItems}
        />

        {loading ? (
          <div className="template-loading">
            <Spin size="large" />
            <Text style={{ marginTop: 16 }}>Loading templates...</Text>
          </div>
        ) : (
          <div className="template-list-wrapper">
            <List
              className="template-scrollable-list"
              grid={{
                gutter: 16,
                xs: 1,
                sm: 1,
                md: 2,
                lg: 2,
                xl: 2,
                xxl: 2,
              }}
              dataSource={paginatedTemplates}
              renderItem={(template) => {
                const selected = isTemplateSelected(template.id)

                return (
                  <List.Item>
                    <Card
                      hoverable
                      className={`template-card ${selected ? 'selected' : ''}`}
                      onClick={() => showPreview(template)}
                    >
                      {selected && (
                        <div className="selected-badge">
                          <CheckOutlined /> Applied
                        </div>
                      )}

                      <div className="template-header">
                        <div className="title-container">
                          <FileTextOutlined className="template-icon" />
                          <Tooltip title={template.title}>
                            <div className="single-line-title">
                              {template.title}
                            </div>
                          </Tooltip>
                        </div>
                        <Tag
                          color={CATEGORY_COLORS[template.category] || 'blue'}
                          className="template-category"
                        >
                          {template.category}
                        </Tag>
                      </div>

                      <Paragraph
                        ellipsis={{
                          rows: 2,
                          expandable: false,
                          tooltip: template.description,
                        }}
                        className="template-description"
                      >
                        {template.description}
                      </Paragraph>

                      <div className="template-meta">
                        <Text type="secondary">
                          <BookOutlined /> {template.courses.length} courses
                        </Text>
                        <Text type="secondary">
                          <ScheduleOutlined />
                          {template.courses.reduce((sum, course) => {
                            const durationMatch =
                              course.duration?.match(/(\d+)/)
                            return (
                              sum +
                              (durationMatch
                                ? parseInt(durationMatch[1], 10)
                                : 0)
                            )
                          }, 0)}{' '}
                          hours
                        </Text>
                      </div>

                      <div className="template-actions">
                        {selected ? (
                          <Button
                            danger
                            onClick={(e) => {
                              e.stopPropagation()
                              handleRemoveTemplate(template.id)
                            }}
                            icon={<CloseCircleFilled />}
                          >
                            Remove
                          </Button>
                        ) : (
                          <Button
                            type="primary"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleSelectTemplate(template)
                            }}
                            icon={<CheckOutlined />}
                          >
                            Apply
                          </Button>
                        )}
                      </div>
                    </Card>
                  </List.Item>
                )
              }}
              locale={{
                emptyText: (
                  <Empty
                    description={
                      <span>
                        {activeTab === 'applied' &&
                        selectedTemplates.length === 0
                          ? 'No templates have been applied yet'
                          : 'No templates found matching your criteria'}
                      </span>
                    }
                  />
                ),
              }}
            />

            {filteredTemplates.length > pageSize && (
              <div className="template-pagination">
                <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  total={filteredTemplates.length}
                  onChange={(page) => setCurrentPage(page)}
                  showSizeChanger
                  pageSizeOptions={['6', '12', '24']}
                  onShowSizeChange={(current, size) => {
                    setPageSize(size)
                    setCurrentPage(1)
                  }}
                />
              </div>
            )}
          </div>
        )}

        <TemplatePreviewModal
          visible={previewVisible}
          template={previewTemplate}
          onCancel={closePreview}
          onApply={handleSelectTemplate}
          isSelected={
            previewTemplate ? isTemplateSelected(previewTemplate.id) : false
          }
        />
      </div>
    </Drawer>
  )
}

export default TemplateSelector
