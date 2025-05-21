import React, { useState, useEffect } from 'react'
import { Typography, Divider, Drawer, Spin } from 'antd'
import { BookOutlined, InfoCircleOutlined } from '@ant-design/icons'
import CourseList from '@components/CourseList'
import templatepath from '@api/templatepath'
import './TemplateDetails.scss'

const { Title, Paragraph } = Typography

const TemplateDetails = ({ template, drawerVisible, setDrawerVisible }) => {
  const [detailedTemplate, setDetailedTemplate] = useState(null)
  const [coursesList, setCoursesList] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (template && drawerVisible) {
      fetchTemplateDetails(template.id)
    }
  }, [template, drawerVisible])

  const fetchTemplateDetails = (id) => {
    setLoading(true)
    templatepath
      .getTemplatePath({ id })
      .then((response) => {
        if (response && response.data) {
          setCoursesList(response.data.course_list)
          setDetailedTemplate(response.data)
        }
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching template details:', error)
        setLoading(false)
      })
  }

  if (!template) return null

  return (
    <Drawer
      title={<Title level={4}>{template.name}</Title>}
      placement="right"
      closable={false}
      onClose={() => setDrawerVisible(false)}
      open={drawerVisible}
      width={450}
      className="template-drawer"
    >
      <div className="description-section">
        <Title level={5}>
          <InfoCircleOutlined /> Description
        </Title>
        <Paragraph className="description-text">
          {template.description || 'No description provided.'}
        </Paragraph>
      </div>

      <Divider style={{ margin: '12px 0' }} />

      <div className="courses-section">
        <Title level={5} className="section-header">
          <BookOutlined /> Courses{' '}
          {coursesList ? `(${coursesList.length})` : ''}
        </Title>

        <div className="courses-list-container">
          <Spin spinning={loading} tip="Loading courses...">
            <div className={loading ? 'loading-content' : ''}>
              {!loading && <CourseList courses={coursesList || []} />}
            </div>
          </Spin>
        </div>
      </div>
    </Drawer>
  )
}

export default TemplateDetails
