import React, { useState, useEffect } from 'react'
import { Typography, Divider, Drawer, Spin, message } from 'antd'
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
      title={null}
      placement="right"
      closable={true}
      onClose={() => setDrawerVisible(false)}
      visible={drawerVisible}
      width={450}
      className="template-drawer"
      styles={{ header: { display: 'none' } }}
    >
      <div className="template-details-container">
        <div className="detail-header">
          <Title level={4}>{template.name}</Title>
        </div>

        <div className="detail-content">
          <div className="content-section description-section">
            <div className="section-header">
              <Title level={5}>
                <InfoCircleOutlined /> Description
              </Title>
            </div>
            <Paragraph className="description-text">
              {template.description || 'No description provided.'}
            </Paragraph>
          </div>

          <Divider style={{ margin: '12px 0' }} />

          <div className="content-section courses-section">
            <div className="section-header">
              <Title level={5}>
                <BookOutlined /> Courses{' '}
                {coursesList ? `(${coursesList.length})` : ''}
              </Title>
            </div>

            <div className="courses-list-container">
              {loading ? (
                <div className="loading-container">
                  <Spin tip="Loading courses..." />
                </div>
              ) : (
                <CourseList courses={coursesList || []} />
              )}
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  )
}

export default TemplateDetails
