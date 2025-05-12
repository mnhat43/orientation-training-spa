import { useState, useEffect } from 'react'
import {
  Button,
  Row,
  Col,
  Spin,
  Input,
  Empty,
  Select,
  Pagination,
  Typography,
  Tag,
} from 'antd'
import {
  SearchOutlined,
  PlusOutlined,
  FilterOutlined,
  BookOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import course from '@api/course'
import CourseCard from '@components/CourseCard'
import AddCourseForm from './components/AddCourseForm.jsx'
import './index.scss'
import { toast } from 'react-toastify'
import { convertFileToBase64 } from '@helpers/common.js'
import { CATEGORIES, CATEGORY_COLORS } from '@constants/categories'
import BannerComponent from '@components/Banner/index.jsx'

const { Option } = Select
const { Title, Paragraph } = Typography

const useResponsive = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return {
    isMobile: windowSize.width <= 576,
    isTablet: windowSize.width <= 768 && windowSize.width > 576,
    isDesktop: windowSize.width > 768,
  }
}

const Courses = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [courseList, setCourseList] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const navigate = useNavigate()

  const { isMobile, isTablet } = useResponsive()

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(8)

  useEffect(() => {
    fetchCourses()
  }, [])

  useEffect(() => {
    if (isMobile) {
      setPageSize(4)
    } else if (isTablet) {
      setPageSize(6)
    } else {
      setPageSize(8)
    }
  }, [isMobile, isTablet])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, filterCategory])

  const fetchCourses = async () => {
    try {
      setLoading(true)
      const response = await course.getListCourse()
      if (response.status === 1) {
        setCourseList(response.data.courses)
      }
    } catch (error) {
      toast.error(
        'Error fetching courses: ' + (error.message || 'Unknown error'),
      )
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCourse = async (courseID) => {
    try {
      const response = await course.deleteCourse({ id: courseID })
      if (response.status === 1) {
        fetchCourses()
        toast.success('Course deleted successfully')
      }
    } catch (error) {
      toast.error(
        'Error deleting course: ' + (error.message || 'Unknown error'),
      )
    }
  }

  const handleClickCard = (courseId) => {
    navigate(`/course/${courseId}/modules`)
  }

  const handleAddCourse = async (values) => {
    try {
      let base64String = ''
      const { title, description = '', thumbnail, category, duration } = values

      if (thumbnail && thumbnail[0]?.originFileObj) {
        const file = thumbnail[0].originFileObj
        base64String = await convertFileToBase64(file)
      }

      const payload = {
        title,
        description,
        thumbnail: base64String,
        category: category,
      }

      const response = await course.addCourse(payload)

      if (response.status === 1) {
        toast.success('Course added successfully!')
        fetchCourses()
        setIsModalOpen(false)
      } else {
        toast.error('Error: ' + response.message)
      }
    } catch (error) {
      toast.error('Error: ' + (error.message || 'Unknown error'))
    }
  }

  const handleEditCourse = async (courseID) => {
    console.log('Edit course:', courseID)
  }

  const filteredCourses = courseList.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory =
      filterCategory === 'all' || course.category === filterCategory

    return matchesSearch && matchesCategory
  })

  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  )

  const handlePageChange = (page, size) => {
    setCurrentPage(page)
    setPageSize(size)

    const container = document.querySelector('.courses-container')
    if (container) {
      container.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const showPagination = filteredCourses.length > 0

  return (
    <div className="courses-container">
      <BannerComponent
        title="Welcome to the Training Courses"
        description="Create and manage employee orientation and training courses for your organization."
        icon={BookOutlined}
      />

      <div className="filters-section">
        <div className="filters-wrapper">
          <div className="filters-top">
            <div className="search-box">
              <Input
                placeholder="Search courses..."
                prefix={<SearchOutlined />}
                onChange={(e) => setSearchQuery(e.target.value)}
                value={searchQuery}
                allowClear
              />
            </div>

            <div className="filters-right">
              <div className="category-select">
                <Select
                  value={filterCategory}
                  onChange={(value) => setFilterCategory(value)}
                  placeholder="Category"
                  suffixIcon={<FilterOutlined />}
                  dropdownMatchSelectWidth={false}
                >
                  <Option value="all">All Categories</Option>
                  <Option value="Onboarding">Onboarding Essentials</Option>
                  <Option value="Company">Company Policies</Option>
                  <Option value="Technical">Technical Skills</Option>
                  <Option value="Soft">Soft Skills</Option>
                  <Option value="Compliance">Compliance</Option>
                </Select>
              </div>

              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setIsModalOpen(true)}
                className="create-btn"
              >
                {!isMobile && 'Create Course'}
              </Button>
            </div>
          </div>

          {(searchQuery || filterCategory !== 'all') && (
            <div className="filters-active">
              <div className="active-filters">
                <span className="label">Active filters:</span>
                <div className="tags">
                  {searchQuery && (
                    <Tag closable onClose={() => setSearchQuery('')}>
                      <SearchOutlined /> {searchQuery}
                    </Tag>
                  )}

                  {filterCategory !== 'all' && (
                    <Tag
                      closable
                      onClose={() => setFilterCategory('all')}
                      color={CATEGORY_COLORS[filterCategory] || 'blue'}
                    >
                      <FilterOutlined />{' '}
                      {CATEGORIES[filterCategory] || filterCategory}
                    </Tag>
                  )}
                </div>
              </div>

              <Button
                type="text"
                size="small"
                onClick={() => {
                  setSearchQuery('')
                  setFilterCategory('all')
                }}
              >
                Clear all
              </Button>
            </div>
          )}
        </div>

        <div
          className={`filters-result ${filteredCourses.length > 0 ? '' : 'empty'}`}
        >
          {filteredCourses.length > 0 ? (
            <div className="result-count">
              Found <strong>{filteredCourses.length}</strong>{' '}
              {filteredCourses.length === 1 ? 'course' : 'courses'}
            </div>
          ) : searchQuery || filterCategory !== 'all' ? (
            <div className="no-results">
              <FilterOutlined /> No courses match your filters
            </div>
          ) : null}
        </div>
      </div>

      <div className="courses-content">
        {loading ? (
          <div className="courses-loading">
            <Spin size="large" />
            <p>Loading training courses...</p>
          </div>
        ) : filteredCourses.length > 0 ? (
          <div>
            <Row gutter={[16, 16]} className="courses-grid">
              {paginatedCourses.map((courseItem) => (
                <Col
                  xs={24}
                  sm={12}
                  md={8}
                  lg={6}
                  key={courseItem.id}
                  className="course-card-wrapper"
                >
                  <CourseCard
                    CourseID={courseItem.id}
                    Title={courseItem.title}
                    Thumbnail={courseItem.thumbnail}
                    Description={courseItem.description}
                    Category={courseItem.category}
                    Duration={courseItem.duration}
                    onDelete={handleDeleteCourse}
                    onEdit={handleEditCourse}
                    onClick={() => handleClickCard(courseItem.id)}
                  />
                </Col>
              ))}
            </Row>
            {showPagination && (
              <div className="pagination-container">
                <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  total={filteredCourses.length}
                  onChange={handlePageChange}
                  showSizeChanger
                  pageSizeOptions={
                    isMobile ? ['4', '8', '12'] : ['4', '8', '12', '16']
                  }
                  showTotal={(total, range) =>
                    `${range[0]}-${range[1]} of ${total} courses`
                  }
                  responsive
                  aria-label="Course pagination"
                  showQuickJumper={!isMobile}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="courses-empty">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                searchQuery || filterCategory !== 'all'
                  ? 'No training courses match your search criteria'
                  : 'No employee training courses available yet'
              }
            />
            <div className="empty-text">
              <p>
                {searchQuery || filterCategory !== 'all'
                  ? 'Try adjusting your search or filters to find courses.'
                  : 'Start building your employee orientation program by creating your first training course.'}
              </p>
            </div>
            {!searchQuery && filterCategory === 'all' && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setIsModalOpen(true)}
                className="create-course-btn empty-btn"
                size="large"
              >
                Create Your First Course
              </Button>
            )}
          </div>
        )}
      </div>

      {isModalOpen && (
        <AddCourseForm
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          handleAddCourse={handleAddCourse}
        />
      )}
    </div>
  )
}

export default Courses
