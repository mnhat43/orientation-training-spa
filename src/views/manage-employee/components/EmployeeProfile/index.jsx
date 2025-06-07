import React, { useState, useEffect } from 'react'
import { Row, Col, Form, Spin, message } from 'antd'
import ProfileSummary from './ProfileSummary'
import CourseTimeline from './CourseTimeline'
import './index.scss'
import userApi from '@/api/user'
import userprogress from '@/api/userprogress'

const EmployeeProfile = ({ userId, setActiveTab }) => {
  const [employeeData, setEmployeeData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [form] = Form.useForm()

  const fetchEmployeeData = async (showLoading = true) => {
    if (showLoading) {
      setLoading(true)
    }

    try {
      const response = await userApi.employeeDetails({ user_id: userId })

      if (response && response.data && response.status === 1) {
        setEmployeeData(response.data)
      } else {
        console.error(`Employee data with ID ${userId} not found`)
      }
    } catch (error) {
      console.error('Error fetching employee data:', error)
    } finally {
      if (showLoading) {
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    if (userId) {
      fetchEmployeeData(true)
    }
  }, [userId])

  const handleCreateAssessment = async (courseId, assessmentValues) => {
    if (assessmentValues) {
      const { performance_rating, performance_comment } = assessmentValues
      const employeeId = employeeData?.userInfo?.id

      try {
        const reviewData = {
          user_id: employeeId,
          course_id: courseId,
          performance_rating,
          performance_comment,
        }

        const response = await userprogress.reviewProgress(reviewData)

        if (response && response.status === 1) {
          message.success('Assessment submitted successfully')

          fetchEmployeeData(false)
        } else {
          message.error('Failed to submit assessment')
        }
      } catch (error) {
        console.error('Error submitting assessment:', error)
        message.error('An error occurred while submitting the assessment')
      }
    } else {
      form.resetFields()
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
        <div className="loading-text">Loading employee profile...</div>
      </div>
    )
  }

  if (!employeeData) {
    return <div>Employee data not found</div>
  }

  return (
    <div className="employee-profile">
      <Row gutter={[24, 24]}>
        <Col xs={24} md={10} lg={8}>
          <ProfileSummary
            userInfo={employeeData.userInfo}
            processStats={employeeData.processStats}
          />
        </Col>

        <Col xs={24} md={14} lg={16}>
          <CourseTimeline
            processInfo={employeeData.processInfo}
            handleCreateAssessment={handleCreateAssessment}
            setActiveTab={setActiveTab}
          />
        </Col>
      </Row>
    </div>
  )
}

export default EmployeeProfile
