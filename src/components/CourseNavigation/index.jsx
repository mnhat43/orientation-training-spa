import { Button, Menu, Typography, Dropdown, Space } from 'antd'
import { NavLink, useLocation, useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeftOutlined,
  BookOutlined,
  ReadOutlined,
  FormOutlined,
  FileTextOutlined,
} from '@ant-design/icons'
import './course-navigation.scss'

const { Title } = Typography

const CourseNavigation = () => {
  const params = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const isCourseRoute = location.pathname.includes('/course/')

  const goBack = () => {
    navigate('/courses')
  }

  const menuItems = [
    {
      key: 'modules',
      icon: <BookOutlined />,
      label: 'Modules',
      path: `/course/${params.courseId}/modules`,
    },
    {
      key: 'lectures',
      icon: <ReadOutlined />,
      label: 'Lectures',
      path: `/course/${params.courseId}/lectures`,
    },
    {
      key: 'assignments',
      icon: <FormOutlined />,
      label: 'Assignments',
      path: `/course/${params.courseId}/assignments`,
    },
    {
      key: 'exams',
      icon: <FileTextOutlined />,
      label: 'Exams',
      path: `/course/${params.courseId}/exams`,
    },
  ]

  const getActiveKey = () => {
    const path = location.pathname
    for (const item of menuItems) {
      if (path.includes(item.key)) {
        return item.key
      }
    }
    return 'modules'
  }

  const mobileMenu = (
    <Menu>
      {menuItems.map((item) => (
        <Menu.Item key={item.key} icon={item.icon}>
          <NavLink to={item.path}>{item.label}</NavLink>
        </Menu.Item>
      ))}
    </Menu>
  )

  if (!isCourseRoute) {
    return null
  }

  return (
    <div className={`course-navigation`}>
      <div className="course-navigation-container">
        <div className="course-navigation-left">
          <Button
            shape="circle"
            type="text"
            onClick={goBack}
            icon={<ArrowLeftOutlined />}
            className="back-button"
            title="Back to Courses"
          />
          <Title level={4} className="course-title">
            Course
          </Title>
        </div>

        <div className="course-navigation-right desktop-menu">
          <Menu
            mode="horizontal"
            selectedKeys={[getActiveKey()]}
            className="course-menu"
          >
            {menuItems.map((item) => (
              <Menu.Item key={item.key} icon={item.icon}>
                <NavLink to={item.path}>{item.label}</NavLink>
              </Menu.Item>
            ))}
          </Menu>
        </div>
      </div>
    </div>
  )
}

export default CourseNavigation
