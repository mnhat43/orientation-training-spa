import React, { useState } from 'react'
import { Button, Space, Divider, Row, Col } from 'antd'
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons'
import TemplateSelector from './TemplateSelectorComponent'
import CourseDragDropSection from '@components/CourseDragDropSection'
import './index.scss'

const DesignPath = ({
  selectedCourses,
  setSelectedCourses,
  onNext,
  onPrev,
}) => {
  const [selectedTemplates, setSelectedTemplates] = useState([])
  const [templateDrawerVisible, setTemplateDrawerVisible] = useState(false)

  return (
    <div className="design-path-container">
      <Row>
        <Col span={22} className="content-section">
          <CourseDragDropSection
            selectedCourses={selectedCourses}
            setSelectedCourses={setSelectedCourses}
            isShowTemplate={true}
            setTemplateDrawerVisible={setTemplateDrawerVisible}
          />

          <TemplateSelector
            selectedCourses={selectedCourses}
            setSelectedCourses={setSelectedCourses}
            selectedTemplates={selectedTemplates}
            setSelectedTemplates={setSelectedTemplates}
            templateDrawerVisible={templateDrawerVisible}
            setTemplateDrawerVisible={setTemplateDrawerVisible}
          />
        </Col>

        <Col span={2} className="navigation-buttons">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Button icon={<ArrowLeftOutlined />} onClick={onPrev} size="middle">
              Back
            </Button>
            <Button
              type="primary"
              icon={<ArrowRightOutlined />}
              onClick={onNext}
              disabled={selectedCourses.length === 0}
              size="middle"
            >
              Next
            </Button>
          </Space>
        </Col>
      </Row>
    </div>
  )
}

export default DesignPath
