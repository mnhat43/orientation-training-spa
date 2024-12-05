import React from 'react'

// import { useHistory } from 'react-router-dom'

import { Button, Dropdown, Menu, Space } from 'antd'
import { Link, NavLink, useLocation, useMatch, useParams, useNavigate } from 'react-router-dom'

import { DownOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { red } from '@mui/material/colors'

// const CourseMenu = ({ url, privilege }) => {
//   return (
//     <Menu>
//       <Menu.Item>
//         <Link to={`${url}/announcments`}>Announcments</Link>
//       </Menu.Item>
//       <Menu.Item>
//         <Link to={`${url}/gradebook`}>GradeBook</Link>
//       </Menu.Item>
//       <Menu.Item>
//         <Link to={`${url}/discussions`}>Discussions</Link>
//       </Menu.Item>
//       {privilege !== 'student' && (
//         <Menu.Item>
//           <Link to={`${url}/particpants`}>Particpants</Link>
//         </Menu.Item>
//       )}

//       {privilege !== 'student' && (
//         <Menu.Item>
//           <Link to={`${url}/settings`}>Settings</Link>
//         </Menu.Item>
//       )}
//     </Menu>
//   )
// }

const CourseNavigation = () => {
  // const { params, url } = useRouteMatch('/course/:id')

  // let course = useSelector((state) =>
  //   state.courses.data.find((course) => course.id === params.id)
  // )
  const params = useParams();

  const location = useLocation();


  const course = {
    name: 'Intern ReactJS',
    backgroundColor: 'black',
  }
  const navigate = useNavigate();

  // const { privilege } = useCoursePrivilege(params.id)

  const goBack = () => {
    navigate('/courses')
  }

  return (
    <>
      {
        location.pathname.includes("/course/")
        &&
        <div style={{ display: 'flex', backgroundColor: '#ddd', height: '50px', alignItems: 'center' }}>
          <Space>
            <Button
              shape="circle"
              type="secondary"
              onClick={goBack}
              icon={<ArrowLeftOutlined />}
            ></Button>
            {/* <Dropdown
          overlay={<CourseMenu url={url} privilege={privilege} />}
          placement="bottomCenter"
        > */}
            <Button
              shape="round"
              style={{ backgroundColor: course.backgroundColor }}
            >
              <span style={{ fontWeight: 600, color: 'white' }}>
                {course.name}
              </span>{' '}
              <DownOutlined style={{ color: 'white' }} />
            </Button>
            {/* </Dropdown> */}
          </Space>
          <NavLink to={`/course/${params.courseId}/modules`}>
            <Button type="text">Modules</Button>
          </NavLink>
          <NavLink to={`/course/${params.courseId}/lectures`}>
            <Button type="text">Lectures</Button>
          </NavLink>
          <NavLink to={`/course/${params.courseId}/assignments`}>
            <Button type="text">Assignments</Button>
          </NavLink>
          <NavLink to={`/course/${params.courseId}/exams`}>
            <Button type="text">Exams</Button>
          </NavLink>
          {/* <NavLink to={`.course/${params.courseId}/exam/12345`} target="_blank">
        <Button type="text">CheatingDetection</Button>
      </NavLink> */}
        </div>
      }
    </>

  )
}

export default CourseNavigation
