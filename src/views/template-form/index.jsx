import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Layout, Form, Input, Button, message, Spin, Alert } from 'antd'

import TemplateFormHeader from './components/TemplateFormHeader'
import BasicInfoTemplate from './components/BasicInfoTemplate'

import CourseDragDropSection from '@components/CourseDragDropSection'
import './index.scss'

import templatepath from '@api/templatepath'

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
      templatepath
        .getTemplatePath({ id: parseInt(id) })
        .then((response) => {
          if (response && response.data && response.status == 1) {
            const templateData = response.data

            form.setFieldsValue({
              name: templateData.name,
              description: templateData.description,
              category: templateData.category,
            })

            setSelectedCourses(templateData.course_list)
            setInitialLoading(false)
          } else {
            throw new Error('Failed to load template data')
          }
        })
        .catch((err) => {
          setError('Failed to load template data. Please try again.')
          setInitialLoading(false)
        })
    }
  }, [id, isEditing, form])

  useEffect(() => {
    form.setFieldsValue({
      courseIds: selectedCourses.map((course) => course.course_id),
    })
  }, [selectedCourses, form])

  const handleSubmit = () => {
    form
      .validateFields(['name', 'description', 'courseIds'])
      .then((values) => {
        if (selectedCourses.length === 0) {
          message.error('Please add at least one course to the template')
          return
        }

        setLoading(true)

        const formData = {
          name: values.name,
          description: values.description,
          course_ids: selectedCourses.map((course) => course.course_id),
        }

        const apiRequest = isEditing
          ? templatepath.updateTemplatePath({ ...formData, id: parseInt(id) })
          : templatepath.createTemplatePath(formData)

        apiRequest
          .then((response) => {
            if (response && response.data && response.status == 1) {
              navigate('/templates')
            } else {
              throw new Error('Failed to save template')
            }
          })
          .catch((error) => {
            console.error('Error saving template:', error)
          })
          .finally(() => {
            setLoading(false)
          })
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
            <Spin size="large" tip="Loading template data...">
              <div className="spin-content" style={{ minHeight: '200px' }} />
            </Spin>
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
