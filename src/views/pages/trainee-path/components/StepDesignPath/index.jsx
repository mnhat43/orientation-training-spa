import React, { useState, useEffect } from 'react'
import TemplateSelector from './TemplateSelectorComponent'
import CourseDragDropSection from '@components/CourseDragDropSection'
import './index.scss'

const DesignPath = ({ selectedCourses, setSelectedCourses }) => {
  const [selectedTemplates, setSelectedTemplates] = useState([])
  const [templateDrawerVisible, setTemplateDrawerVisible] = useState(false)

  useEffect(() => {
    console.log('Selected courses updated:', selectedCourses)
  }, [selectedCourses])

  return (
    <div className="design-path-container">
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
    </div>
  )
}

export default DesignPath
