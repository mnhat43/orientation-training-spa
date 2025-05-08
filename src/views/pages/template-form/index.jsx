import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Layout, Form, Input, Button, message, Spin, Alert } from 'antd'

import TemplateFormHeader from './components/TemplateFormHeader'
import BasicInfoTemplate from './components/BasicInfoTemplate'

import CourseDragDropSection from '@components/CourseDragDropSection'
import './index.scss'

import { MOCK_AVAILABLE_COURSES } from './mockData'

const { Content } = Layout

const TemplateFormPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(!!id)
  const [error, setError] = useState(null)
  const [selectedCourses, setSelectedCourses] = useState([])

  const isEditing = !!id

  useEffect(() => {
    if (isEditing) {
      setInitialLoading(true)
      // Mock API call - replace with actual API
      setTimeout(() => {
        try {
          // Mock template data
          const templateData = {
            id: parseInt(id),
            name: 'Frontend Developer',
            description: 'Learning path for frontend developers',
            category: 'Web Development',
            courses: 5,
            duration: '8',
            createdAt: '2023-05-15',
            updatedAt: '2023-06-01',
            createdBy: 'Admin User',
          }

          // Set form values
          form.setFieldsValue({
            name: templateData.name,
            description: templateData.description,
            category: templateData.category,
          })

          // Set selected courses
          setSelectedCourses(
            MOCK_AVAILABLE_COURSES.slice(0, templateData.courses),
          )

          setInitialLoading(false)
        } catch (err) {
          setError('Failed to load template data. Please try again.')
          setInitialLoading(false)
        }
      }, 1000)
    }
  }, [id, isEditing, form])

  useEffect(() => {
    form.setFieldsValue({
      courseIds: selectedCourses.map((c) => c.id),
    })
  }, [selectedCourses, form])

  const handleSubmit = () => {
    form
      .validateFields(['name', 'description', 'courseIds'])
      .then((values) => {
        console.log('Form values:', values)
        if (selectedCourses.length === 0) {
          message.error('Please add at least one course to the template')
          return
        }

        setLoading(true)

        // Calculate duration based on courses
        const totalWeeks = selectedCourses.reduce((total, course) => {
          const weeks = parseInt(course.duration.split(' ')[0]) || 0
          return total + weeks
        }, 0)

        // Prepare the complete form data
        const formData = {
          ...values,
          courses: selectedCourses.length,
          courseData: selectedCourses,
          id: isEditing ? parseInt(id) : undefined,
        }

        // Simulate API call
        setTimeout(() => {
          if (isEditing) {
            message.success('Template updated successfully')
          } else {
            message.success('Template created successfully')
          }

          setLoading(false)
          navigate('/templates')
        }, 1000)
      })
      .catch(() => {
        message.error('Please check all fields and try again')
      })
  }

  return (
    <div className="template-form-wrapper">
      <TemplateFormHeader
        isEditing={isEditing}
        loading={loading}
        navigate={navigate}
        handleSubmit={handleSubmit}
      />

      <Content className="template-form-content">
        {initialLoading ? (
          <div className="template-form-simple loading-container">
            <Spin size="large" tip="Loading template data..." />
          </div>
        ) : error ? (
          <div className="template-form-simple">
            <Alert
              message="Error"
              description={error}
              type="error"
              showIcon
              action={
                <Button type="primary" onClick={() => navigate('/templates')}>
                  Return to Templates
                </Button>
              }
            />
          </div>
        ) : (
          <Form
            form={form}
            layout="vertical"
            name="templateForm"
            className="template-form"
            scrollToFirstError
          >
            <Form.Item name="courseIds" hidden={true}>
              <Input />
            </Form.Item>

            <BasicInfoTemplate />

            <CourseDragDropSection
              selectedCourses={selectedCourses}
              setSelectedCourses={setSelectedCourses}
            />
          </Form>
        )}
      </Content>
    </div>
  )
}

export default TemplateFormPage
