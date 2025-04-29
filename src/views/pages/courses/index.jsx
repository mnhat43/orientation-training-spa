import { useState, useEffect } from 'react'
import { Button, Row, Col, Spin, Input, Empty, Select, Typography } from 'antd'
import { SearchOutlined, PlusOutlined, TeamOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import course from '@api/course'
import userprogress from '@api/userprogress'
import CourseCard from '@components/CourseCard'
import AddCourseForm from './components/AddCourseForm.jsx'
import EnrollTraineesModal from './components/EnrollTraineesModal'
import './index.scss'
import { toast } from 'react-toastify'
import { convertFileToBase64 } from '@helpers/common.js'
import BannerComponent from '@components/Banner/index.jsx'

const { Option } = Select

const mockTrainees = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    department: 'Engineering',
    position: 'Software Engineer',
    avatar: null,
    enrolled: true,
    progress: 75,
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    department: 'Marketing',
    position: 'Marketing Specialist',
    avatar: null,
    enrolled: false,
    progress: 0,
  },
  {
    id: '3',
    name: 'Robert Johnson',
    email: 'robert.j@example.com',
    department: 'HR',
    position: 'HR Coordinator',
    avatar: null,
    enrolled: true,
    progress: 33,
  },
  {
    id: '4',
    name: 'Emily Wilson',
    email: 'emily.w@example.com',
    department: 'Finance',
    position: 'Financial Analyst',
    avatar: null,
    enrolled: false,
    progress: 0,
  },
  {
    id: '5',
    name: 'Michael Brown',
    email: 'michael.b@example.com',
    department: 'Customer Support',
    position: 'Support Specialist',
    avatar: null,
    enrolled: true,
    progress: 67,
  },
  {
    id: '6',
    name: 'Sarah Davis',
    email: 'sarah.d@example.com',
    department: 'Engineering',
    position: 'QA Engineer',
    avatar: null,
    enrolled: false,
    progress: 0,
  },
  {
    id: '7',
    name: 'David Miller',
    email: 'david.m@example.com',
    department: 'Sales',
    position: 'Sales Representative',
    avatar: null,
    enrolled: false,
    progress: 0,
  },
]

const Courses = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false)
  const [courseList, setCourseList] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [trainees, setTrainees] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    fetchCourses()
    setTrainees(mockTrainees)
  }, [])

  const fetchCourses = async () => {
    try {
      const response = await course.getListCourse()
      if (response.status === 1) {
        setCourseList(response.data.courses)
      }
    } catch (error) {
      toast.error('Error fetching courses:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchTraineeByCourse = async (courseID) => {
    try {
      const response = await userprogress.getListTraineeByCourse({
        course_id: parseInt(courseID),
      })
      if (response.status === 1) {
        setTrainees(response.data)
      }
    } catch (error) {
      toast.error('Error fetching list trainee by course:', error)
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
      toast.error('Error deleting course:', error)
    }
  }

  const handleClickCard = (courseId) => {
    navigate(`/course/${courseId}/modules`)
  }

  const handleAddCourse = async (values) => {
    try {
      let base64String = ''
      const { title, description = '', thumbnail, category } = values

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
      toast.error('Error: ' + error.message)
    }
  }

  const handleEditCourse = async (courseID) => {
    console.log('Edit course:', courseID)
  }

  const handleEnrollTrainees = (courseItem) => {
    fetchTraineeByCourse(parseInt(courseItem.id))
    setSelectedCourse(courseItem)
    setIsEnrollModalOpen(true)
  }

  const handleEnrollSubmit = async (values) => {
    try {
      const { traineeIds } = values
      const response = await userprogress.addListTraineeToCourse({
        course_id: selectedCourse.id,
        trainees: traineeIds,
      })
      if (response.status === 1) {
        toast.success('Trainees enrolled successfully!')
        setIsEnrollModalOpen(false)
      }
    } catch (error) {
      toast.error('Error enrolling trainees:', error)
    } finally {
      setLoading(false)
      setIsEnrollModalOpen(false)
    }
  }

  const filteredCourses = courseList.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory =
      filterCategory === 'all' || course.category === filterCategory

    return matchesSearch && matchesCategory
  })

  return (
    <div className="courses-container">
      <BannerComponent
        title="Manage Courses"
        description="Create, manage, and assign training courses for new employees"
      />

      <div className="courses-filters">
        <Input
          placeholder="Search training courses..."
          prefix={<SearchOutlined />}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <Select
          defaultValue="all"
          onChange={(value) => setFilterCategory(value)}
          className="category-filter"
        >
          <Option value="all">All Categories</Option>
          <Option value="Onboarding">Onboarding Essentials</Option>
          <Option value="Company">Company Policies</Option>
          <Option value="Technical">Technical Skills</Option>
          <Option value="Soft">Soft Skills</Option>
          <Option value="Compliance">Compliance</Option>
        </Select>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
          className="create-course-btn header-btn"
        />
      </div>

      <div className="courses-content">
        {loading ? (
          <div className="courses-loading">
            <Spin size="large" />
            <p>Loading training courses...</p>
          </div>
        ) : filteredCourses.length > 0 ? (
          <div>
            <Row gutter={[8, 16]} className="courses-grid">
              {filteredCourses.map((courseItem) => (
                <Col xs={24} sm={12} md={8} lg={6} xl={6} key={courseItem.id}>
                  <CourseCard
                    CourseID={courseItem.id}
                    Title={courseItem.title}
                    Thumbnail={courseItem.thumbnail}
                    Description={courseItem.description}
                    Category={courseItem.category}
                    onDelete={handleDeleteCourse}
                    onEdit={handleEditCourse}
                    onClick={() => handleClickCard(courseItem.id)}
                    onEnroll={() => handleEnrollTrainees(courseItem)}
                  />
                </Col>
              ))}
            </Row>
          </div>
        ) : (
          <div className="courses-empty">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                searchQuery
                  ? 'No training courses match your search criteria'
                  : 'No employee training courses available yet'
              }
            />
            <div className="empty-text">
              <p>
                Start building your employee orientation program by creating
                your first training course.
              </p>
            </div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsModalOpen(true)}
              className="create-course-btn"
              size="large"
              style={{ marginTop: 24 }}
            >
              Create Course
            </Button>
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

      <EnrollTraineesModal
        visible={isEnrollModalOpen}
        onCancel={() => setIsEnrollModalOpen(false)}
        onEnroll={handleEnrollSubmit}
        courseData={selectedCourse}
        trainees={trainees}
      />
    </div>
  )
}

export default Courses
