import React, { useState, useEffect } from 'react'
import { Tabs } from 'antd'
import { UserOutlined, FileTextOutlined } from '@ant-design/icons'
import './index.scss'

import EmployeeOverview from './components/EmployeeOverview'
import PendingReviews from './components/PendingReviews'
import EmployeeProfile from './components/EmployeeProfile'

import { mockEmployees, mockPendingReviews } from './data/mockData'

const ManageEmployees = () => {
  const [activeTab, setActiveTab] = useState(1)
  const [employees, setEmployees] = useState([])
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null)
  const [pendingReviews, setPendingReviews] = useState([])

  useEffect(() => {
    const fetchEmployees = () => {
      setEmployees(mockEmployees)
    }
    const fetchPendingReviews = () => {
      setPendingReviews(mockPendingReviews)
    }

    fetchEmployees()
    fetchPendingReviews()
  }, [])

  const handleReviewSubmission = (values) => {
    console.log(`Review #${values.submission_id} graded:`, values)

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
  }

  const selectEmployee = (employee) => {
    setSelectedEmployeeId(employee.id)
    setActiveTab(3)
  }

  const handleTabChange = (key) => {
    setActiveTab(key)
    if (key !== 3) {
      setSelectedEmployeeId(null)
    }
  }

  const getTabItems = () => {
    const items = [
      {
        key: 1,
        label: (
          <span>
            <UserOutlined />
            Overview
          </span>
        ),
        children: (
          <EmployeeOverview
            employees={employees}
            selectEmployee={selectEmployee}
          />
        ),
      },
      {
        key: 2,
        label: (
          <span>
            <FileTextOutlined />
            Reviews ({pendingReviews.length})
          </span>
        ),
        children: (
          <PendingReviews
            pendingReviews={pendingReviews}
            handleReviewSubmission={handleReviewSubmission}
          />
        ),
      },
    ]

    if (selectedEmployeeId) {
      const selectedEmployee = employees.find(
        (emp) => emp.id === selectedEmployeeId,
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
        children: <EmployeeProfile userId={selectedEmployeeId} />,
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
