import React, { useState, useEffect } from 'react'
import { Tabs, Spin, message } from 'antd'
import {
  UserOutlined,
  FileTextOutlined,
  LoadingOutlined,
} from '@ant-design/icons'
import './index.scss'

import EmployeeOverview from './components/EmployeeOverview'
import PendingReviews from './components/PendingReviews'
import EmployeeProfile from './components/EmployeeProfile'

import userApi from '@api/user'
import quizApi from '@api/quiz'

const ManageEmployees = () => {
  const [activeTab, setActiveTab] = useState(1)
  const [overviewData, setOverviewData] = useState([])
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null)
  const [pendingReviews, setPendingReviews] = useState([])
  const [loading, setLoading] = useState(false)
  const [reviewsLoading, setReviewsLoading] = useState(false)

  useEffect(() => {
    fetchEmployees()
    fetchPendingReviews()
  }, [])

  const fetchPendingReviews = async () => {
    setReviewsLoading(true)
    try {
      const response = await quizApi.getQuizPendingReview()
      if (response.status === 1 && response.data && response.data.length > 0) {
        setPendingReviews(response.data)
      } else {
        setPendingReviews([])
      }
    } catch (error) {
      console.error('Failed to fetch pending reviews:', error)
      setPendingReviews([])
    } finally {
      setReviewsLoading(false)
    }
  }

  const fetchEmployees = async () => {
    setLoading(true)
    try {
      const response = await userApi.getEmployeeOverview()
      if (response.status === 1) {
        setOverviewData(response.data)
      }
    } catch (error) {
      console.error('Failed to fetch employee data:', error)
      setOverviewData([])
    } finally {
      setLoading(false)
    }
  }

  const refreshData = async () => {
    setLoading(true)
    try {
      const response = await userApi.getEmployeeOverview()
      setOverviewData(response.data)
    } catch (error) {
      console.error('Failed to refresh employee data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleReviewSubmission = async (values) => {
    try {
      const response = await quizApi.reviewSubmission(values)

      if (response.status === 1) {
        message.success('Review submitted successfully')

        const updatedReviews = pendingReviews
          .map((employee) => {
            const updatedEmployeeReviews = employee.reviews.filter(
              (review) => review.submission_id !== values.submission_id,
            )

            return {
              ...employee,
              reviews: updatedEmployeeReviews,
            }
          })
          .filter((employee) => employee.reviews.length > 0)

        setPendingReviews(updatedReviews)
      } else {
        message.error(
          `Failed to submit review: ${response.message || 'Unknown error'}`,
        )
        console.error('Failed to submit review:', response.message)
      }
    } catch (error) {
      message.error('Error submitting review')
      console.error('Error submitting review:', error)
    }
  }

  const handleSelectEmployee = (employeeId) => {
    setSelectedEmployeeId(employeeId)
    setActiveTab(3)
  }

  const handleTabChange = (key) => {
    setActiveTab(key)
    if (key !== 3) {
      setSelectedEmployeeId(null)
    }
  }

  const getTabItems = () => {
    const totalReviews = pendingReviews.reduce(
      (total, employee) =>
        total + (employee.reviews ? employee.reviews.length : 0),
      0,
    )

    const items = [
      {
        key: 1,
        label: (
          <span>
            <UserOutlined />
            Overview{' '}
            {loading && <LoadingOutlined spin style={{ marginLeft: 8 }} />}
          </span>
        ),
        children: (
          <Spin spinning={loading} tip="Loading employees...">
            <EmployeeOverview
              overviewData={overviewData}
              onSelectEmployee={handleSelectEmployee}
              onRefresh={refreshData}
            />
          </Spin>
        ),
      },
      {
        key: 2,
        label: (
          <span>
            <FileTextOutlined />
            Reviews Quiz Essay ({totalReviews}){' '}
            {reviewsLoading && (
              <LoadingOutlined spin style={{ marginLeft: 8 }} />
            )}
          </span>
        ),
        children: (
          <Spin spinning={reviewsLoading} tip="Loading reviews...">
            <PendingReviews
              pendingReviews={pendingReviews}
              handleReviewSubmission={handleReviewSubmission}
            />
          </Spin>
        ),
      },
    ]

    if (selectedEmployeeId) {
      const selectedEmployee = overviewData.find(
        (emp) => emp.user_id === selectedEmployeeId,
      )
      items.push({
        key: 3,
        label: (
          <span>
            <UserOutlined />
            {selectedEmployee
              ? selectedEmployee.fullname
              : `Employee #${selectedEmployeeId}`}
          </span>
        ),
        children: (
          <EmployeeProfile
            userId={selectedEmployeeId}
            setActiveTab={setActiveTab}
          />
        ),
        closable: true,
      })
    }

    return items
  }

  return (
    <div className="manage-employees-container">
      <Tabs
        activeKey={activeTab}
        onChange={handleTabChange}
        type="card"
        className="main-tabs"
        items={getTabItems()}
      />
    </div>
  )
}

export default ManageEmployees
