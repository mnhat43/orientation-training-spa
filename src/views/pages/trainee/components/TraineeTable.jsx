import React from 'react'
import {
  Table,
  Space,
  Avatar,
  Tooltip,
  Tag,
  Button,
  Empty,
  Spin,
  Typography,
} from 'antd'
import {
  UserOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  EyeOutlined,
  BookOutlined,
  DeleteOutlined,
} from '@ant-design/icons'
import StatusHelp from './StatusHelp'

const { Text } = Typography

const TraineeTable = ({
  loading,
  trainees,
  activeTab,
  rowSelection,
  pendingReviewsCount,
  onViewPendingReviews,
  onViewProfile,
  onAssignCourse,
  onDeleteTrainee,
}) => {
  const columns = [
    {
      title: 'Full Name',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <Space>
          <Text>{name}</Text>
        </Space>
      ),
      width: 200, // Fixed width for name column
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 250, // Fixed width for email column (longer to accommodate email addresses)
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      width: 180, // Fixed width for department column
    },
    {
      title: (
        <div className="column-title-with-icon">
          <span>Training Status</span>
          <StatusHelp
            pendingReviewsCount={pendingReviewsCount}
            activeTab={activeTab}
            onShowPendingReviews={onViewPendingReviews}
          />
        </div>
      ),
      key: 'progress',
      render: (_, record) => {
        const pendingReviewCourses = record.pendingReviewCourses || 0
        const showPendingReviews =
          record.status !== 'Not Started' && pendingReviewCourses > 0
        const statusColor =
          {
            'Not Started': '#bfbfbf',
            'In Progress': '#1890ff',
            Completed: '#52c41a',
          }[record.status] || '#bfbfbf'
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Tooltip title={`Overall status: ${record.status}`}>
                <Text strong style={{ color: statusColor }}>
                  {record.status}
                </Text>
              </Tooltip>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
              >
                <Tooltip
                  title={`${record.completedCourses} courses completed and passed`}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '2px',
                    }}
                  >
                    <CheckCircleOutlined style={{ color: '#52c41a' }} />
                    <Text>{record.completedCourses}</Text>
                  </div>
                </Tooltip>
                <Tooltip
                  title={`${record.inProgressCourses} courses in progress or waiting for trainee to complete`}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '2px',
                    }}
                  >
                    <ClockCircleOutlined style={{ color: '#1890ff' }} />
                    <Text>{record.inProgressCourses}</Text>
                  </div>
                </Tooltip>

                {showPendingReviews && (
                  <Tooltip
                    title={`${pendingReviewCourses} courses completed by trainee and waiting for manager review`}
                  >
                    <WarningOutlined style={{ color: '#faad14' }} />
                  </Tooltip>
                )}
                <Tooltip
                  title={`Total of ${record.totalCourses} courses assigned`}
                >
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    ({record.totalCourses})
                  </Text>
                </Tooltip>
              </div>
            </div>
          </div>
        )
      },
      width: 260, // Fixed width for status column (wider to accommodate the status indicators)
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div className="action-buttons-cell">
          <Tooltip title="View Trainee Profile">
            <Button
              type="text"
              icon={<EyeOutlined className="view-icon" />}
              onClick={() => onViewProfile(record)}
              className="action-button view-button"
            />
          </Tooltip>
          <Tooltip title="Assign Training Courses">
            <Button
              type="text"
              icon={<BookOutlined className="assign-icon" />}
              onClick={() => onAssignCourse(record)}
              className="action-button assign-button"
            />
          </Tooltip>
          <Tooltip title="Delete Trainee">
            <Button
              type="text"
              icon={<DeleteOutlined className="delete-icon" />}
              onClick={() => onDeleteTrainee(record)}
              className="action-button delete-button"
            />
          </Tooltip>
        </div>
      ),
      width: 120, // Fixed width for actions column
      fixed: 'right', // Keep actions visible when scrolling horizontally
    },
  ]

  return (
    <div className="trainees-table-container">
      <Spin spinning={loading}>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={trainees}
          rowKey="id"
          scroll={{ x: 1010 }} // Enable horizontal scrolling if needed (sum of column widths)
          pagination={{
            defaultPageSize: 5,
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '20', '50'],
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} trainees`,
            position: ['bottomRight'],
          }}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  activeTab === 'pending-review'
                    ? 'No courses are pending review'
                    : 'No trainees found'
                }
              />
            ),
          }}
        />
      </Spin>
    </div>
  )
}

export default TraineeTable
