import React from 'react'
import { Row, Col } from 'antd'
import CourseCard from '@components/CourseCard/index.jsx'
import './course-list.scss'

const CourseList = ({
  courses,
  userRole,
  getCourseStatus,
  handleCourseClick,
}) => {
  return (
    <div className="learning-path-courses">
      <h3>Course Cards</h3>
      <Row gutter={[16, 16]}>
        {courses.map((course, index) => {
          const courseStatus = getCourseStatus(course, index)

          return (
            <Col xs={24} sm={12} md={8} lg={6} key={course.course_id}>
              <CourseCard
                course={course}
                role={userRole}
                onClick={() => handleCourseClick(course, courseStatus)}
                status={{
                  locked: courseStatus.locked,
                  completed: courseStatus.completed,
                }}
                position={course.course_position || index + 1}
              />
            </Col>
          )
        })}
      </Row>
    </div>
  )
}

export default CourseList
