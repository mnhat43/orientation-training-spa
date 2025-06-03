import React, { useState, useEffect } from 'react'
import { Row, Col, Form, Spin } from 'antd'
import ProfileSummary from './ProfileSummary'
import CourseTimeline from './CourseTimeline'
import './index.scss'
import userApi from '@/api/user'

const EmployeeProfile = ({ userId, setActiveTab }) => {
  const [employeeData, setEmployeeData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [form] = Form.useForm()

  useEffect(() => {
    if (userId) {
      const fetchEmployeeData = async () => {
        setLoading(true)
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
          setLoading(false)
        }
      }

      fetchEmployeeData()
    }
  }, [userId])

  const handleCreateAssessment = (course, assessmentValues) => {
    if (assessmentValues) {
      const { rating, feedback } = assessmentValues
      console.log('Assessment submitted for:', course, { rating, feedback })
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
