import React, { useState, useEffect } from 'react'
import {
  Card,
  Input,
  Select,
  Button,
  Tag,
  Empty,
  Badge,
  Typography,
  Divider,
  List,
} from 'antd'
import {
  SearchOutlined,
  PlusOutlined,
  FilterOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  MinusOutlined,
  FileTextOutlined,
  TagOutlined,
} from '@ant-design/icons'
import './CourseSelectionPanel.scss'
import { CATEGORIES, CATEGORY_COLORS } from '@constants'
import courseApi from '@api/course'
import { formatTime } from '@helpers/common'

const { Option } = Select
const { Paragraph } = Typography

const CourseSelectionPanel = ({
  selectedCourses,
  setSelectedCourses,
  isShowTemplate = false,
  setTemplateDrawerVisible,
}) => {
  const [searchText, setSearchText] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [availableCourses, setAvailableCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = () => {
    setLoading(true)
    courseApi
      .getListCourse()
      .then((response) => {
        if (response && response.data) {
          setAvailableCourses(response.data.courses)
        } else {
          setAvailableCourses([])
        }
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching courses:', error)
        setAvailableCourses([])
        setLoading(false)
      })
  }

  const selectedCourseIds = selectedCourses.map((course) => course.course_id)

  const filteredCourses = availableCourses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchText.toLowerCase()) ||
      course.description.toLowerCase().includes(searchText.toLowerCase())

    const matchesCategory =
      categoryFilter === 'all' || course.category === categoryFilter

    return matchesSearch && matchesCategory
  })

  const handleCourseToggle = (course) => {
    const isSelected = selectedCourseIds.includes(course.course_id)

    if (isSelected) {
      setSelectedCourses(
        selectedCourses.filter((c) => c.course_id !== course.course_id),
      )
    } else {
      setSelectedCourses([...selectedCourses, course])
    }
  }

  return (
    <Card
      className="available-courses-card"
      title={
        <div className="card-title-with-count">
          <span>Available Courses</span>
          <Badge
            count={filteredCourses.length}
            style={{ backgroundColor: '#1890ff' }}
            title="Available courses"
          />
        </div>
      }
      extra={
        isShowTemplate && (
          <Button
            type="primary"
            ghost
            icon={<FileTextOutlined />}
            onClick={() => setTemplateDrawerVisible(true)}
            style={{ marginRight: 8 }}
          >
            Apply Template
          </Button>
        )
      }
    >
      <div className="filter-section">
        <div className="search-filter-container">
          <Input
            placeholder="Search courses by name or description"
            allowClear
            onChange={(e) => setSearchText(e.target.value)}
            className="search-input"
            prefix={<SearchOutlined />}
            size="middle"
          />

          <Select
            defaultValue="all"
            value={categoryFilter}
            onChange={(value) => setCategoryFilter(value)}
            className="filter-select"
            suffixIcon={<FilterOutlined />}
            size="middle"
          >
            <Option value="all">All Categories</Option>
            <Option value="Onboarding">Onboarding Essentials</Option>
            <Option value="Company">Company Policies</Option>
            <Option value="Technical">Technical Skills</Option>
            <Option value="Soft">Soft Skills</Option>
            <Option value="Compliance">Compliance</Option>
          </Select>
        </div>
      </div>

      <div className="courses-list">
        <List
          loading={loading}
          dataSource={filteredCourses}
          locale={{
            emptyText: (
              <Empty
                description="No courses match your filters"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ),
          }}
          grid={{
            gutter: 16,
            xs: 1,
            sm: 1,
            md: 1,
            lg: 1,
            xl: 1,
            xxl: 1,
          }}
          renderItem={(course) => {
            const isSelected = selectedCourseIds.includes(course.course_id)

            return (
              <List.Item>
                <div
                  className={`course-item ${isSelected ? 'is-selected' : ''}`}
                >
                  <div className="course-content">
                    <div className="course-title-row">
                      <h3 className="course-name">{course.title}</h3>
                      {isSelected && (
                        <Tag color="success" className="selected-tag">
                          <CheckCircleOutlined />
                        </Tag>
                      )}
                    </div>

                    <Paragraph
                      ellipsis={{ rows: 2 }}
                      className="course-description"
                    >
                      {course.description}
                    </Paragraph>

                    <Divider className="course-divider" />

                    <div className="course-footer">
                      <div className="course-metadata">
                        <div className="course-category">
                          <Tag
                            color={CATEGORY_COLORS[course.category]}
                            icon={<TagOutlined />}
                          >
                            {CATEGORIES[course.category]}
                          </Tag>
                        </div>
                        <div className="course-duration">
                          <ClockCircleOutlined />
                          <span>{formatTime(course.duration)}</span>
                        </div>
                      </div>

                      <Button
                        type={isSelected ? 'default' : 'primary'}
                        icon={isSelected ? <MinusOutlined /> : <PlusOutlined />}
                        size="small"
                        onClick={() => handleCourseToggle(course)}
                        danger={isSelected}
                        className={isSelected ? 'remove-btn' : 'add-btn'}
                      >
                        {isSelected ? 'Remove' : 'Add'}
                      </Button>
                    </div>
                  </div>
                </div>
              </List.Item>
            )
          }}
        />
      </div>
    </Card>
  )
}

export default CourseSelectionPanel
