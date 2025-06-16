import React, { useState, useEffect } from 'react'
import {
  Card,
  Table,
  Rate,
  Space,
  Button,
  Select,
  message,
  Row,
  Col,
  Statistic,
  Empty,
  Tooltip,
  Popconfirm,
  Typography,
  Avatar,
  Tag,
  Input,
} from 'antd'
import {
  CommentOutlined,
  StarOutlined,
  FilterOutlined,
  DeleteOutlined,
  HeartOutlined,
  UserOutlined,
  SearchOutlined,
  BarChartOutlined,
  RiseOutlined,
  FallOutlined,
} from '@ant-design/icons'
import { listAppFeedback, deleteAppFeedback } from '@api/feedback'
import moment from 'moment'

const { Option } = Select
const { Text, Paragraph } = Typography

const FeedbackManagement = () => {
  const [feedbacks, setFeedbacks] = useState([])
  const [loading, setLoading] = useState(true)
  const [ratingFilter, setRatingFilter] = useState('all')
  const [searchText, setSearchText] = useState('')

  useEffect(() => {
    fetchFeedbacks()
  }, [])
  const fetchFeedbacks = async () => {
    setLoading(true)
    try {
      const response = await listAppFeedback()

      if (response.data && response.status === 1) {
        setFeedbacks(response.data)
      } else {
        console.warn('No feedback data found in response')
        setFeedbacks([])
      }
    } catch (error) {
      console.error('Failed to fetch feedbacks:', error)
      setFeedbacks([])
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteFeedback = async (feedbackId) => {
    try {
      await deleteAppFeedback({ id: feedbackId })
      message.success('Feedback deleted successfully')
      fetchFeedbacks()
    } catch (error) {
      console.error('Failed to delete feedback:', error)
      message.error('Failed to delete feedback')
    }
  }

  const feedbackStats = {
    total: feedbacks?.length || 0,
    averageRating:
      feedbacks?.length > 0
        ? (
            feedbacks.reduce((sum, f) => sum + (f?.rating || 0), 0) /
            feedbacks.length
          ).toFixed(1)
        : 0,
    highRating: feedbacks?.filter((f) => f?.rating >= 4.0)?.length || 0,
    mediumRating:
      feedbacks?.filter((f) => f?.rating >= 2.0 && f?.rating < 4.0)?.length ||
      0,
    lowRating: feedbacks?.filter((f) => f?.rating < 2.0)?.length || 0,
    thisMonth:
      feedbacks?.filter((f) =>
        moment(f?.submit_at).isAfter(moment().startOf('month')),
      )?.length || 0,
    lastMonth:
      feedbacks?.filter((f) =>
        moment(f?.submit_at).isBetween(
          moment().subtract(1, 'month').startOf('month'),
          moment().subtract(1, 'month').endOf('month'),
        ),
      )?.length || 0,
  }

  const monthlyTrend = feedbackStats.thisMonth - feedbackStats.lastMonth
  const trendPercentage =
    feedbackStats.lastMonth > 0
      ? ((monthlyTrend / feedbackStats.lastMonth) * 100).toFixed(1)
      : 0

  const filteredFeedbacks = (feedbacks || []).filter((feedback) => {
    const matchesRating =
      ratingFilter === 'all' ||
      (ratingFilter === 'high' && feedback?.rating >= 4.0) ||
      (ratingFilter === 'medium' &&
        feedback?.rating >= 2.0 &&
        feedback?.rating < 4.0) ||
      (ratingFilter === 'low' && feedback?.rating < 2.0)
    const matchesSearch =
      !searchText ||
      feedback?.feedback?.toLowerCase().includes(searchText.toLowerCase()) ||
      feedback?.user?.first_name
        ?.toLowerCase()
        .includes(searchText.toLowerCase()) ||
      feedback?.user?.last_name
        ?.toLowerCase()
        .includes(searchText.toLowerCase()) ||
      feedback?.user?.email?.toLowerCase().includes(searchText.toLowerCase()) ||
      `${feedback?.user?.first_name} ${feedback?.user?.last_name}`
        .toLowerCase()
        .includes(searchText.toLowerCase())

    return matchesRating && matchesSearch
  })
  const ratingDistribution = [
    {
      rating: 5.0,
      label: '5.0',
      count: feedbacks?.filter((f) => f?.rating === 5.0)?.length || 0,
    },
    {
      rating: 4.5,
      label: '4.5',
      count: feedbacks?.filter((f) => f?.rating === 4.5)?.length || 0,
    },
    {
      rating: 4.0,
      label: '4.0',
      count: feedbacks?.filter((f) => f?.rating === 4.0)?.length || 0,
    },
    {
      rating: 3.5,
      label: '3.5',
      count: feedbacks?.filter((f) => f?.rating === 3.5)?.length || 0,
    },
    {
      rating: 3.0,
      label: '3.0',
      count: feedbacks?.filter((f) => f?.rating === 3.0)?.length || 0,
    },
    {
      rating: 2.5,
      label: '2.5',
      count: feedbacks?.filter((f) => f?.rating === 2.5)?.length || 0,
    },
    {
      rating: 2.0,
      label: '2.0',
      count: feedbacks?.filter((f) => f?.rating === 2.0)?.length || 0,
    },
    {
      rating: 1.5,
      label: '1.5',
      count: feedbacks?.filter((f) => f?.rating === 1.5)?.length || 0,
    },
    {
      rating: 1.0,
      label: '1.0',
      count: feedbacks?.filter((f) => f?.rating === 1.0)?.length || 0,
    },
    {
      rating: 0.5,
      label: '0.5',
      count: feedbacks?.filter((f) => f?.rating === 0.5)?.length || 0,
    },
  ]
  const columns = [
    {
      title: 'User',
      key: 'user',
      render: (_, record) => (
        <Space>
          <Avatar src={record.user?.avatar} icon={<UserOutlined />} size={40} />
          <div>
            <div style={{ fontWeight: '500' }}>
              {record.user
                ? `${record.user.first_name} ${record.user.last_name}`
                : 'Anonymous'}
            </div>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {record.user?.email || 'No email'}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      sorter: (a, b) => a.rating - b.rating,
      render: (rating) => (
        <Space>
          <Rate
            disabled
            value={rating}
            allowHalf
            style={{ fontSize: '14px' }}
          />
          <Tag
            color={rating >= 4.0 ? 'green' : rating >= 2.0 ? 'orange' : 'red'}
          >
            {rating}/5
          </Tag>
        </Space>
      ),
    },
    {
      title: 'Feedback Preview',
      dataIndex: 'feedback',
      key: 'feedback',
      render: (text) => (
        <Tooltip
          title={text || 'No feedback text provided'}
          placement="topLeft"
          overlayStyle={{ maxWidth: '400px' }}
        >
          <Paragraph
            ellipsis={{ rows: 2, expandable: false }}
            style={{ margin: 0, maxWidth: '300px', cursor: 'pointer' }}
          >
            {text || 'No feedback text provided'}
          </Paragraph>
        </Tooltip>
      ),
    },
    {
      title: 'Date Submitted',
      dataIndex: 'submit_at',
      key: 'submit_at',
      sorter: (a, b) => moment(a.submit_at).unix() - moment(b.submit_at).unix(),
      render: (date) => (
        <div>
          <div>{date ? moment(date).format('MMM DD, YYYY') : 'N/A'}</div>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {date ? moment(date).format('hh:mm A') : ''}
          </Text>
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Popconfirm
          title="Delete Feedback"
          description="Are you sure you want to delete this feedback?"
          onConfirm={() => handleDeleteFeedback(record.id)}
          okText="Yes"
          cancelText="No"
        >
          <Tooltip title="Delete">
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Tooltip>
        </Popconfirm>
      ),
    },
  ]

  return (
    <div>
      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic
              title="Total Feedbacks"
              value={feedbackStats.total}
              prefix={<CommentOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic
              title="Average Rating"
              value={feedbackStats.averageRating}
              suffix="/ 5"
              prefix={<StarOutlined style={{ color: '#faad14' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic
              title="High Rating (4+)"
              value={feedbackStats.highRating}
              prefix={<HeartOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic
              title="This Month"
              value={feedbackStats.thisMonth}
              prefix={
                monthlyTrend >= 0 ? (
                  <RiseOutlined style={{ color: '#52c41a' }} />
                ) : (
                  <FallOutlined style={{ color: '#ff4d4f' }} />
                )
              }
              suffix={
                <Text
                  type={monthlyTrend >= 0 ? 'success' : 'danger'}
                  style={{ fontSize: '12px' }}
                >
                  {monthlyTrend >= 0 ? '+' : ''}
                  {trendPercentage}%
                </Text>
              }
            />
          </Card>
        </Col>
      </Row>{' '}
      {/* Rating Distribution */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24}>
          <Card
            title={
              <Space>
                <BarChartOutlined />
                <span>Rating Distribution</span>
              </Space>
            }
          >
            <Row gutter={[8, 16]}>
              {ratingDistribution
                .filter((item) => item.count > 0)
                .map((item) => (
                  <Col xs={12} sm={8} md={6} lg={4} xl={3} key={item.rating}>
                    <div
                      style={{
                        textAlign: 'center',
                        padding: '12px 8px',
                        border: '1px solid #f0f0f0',
                        borderRadius: '8px',
                        backgroundColor: '#fafafa',
                      }}
                    >
                      <div style={{ marginBottom: '12px' }}>
                        <Rate
                          disabled
                          value={item.rating}
                          allowHalf
                          style={{ fontSize: '16px' }}
                        />
                      </div>
                      <div
                        style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#1890ff',
                          marginBottom: '4px',
                        }}
                      >
                        {item.label} ⭐
                      </div>
                      <div
                        style={{
                          fontSize: '24px',
                          fontWeight: 'bold',
                          color: '#1890ff',
                          marginBottom: '4px',
                        }}
                      >
                        {item.count}
                      </div>{' '}
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        {(feedbacks?.length || 0) > 0
                          ? (
                              (item.count / (feedbacks?.length || 1)) *
                              100
                            ).toFixed(1)
                          : 0}
                        %
                      </div>
                    </div>
                  </Col>
                ))}
              {ratingDistribution.every((item) => item.count === 0) && (
                <Col xs={24}>
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="No ratings available"
                    style={{ padding: '40px 0' }}
                  />
                </Col>
              )}
            </Row>
          </Card>
        </Col>
      </Row>
      {/* Filters and Search */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={8} md={6}>
            <Input
              placeholder="Search feedbacks..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
              style={{ height: '42px', width: '100%' }}
            />
          </Col>
          <Col xs={24} sm={8} md={6}>
            <Select
              placeholder="Filter by rating"
              value={ratingFilter}
              onChange={setRatingFilter}
              suffixIcon={<FilterOutlined />}
              style={{ height: '42px', width: '100%' }}
            >
              <Option value="all">All Ratings</Option>
              <Option value="high">High (4-5 stars)</Option>
              <Option value="medium">Medium (2-3 stars)</Option>
              <Option value="low">Low (1 star)</Option>
            </Select>
          </Col>
        </Row>
      </Card>
      {/* Feedbacks Table */}
      <Card title={`Application Feedbacks (${filteredFeedbacks.length})`}>
        <Table
          columns={columns}
          dataSource={filteredFeedbacks}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} feedbacks`,
          }}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No feedbacks found"
              />
            ),
          }}
        />
      </Card>
    </div>
  )
}

export default FeedbackManagement
