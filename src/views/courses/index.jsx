import { useState, useEffect } from 'react'
import { Button, Row, Col, Spin, Input, Empty, Select, Pagination } from 'antd'
import { SearchOutlined, PlusOutlined, FilterOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import courseApi from '@api/course'
import skillkeywordApi from '@api/skillkeyword'
import CourseCard from '@components/CourseCard'
import AddCourseDrawer from './components/AddCourseDrawer.jsx'
import EditCourseDrawer from './components/EditCourseDrawer.jsx'
import './index.scss'
import { toast } from 'react-toastify'
import { convertFileToBase64 } from '@helpers/common.js'

const { Option } = Select

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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState(null)
  const [courseList, setCourseList] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [skillKeywords, setSkillKeywords] = useState([])
  const [filterSkillKeywords, setFilterSkillKeywords] = useState([])
  const navigate = useNavigate()

  const { isMobile, isTablet } = useResponsive()

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(8)
  useEffect(() => {
    fetchCourses()
    fetchSkillKeywords()
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
  }, [searchQuery, filterCategory, filterSkillKeywords])
  const fetchCourses = async () => {
    try {
      setLoading(true)
      const response = await courseApi.getListCourse()
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

  const fetchSkillKeywords = async () => {
    try {
      const response = await skillkeywordApi.list()
      if (response && response.data) {
        setSkillKeywords(response.data)
      }
    } catch (error) {
      console.error('Error fetching skill keywords:', error)
    }
  }
  const handleDeleteCourse = async (courseID) => {
    try {
      const response = await courseApi.deleteCourse({ course_id: courseID })
      if (response.status === 1) {
        setCourseList((prevCourses) =>
          prevCourses.filter((course) => course.course_id !== courseID),
        )
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
      const { title, description, thumbnail, category, skill_keyword_ids } =
        values

      if (thumbnail && thumbnail[0]?.originFileObj) {
        const file = thumbnail[0].originFileObj
        base64String = await convertFileToBase64(file)
      }

      const payload = {
        title,
        description: description || '',
        thumbnail: base64String,
        category: category,
        skill_keyword_ids: skill_keyword_ids || [],
      }

      const response = await courseApi.addCourse(payload)

      if (response.status === 1) {
        const newCourse = {
          ...payload,
          course_id: response.data.course_id,
          duration: 0,
          skill_keyword: skill_keyword_ids
            ? skill_keyword_ids
                .map((id) => {
                  const keyword = skillKeywords.find((sk) => sk.id === id)
                  return keyword ? keyword.name : ''
                })
                .filter(Boolean)
            : [],
        }
        setCourseList((prevCourses) => [newCourse, ...prevCourses])
        toast.success('Course added successfully!')
        setIsDrawerOpen(false)
      } else {
        toast.error('Error: ' + response.message)
      }
    } catch (error) {
      toast.error('Error: ' + (error.message || 'Unknown error'))
    }
  }
  const handleEditCourse = async (courseID) => {
    console.log('handleEditCourse called with courseID:', courseID)

    const courseToEdit = courseList.find(
      (course) => course.course_id === courseID,
    )

    console.log('Found courseToEdit:', courseToEdit)

    if (courseToEdit) {
      const enrichedCourse = {
        ...courseToEdit,
        skill_keyword_ids:
          courseToEdit.skill_keyword_ids ||
          (courseToEdit.skill_keyword
            ? courseToEdit.skill_keyword
                .map((skillName) => {
                  const keyword = skillKeywords.find(
                    (sk) => sk.name === skillName,
                  )
                  return keyword ? keyword.id : null
                })
                .filter(Boolean)
            : []),
      }

      console.log('Setting editingCourse to:', enrichedCourse)
      setEditingCourse(enrichedCourse)
      setIsEditDrawerOpen(true)
    } else {
      console.error('Course not found with ID:', courseID)
      toast.error('Course not found')
    }
  }
  const handleUpdateCourse = async (values) => {
    try {
      const {
        title,
        description,
        thumbnail,
        category,
        skill_keyword_ids,
        course_id,
      } = values

      console.log(
        'handleUpdateCourse - course_id:',
        course_id,
        'type:',
        typeof course_id,
      )
      console.log('handleUpdateCourse - values:', values)

      if (!course_id) {
        toast.error('Course ID is missing')
        console.error('Course ID is null or undefined:', course_id)
        return
      }

      const originalCourse = courseList.find(
        (course) => course.course_id === parseInt(course_id, 10),
      )

      console.log('Found original course:', originalCourse)

      if (!originalCourse) {
        toast.error('Course not found')
        console.error('Course not found with ID:', course_id)
        console.log(
          'Available courses:',
          courseList.map((c) => ({ id: c.course_id, title: c.title })),
        )
        return
      }
      const payload = { course_id: parseInt(course_id, 10) }
      let hasChanges = false

      if (title !== originalCourse.title) {
        payload.title = title
        hasChanges = true
      }

      if (description !== originalCourse.description) {
        payload.description = description || ''
        hasChanges = true
      }

      if (category !== originalCourse.category) {
        payload.category = category
        hasChanges = true
      }
      const originalSkillIds = originalCourse.skill_keyword_ids || []
      const newSkillIds = (skill_keyword_ids || []).map((id) =>
        parseInt(id, 10),
      )

      const skillsChanged =
        originalSkillIds.length !== newSkillIds.length ||
        !originalSkillIds.every((id) => newSkillIds.includes(id)) ||
        !newSkillIds.every((id) => originalSkillIds.includes(id))

      if (skillsChanged) {
        payload.skill_keyword_ids = newSkillIds
        hasChanges = true
      }

      if (thumbnail && thumbnail[0]?.originFileObj) {
        const file = thumbnail[0].originFileObj
        payload.thumbnail = await convertFileToBase64(file)
        hasChanges = true
      } else if (
        thumbnail &&
        thumbnail[0]?.url &&
        thumbnail[0].url !== originalCourse.thumbnail
      ) {
        payload.thumbnail = thumbnail[0].url
        hasChanges = true
      } else if (!thumbnail && originalCourse.thumbnail) {
        payload.thumbnail = ''
        hasChanges = true
      }

      if (!hasChanges) {
        toast.info('No changes detected')
        setIsEditDrawerOpen(false)
        setEditingCourse(null)
        return
      }

      const response = await courseApi.updateCourse(payload)

      if (response.status === 1) {
        setCourseList((prevCourses) =>
          prevCourses.map((course) =>
            course.course_id === course_id
              ? {
                  ...course,
                  ...payload,

                  ...(payload.skill_keyword_ids && {
                    skill_keyword: payload.skill_keyword_ids
                      .map((id) => {
                        const keyword = skillKeywords.find((sk) => sk.id === id)
                        return keyword ? keyword.name : ''
                      })
                      .filter(Boolean),
                  }),
                }
              : course,
          ),
        )
        toast.success('Course updated successfully!')
        setIsEditDrawerOpen(false)
        setEditingCourse(null)
      } else {
        toast.error('Error: ' + response.message)
      }
    } catch (error) {
      toast.error('Error: ' + (error.message || 'Unknown error'))
    }
  }
  const filteredCourses = courseList.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory =
      filterCategory === 'all' || course.category === filterCategory

    const matchesSkillKeywords =
      filterSkillKeywords.length === 0 ||
      (course.skill_keyword &&
        filterSkillKeywords.some((selectedSkillId) =>
          course.skill_keyword.some((skill) => {
            const skillKeyword = skillKeywords.find(
              (sk) => sk.id === selectedSkillId,
            )
            return (
              skillKeyword &&
              skill.toLowerCase().includes(skillKeyword.name.toLowerCase())
            )
          }),
        ))

    return matchesSearch && matchesCategory && matchesSkillKeywords
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
      {' '}
      <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
        <Col xs={24} sm={24} md={10} lg={8} xl={7}>
          <Input
            placeholder="Search courses..."
            prefix={<SearchOutlined />}
            onChange={(e) => setSearchQuery(e.target.value)}
            value={searchQuery}
            allowClear
            style={{ height: '42px' }}
          />
        </Col>{' '}
        <Col xs={9} sm={7} md={6} lg={5} xl={4}>
          <Select
            className="filter-category-select"
            value={filterCategory}
            onChange={(value) => setFilterCategory(value)}
            placeholder="Category"
            suffixIcon={<FilterOutlined />}
            style={{ height: '42px', width: '100%' }}
          >
            <Option value="all">All Categories</Option>
            <Option value="Onboarding">Onboarding Essentials</Option>
            <Option value="Company">Company Policies</Option>
            <Option value="Technical">Technical Skills</Option>
            <Option value="Soft">Soft Skills</Option>
            <Option value="Compliance">Compliance</Option>
          </Select>
        </Col>
        <Col xs={6} sm={11} md={5} lg={7} xl={9}>
          <Select
            className="filter-skill-select"
            mode="multiple"
            value={filterSkillKeywords}
            onChange={(value) => setFilterSkillKeywords(value)}
            placeholder="Skill Keywords"
            style={{ height: '42px', width: '100%' }}
            maxTagCount="responsive"
            allowClear
            showSearch
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            {skillKeywords.map((keyword) => (
              <Option key={keyword.id} value={keyword.id}>
                {keyword.name}
              </Option>
            ))}
          </Select>
        </Col>
        <Col xs={6} sm={6} md={3} lg={4} xl={4}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsDrawerOpen(true)}
            style={{ height: '42px' }}
          >
            {isMobile ? '+' : 'Create course'}
          </Button>
        </Col>
      </Row>
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
                  key={courseItem.course_id}
                  className="course-card-wrapper"
                >
                  <CourseCard
                    course={courseItem}
                    onDelete={handleDeleteCourse}
                    onEdit={handleEditCourse}
                    onClick={() => handleClickCard(courseItem.course_id)}
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
                    `${range[0]} - ${range[1]} of ${total} courses`
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
                searchQuery ||
                filterCategory !== 'all' ||
                filterSkillKeywords.length > 0
                  ? 'No training courses match your search criteria'
                  : 'No employee training courses available yet'
              }
            />
          </div>
        )}
      </div>{' '}
      {isDrawerOpen && (
        <AddCourseDrawer
          isDrawerOpen={isDrawerOpen}
          setIsDrawerOpen={setIsDrawerOpen}
          handleAddCourse={handleAddCourse}
        />
      )}
      {isEditDrawerOpen && (
        <EditCourseDrawer
          isDrawerOpen={isEditDrawerOpen}
          setIsDrawerOpen={setIsEditDrawerOpen}
          handleEditCourse={handleUpdateCourse}
          course={editingCourse}
        />
      )}
    </div>
  )
}

export default Courses
