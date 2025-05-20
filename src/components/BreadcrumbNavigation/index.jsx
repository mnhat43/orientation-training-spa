import { Breadcrumb, Button } from 'antd'
import { useNavigate, useLocation, useParams, Link } from 'react-router-dom'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { useState, useEffect } from 'react'
import useAuth from '@hooks/useAuth'
import { ROLES } from '@constants/roles'
import './breadcrumb-navigation.scss'
import courseApi from '@api/course'

const BreadcrumbNavigation = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const params = useParams()
  const { currentUser } = useAuth()
  const [courseTitle, setCourseTitle] = useState('')

  useEffect(() => {
    const fetchCourseData = async () => {
      if (params.courseId) {
        try {
          const response = await courseApi.getCourseDetail({
            course_id: Number(params.courseId),
          })
          if (response && response.data) {
            setCourseTitle(response.data.title)
          }
        } catch (error) {
          console.error('Error fetching course title:', error)
          setCourseTitle(`Course ${params.courseId}`)
        }
      }
    }
    fetchCourseData()
  }, [params.courseId])

  const goBack = () => {
    if (currentUser && currentUser.role_id === ROLES.MANAGER) {
      navigate('/courses')
    } else {
      navigate('/my-learning-path')
    }
  }

  const generateBreadcrumbItems = () => {
    const pathSegments = location.pathname
      .split('/')
      .filter((segment) => segment)
    const breadcrumbItems = []

    if (pathSegments.includes('courses') || pathSegments.includes('course')) {
      if (currentUser && currentUser.role_id === ROLES.MANAGER) {
        breadcrumbItems.push({
          title: <Link to="/courses">Courses</Link>,
        })
      } else {
        breadcrumbItems.push({
          title: <Link to="/my-learning-path">My Learning Path</Link>,
        })
      }
    }

    if (pathSegments.includes('course') && params.courseId) {
      breadcrumbItems.push({
        title: courseTitle,
      })
    }

    return breadcrumbItems
  }

  if (
    !location.pathname.includes('/course/') &&
    !location.pathname.includes('/courses')
  ) {
    return null
  }

  return (
    <div className="breadcrumb-navigation">
      <div className="breadcrumb-container">
        <Button
          shape="circle"
          type="text"
          onClick={goBack}
          icon={<ArrowLeftOutlined />}
          className="back-button"
          title={
            currentUser && currentUser.r_idole === ROLES.MANAGER
              ? 'Back to Courses'
              : 'Back to Learning Path'
          }
        />
        <Breadcrumb items={generateBreadcrumbItems()} />
      </div>
    </div>
  )
}

export default BreadcrumbNavigation
