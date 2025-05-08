import React from 'react'
import { Row, Col } from 'antd'
import CourseSelectionPanel from './CourseSelectionPanel'
import SelectedCoursesPanel from './SelectedCoursesPanel'

const CourseDragDropSection = ({
  selectedCourses,
  setSelectedCourses,
  isShowTemplate = false,
  setTemplateDrawerVisible,
}) => {
  return (
    <div className="course-section">
      <div className="template-course-selection">
        <Row gutter={24}>
          <Col lg={12} md={24} sm={24} xs={24} className="selection-panel-col">
            <CourseSelectionPanel
              selectedCourses={selectedCourses}
              setSelectedCourses={setSelectedCourses}
              isShowTemplate={isShowTemplate}
              setTemplateDrawerVisible={setTemplateDrawerVisible}
            />
          </Col>

          <Col lg={12} md={24} sm={24} xs={24} className="selected-courses-col">
            <SelectedCoursesPanel
              selectedCourses={selectedCourses}
              setSelectedCourses={setSelectedCourses}
            />
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default CourseDragDropSection
