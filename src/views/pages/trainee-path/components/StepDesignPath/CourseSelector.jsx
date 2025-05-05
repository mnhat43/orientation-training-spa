import React, { useState, useEffect, useCallback } from 'react'
import {
  Select,
  Spin,
  Tag,
  Empty,
  Typography,
  Input,
  Button,
  List,
  Space,
  Row,
  Col,
  Drawer,
  Badge,
  Pagination,
  Tooltip,
  Tabs,
} from 'antd'
import {
  BookOutlined,
  SearchOutlined,
  ClockCircleOutlined,
  PlusOutlined,
  FilterOutlined,
  CloseOutlined,
  CheckOutlined,
  MinusOutlined,
} from '@ant-design/icons'
import { CATEGORIES, CATEGORY_COLORS } from '@constants/categories'
import './CourseSelector.scss'

const { Text } = Typography
const { Option } = Select
const { TabPane } = Tabs

const CourseSelector = ({
  selectedCourses,
  setSelectedCourses,
  courseDrawerVisible,
  setCourseDrawerVisible,
}) => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(false)

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)

  const [searchText, setSearchText] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)

  // Replace hideSelected toggle with activeTab state
  const [activeTab, setActiveTab] = useState('all')

  // Fetch courses
  useEffect(() => {
    if (courseDrawerVisible) {
      const fetchCourses = async () => {
        setLoading(true)
        try {
          const mockCourses = [
            {
              id: 1,
              title: 'Introduction to Company Culture',
              category: 'Onboarding',
              duration: '2 hours',
            },
            {
              id: 2,
              title: 'Product Training 101',
              category: 'Technical',
              duration: '4 hours',
            },
            {
              id: 3,
              title: 'Customer Service Basics',
              category: 'Soft',
              duration: '3 hours',
            },
            {
              id: 4,
              title: 'Compliance and Security',
              category: 'Compliance',
              duration: '4 hours',
            },
            {
              id: 5,
              title: 'HR Policies Overview',
              category: 'Company',
              duration: '3 hours',
            },
            {
              id: 6,
              title: 'Advanced Team Management',
              category: 'Soft',
              duration: '6 hours',
            },
            {
              id: 7,
              title: 'Project Management Basics',
              category: 'Technical',
              duration: '8 hours',
            },
            {
              id: 8,
              title: 'Data Security Fundamentals',
              category: 'Compliance',
              duration: '5 hours',
            },
          ]

          setCourses(mockCourses)
        } catch (error) {
          console.error('Failed to fetch courses:', error)
        } finally {
          setLoading(false)
        }
      }

      fetchCourses()
      setCurrentPage(1)
    }
  }, [courseDrawerVisible])

  useEffect(() => {
    setCurrentPage(1)
  }, [activeTab])

  const handlePageChange = (page, size) => {
    setCurrentPage(page)
    setPageSize(size)
  }

  const isCourseSelected = useCallback(
    (courseId) => {
      return selectedCourses.some((course) => course.id === courseId)
    },
    [selectedCourses],
  )

  const handleCourseSelection = (course) => {
    if (isCourseSelected(course.id)) {
      // Remove course
      setSelectedCourses(selectedCourses.filter((c) => c.id !== course.id))
    } else {
      // Add course
      setSelectedCourses([...selectedCourses, course])
    }
  }

  // Filter courses based on search, category, and active tab
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      !searchText ||
      course.title.toLowerCase().includes(searchText.toLowerCase())
    const matchesCategory =
      !selectedCategory || course.category === CATEGORIES[selectedCategory]

    // Change tab filter logic to show either all courses or only selected courses
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'selected' && isCourseSelected(course.id))

    return matchesSearch && matchesCategory && matchesTab
  })

  // Get paginated courses for current page
  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  )

  return (
    <Drawer
      title={
        <div className="drawer-title">
          <BookOutlined /> Add Courses to Learning Path
        </div>
      }
      placement="right"
      onClose={() => setCourseDrawerVisible(false)}
      open={courseDrawerVisible}
      width={500}
      closeIcon={<CloseOutlined />}
      className="course-selector-drawer"
    >
      <div className="drawer-filter-header">
        <Row gutter={[16, 16]} align="middle">
          <Col flex="auto">
            <Input
              placeholder="Search for courses..."
              prefix={<SearchOutlined />}
              onChange={(e) => setSearchText(e.target.value)}
              value={searchText}
              allowClear
            />
          </Col>
          <Col>
            <Select
              placeholder="Select category"
              style={{ width: 180 }}
              onChange={(value) => setSelectedCategory(value)}
              value={selectedCategory}
              allowClear
              suffixIcon={<FilterOutlined />}
            >
              <Option value="Onboarding">Onboarding Essentials</Option>
              <Option value="Company">Company Policies</Option>
              <Option value="Technical">Technical Skills</Option>
              <Option value="Soft">Soft Skills</Option>
              <Option value="Compliance">Compliance</Option>
            </Select>
          </Col>
        </Row>

        <Row className="filter-row">
          <Col span={24}>
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              className="course-tabs"
            >
              <TabPane
                tab={<span>All Courses ({courses.length})</span>}
                key="all"
              />
              <TabPane
                tab={<span>Selected Courses ({selectedCourses.length})</span>}
                key="selected"
              />
            </Tabs>
          </Col>
        </Row>
      </div>

      <div className="drawer-course-list">
        {loading ? (
          <div className="drawer-loading">
            <Spin size="default" />
            <Text style={{ marginTop: 12 }}>Loading courses...</Text>
          </div>
        ) : (
          <>
            {/* Scrollable list container */}
            <div className="list-scroll-container">
              <List
                dataSource={paginatedCourses}
                size="large"
                split={true}
                renderItem={(course) => {
                  const isSelected = isCourseSelected(course.id)

                  return (
                    <List.Item
                      key={course.id}
                      className={isSelected ? 'course-selected' : ''}
                      actions={[
                        <Tooltip
                          title={
                            isSelected
                              ? 'Remove from learning path'
                              : 'Add to learning path'
                          }
                          placement="left"
                        >
                          <Button
                            type={isSelected ? 'default' : 'primary'}
                            size="middle"
                            icon={
                              isSelected ? <MinusOutlined /> : <PlusOutlined />
                            }
                            onClick={() => handleCourseSelection(course)}
                            className={
                              isSelected ? 'remove-button' : 'add-button'
                            }
                          />
                        </Tooltip>,
                      ]}
                    >
                      <List.Item.Meta
                        title={
                          <>
                            {course.title}
                            {isSelected && (
                              <Tag color="success" className="selected-tag">
                                <CheckOutlined /> Selected
                              </Tag>
                            )}
                          </>
                        }
                        description={
                          <Space size={4} wrap>
                            <Tag
                              color={CATEGORY_COLORS[course.category]}
                              className="category-tag"
                            >
                              {course.category}
                            </Tag>
                            <Tag
                              icon={<ClockCircleOutlined />}
                              className="duration-tag"
                            >
                              {course.duration}
                            </Tag>
                          </Space>
                        }
                      />
                    </List.Item>
                  )
                }}
                locale={{
                  emptyText: (
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description={
                        activeTab === 'selected' && selectedCourses.length === 0
                          ? 'No courses have been selected yet. Switch to "All Courses" to add some.'
                          : 'No courses found. Try changing your search criteria.'
                      }
                    />
                  ),
                }}
              />
            </div>

            {/* Fixed pagination at bottom */}
            {filteredCourses.length > 0 && (
              <div className="pagination-container">
                <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  total={filteredCourses.length}
                  onChange={handlePageChange}
                  showSizeChanger
                  pageSizeOptions={['5', '10', '20']}
                  size="small"
                  showTotal={(total, range) =>
                    `${range[0]}-${range[1]} of ${total} courses`
                  }
                />
              </div>
            )}
          </>
        )}
      </div>
    </Drawer>
  )
}

export default CourseSelector
