import { useState, useEffect } from 'react'
import {
  Button,
  Row,
  Col,
  Spin,
  Input,
  Empty,
  Select,
  Typography,
  Card,
} from 'antd'
import { SearchOutlined, PlusOutlined, TeamOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import course from '@api/course'
import CourseCard from '@components/CourseCard'
import AddCourseForm from './components/AddCourseForm.jsx'
import './index.scss'
import { toast } from 'react-toastify'
import { convertFileToBase64 } from '@helpers/common.js'

const { Title, Text } = Typography
const { Option } = Select

const Courses = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [courseList, setCourseList] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const navigate = useNavigate()

  useEffect(() => {
    fetchCourses()
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

  const handleDeleteCourse = async (courseID) => {
    try {
      const response = await course.deleteCourse({ course_id: courseID })
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
      const { title, description, thumbnail } = values

      if (thumbnail && thumbnail[0]?.originFileObj) {
        const file = thumbnail[0].originFileObj
        base64String = await convertFileToBase64(file)
      }

      const payload = {
        title,
        description,
        thumbnail: base64String,
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

  const filteredCourses = courseList.filter((course) => {
    const matchesSearch =
      course.course_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.course_description
        .toLowerCase()
        .includes(searchQuery.toLowerCase())

    const matchesCategory =
      filterCategory === 'all' || course.category === filterCategory

    return matchesSearch && matchesCategory
  })

  return (
    <div className="courses-container">
      <div className="welcome-banner">
        <div className="welcome-content">
          <TeamOutlined className="welcome-icon" />
          <div className="welcome-text">
            <Title level={3}>Employee Orientation Training</Title>
            <Text>
              Create, manage, and assign training courses for new employees
            </Text>
          </div>
        </div>
      </div>

      <div className="courses-header"></div>

      <div className="courses-filters">
        <Input
          placeholder="Search training courses..."
          prefix={<SearchOutlined />}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
          className="create-course-btn header-btn"
        />
        <Select
          defaultValue="all"
          onChange={(value) => setFilterCategory(value)}
          className="category-filter"
        >
          <Option value="all">All Categories</Option>
          <Option value="onboarding">Onboarding Essentials</Option>
          <Option value="company">Company Policies</Option>
          <Option value="technical">Technical Skills</Option>
          <Option value="soft">Soft Skills</Option>
          <Option value="compliance">Compliance</Option>
        </Select>
      </div>

      <div className="courses-content">
        {loading ? (
          <div className="courses-loading">
            <Spin size="large" />
            <p>Loading training courses...</p>
          </div>
        ) : filteredCourses.length > 0 ? (
          <Row
            gutter={[24, 36]}
            className="courses-grid"
            justify="start"
            align="stretch"
          >
            {filteredCourses.map((courseItem) => (
              <Col
                xs={24}
                sm={12}
                md={8}
                lg={6}
                xl={6}
                key={courseItem.course_id}
                className="course-column"
              >
                <CourseCard
                  CourseID={courseItem.course_id}
                  Title={courseItem.course_title}
                  Thumbnail={courseItem.course_thumbnail}
                  Description={courseItem.course_description}
                  onDelete={handleDeleteCourse}
                  onEdit={handleEditCourse}
                  onClick={() => handleClickCard(courseItem.course_id)}
                />
              </Col>
            ))}
          </Row>
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
    </div>
  )
}

export default Courses
