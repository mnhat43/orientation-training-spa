import React, { useState } from 'react'
import { Row, Col, Alert, Button, Space } from 'antd'
import { SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import PathCoursesColumn from './PathCoursesColumn'
import InfoSummaryColumn from './InfoSummaryColumn'
import TemplateSelector from './TemplateSelectorComponent'
import CourseSelector from './CourseSelector'

const DesignPath = ({
  selectedTrainee,
  selectedCourses,
  setSelectedCourses,
  onNext,
  onPrev,
}) => {
  // Template-related states
  const [selectedTemplates, setSelectedTemplates] = useState([])
  const [templateDrawerVisible, setTemplateDrawerVisible] = useState(false)

  // Course-related states
  const [courseDrawerVisible, setCourseDrawerVisible] = useState(false)

  return (
    <>
      <Alert
        message="Step 2: Design Learning Path"
        description="Apply a template and/or customize the learning path by adding, removing, or reordering courses."
        type="info"
        showIcon
      />

      <Row gutter={16}>
        <Col span={16}>
          <PathCoursesColumn
            selectedCourses={selectedCourses}
            setSelectedCourses={setSelectedCourses}
            setTemplateDrawerVisible={setTemplateDrawerVisible}
            setCourseDrawerVisible={setCourseDrawerVisible}
          />
        </Col>

        <Col span={8}>
          <InfoSummaryColumn
            selectedTrainee={selectedTrainee}
            selectedCourses={selectedCourses}
          />

          <Space direction="vertical" style={{ width: '100%', marginTop: 16 }}>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={onPrev}
              style={{
                width: '100%',
                height: '40px',
                fontSize: '16px',
              }}
            >
              Back to Trainee Selection
            </Button>

            <Button
              type="primary"
              icon={<SaveOutlined />}
              style={{
                width: '100%',
                height: '40px',
                fontSize: '16px',
              }}
              onClick={onNext}
              disabled={selectedCourses.length === 0}
            >
              Continue to Review
            </Button>
          </Space>
        </Col>
      </Row>

      <TemplateSelector
        selectedCourses={selectedCourses}
        setSelectedCourses={setSelectedCourses}
        selectedTemplates={selectedTemplates}
        setSelectedTemplates={setSelectedTemplates}
        templateDrawerVisible={templateDrawerVisible}
        setTemplateDrawerVisible={setTemplateDrawerVisible}
      />

      <CourseSelector
        selectedCourses={selectedCourses}
        setSelectedCourses={setSelectedCourses}
        courseDrawerVisible={courseDrawerVisible}
        setCourseDrawerVisible={setCourseDrawerVisible}
      />
    </>
  )
}

export default DesignPath
