import React, { useState, useEffect } from 'react'
import {
  Typography,
  Input,
  Empty,
  List,
  Badge,
  Card,
  Avatar,
  Space,
  Tag,
} from 'antd'
import {
  SearchOutlined,
  UserOutlined,
  FileTextOutlined,
  DownOutlined,
  UpOutlined,
} from '@ant-design/icons'
import './PendingReviews.scss'
import ReviewsList from './ReviewsList'

const { Text } = Typography

const PendingReviews = ({ pendingReviews = [], handleReviewSubmission }) => {
  const [searchText, setSearchText] = useState('')
  const [filtered, setFiltered] = useState(pendingReviews)
  const [expandedCards, setExpandedCards] = useState({})
  const [expandedSections, setExpandedSections] = useState({})

  const toggleCard = (reviewId) => {
    setExpandedCards({
      ...expandedCards,
      [reviewId]: !expandedCards[reviewId],
    })
  }

  const toggleSection = (employeeId) => {
    setExpandedSections({
      ...expandedSections,
      [employeeId]: !expandedSections[employeeId],
    })
  }

  useEffect(() => {
    let result = [...pendingReviews]

    if (searchText) {
      result = result.filter(
        (employee) =>
          employee?.fullname
            ?.toLowerCase()
            .includes(searchText.toLowerCase()) ||
          employee?.department
            ?.toLowerCase()
            .includes(searchText.toLowerCase()) ||
          employee?.reviews?.some(
            (review) =>
              review?.question_text
                ?.toLowerCase()
                .includes(searchText.toLowerCase()) ||
              review?.course_title
                ?.toLowerCase()
                .includes(searchText.toLowerCase()) ||
              review?.answer_text
                ?.toLowerCase()
                .includes(searchText.toLowerCase()),
          ),
      )
    }
    setFiltered(result)
  }, [pendingReviews, searchText])

  useEffect(() => {
    const initialExpandedState = {}
    filtered.forEach((employee) => {
      initialExpandedState[employee.user_id] = false
    })
    setExpandedSections(initialExpandedState)
  }, [filtered])

  return (
    <Card
      title={
        <Space>
          <FileTextOutlined className="title-icon" />
          Pending Reviews
          <Badge
            count={filtered.length}
            style={{ backgroundColor: '#1890ff' }}
          />
        </Space>
      }
      className="dashboard-card"
      variant="outlined"
      extra={
        <Input
          placeholder="Search by name..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
          className="search-input"
        />
      }
    >
      <List
        grid={{ gutter: 24, column: 1 }}
        dataSource={filtered}
        locale={{
          emptyText: (
            <Empty
              description="No pending reviews found"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ),
        }}
        renderItem={(employee) => (
          <List.Item key={employee?.user_id || Math.random()}>
            <div className="employee-review-group">
              <div
                className="employee-header"
                onClick={() => toggleSection(employee?.user_id)}
              >
                <div className="employee-header-left">
                  <Avatar
                    size={32}
                    src={employee?.avatar}
                    icon={!employee?.avatar && <UserOutlined />}
                  />
                  <div className="employee-name-container">
                    <Text strong className="employee-name">
                      {employee?.fullname || 'Unknown Employee'}
                    </Text>
                    <Tag className="department-tag">
                      {employee?.department || 'Unknown Department'}
                    </Tag>
                  </div>
                </div>
                <div className="header-right">
                  <Badge
                    count={(employee?.reviews || []).length}
                    className="review-badge"
                    title={`${(employee?.reviews || []).length} pending reviews`}
                  />
                  {expandedSections[employee?.user_id] ? (
                    <UpOutlined className="toggle-icon" />
                  ) : (
                    <DownOutlined className="toggle-icon" />
                  )}
                </div>
              </div>

              {expandedSections[employee?.user_id] && employee?.reviews && (
                <div className="reviews-content">
                  <ReviewsList
                    reviews={employee.reviews}
                    expandedCards={expandedCards}
                    toggleCard={toggleCard}
                    handleReviewSubmission={handleReviewSubmission}
                  />
                </div>
              )}
            </div>
          </List.Item>
        )}
      />
    </Card>
  )
}

export default PendingReviews
