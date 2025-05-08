import React from 'react'
import { Empty, Table, Button, Tooltip } from 'antd'
import { UserAddOutlined, CheckCircleFilled } from '@ant-design/icons'
import './TraineeTable.scss'

const TraineeTable = ({ trainees, loading, setSelectedTrainee }) => {
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
      dataIndex: 'joinDate',
      key: 'joinDate',
      width: '15%',
      ellipsis: true,
    },
    {
      title: 'Action',
      key: 'action',
      width: '10%',
      align: 'center',
      render: (_, record) => {
        return (
          <Tooltip title={'Select this trainee'}>
            <Button
              type={'primary'}
              className={`select-trainee-btn}`}
              onClick={() => setSelectedTrainee(record)}
              icon={<UserAddOutlined />}
            >
              Select
            </Button>
          </Tooltip>
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
