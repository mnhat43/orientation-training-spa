import React from 'react'
import { Empty, Table, Button, Tooltip, Tag } from 'antd'
import { CheckOutlined, CheckCircleFilled } from '@ant-design/icons'
import './TraineeTable.scss'

const TraineeTable = ({
  trainees,
  loading,
  setSelectedTrainee,
  selectedTrainee,
}) => {
  const columns = [
    {
      title: 'Full Name',
      dataIndex: 'fullname',
      key: 'fullname',
      width: '25%',
      ellipsis: true,
      render: (text) => (
        <Tooltip placement="topLeft" title={text}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      width: '20%',
      ellipsis: true,
      render: (text) => (
        <Tooltip placement="topLeft" title={text}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: '30%',
      ellipsis: true,
      render: (text) => (
        <Tooltip placement="topLeft" title={text}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Join Date',
      dataIndex: 'joinedDate',
      key: 'joinedDate',
      width: '15%',
      ellipsis: true,
    },
    {
      title: 'Action',
      key: 'action',
      width: '10%',
      align: 'center',
      render: (_, record) => {
        const isSelected = selectedTrainee?.userID === record.userID

        return (
          <div className="trainee-selection-action">
            {isSelected ? (
              <Tag color="success" className="selected-tag">
                <CheckCircleFilled /> Selected
              </Tag>
            ) : (
              <Button
                type="primary"
                shape="round"
                size="small"
                className="select-btn"
                onClick={(e) => {
                  e.stopPropagation() // Prevent row click event
                  setSelectedTrainee(record)
                }}
              >
                Select
              </Button>
            )}
          </div>
        )
      },
    },
  ]

  return (
    <div className="trainee-table-container">
      <Table
        rowKey="email"
        columns={columns}
        dataSource={trainees}
        loading={loading}
        rowClassName={(record) =>
          selectedTrainee?.userID === record.userID ? 'selected-table-row' : ''
        }
        onRow={(record) => ({
          onClick: () => setSelectedTrainee(record),
          className:
            selectedTrainee?.userID === record.userID
              ? 'clickable selected-row'
              : 'clickable',
        })}
        pagination={{
          defaultPageSize: 5,
          showSizeChanger: true,
          pageSizeOptions: ['5', '10', '20', '50'],
          showTotal: (total) => `Total ${total} trainees`,
          size: 'small',
        }}
        size="small"
        className="compact-trainee-table"
        locale={{
          emptyText: <Empty description="No trainees found" />,
        }}
        scroll={{ x: 'max-content' }}
        style={{ width: '100%', overflowX: 'auto' }}
      />
    </div>
  )
}

export default TraineeTable
