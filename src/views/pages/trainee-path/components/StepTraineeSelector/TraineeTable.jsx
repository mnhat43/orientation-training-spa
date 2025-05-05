import React from 'react'
import { Empty, Table } from 'antd'

const TraineeTable = ({ trainees, loading, setSelectedTrainee }) => {
  const columns = [
    {
      title: 'Full Name',
      dataIndex: 'fullname',
      key: 'fullname',
      sorter: (a, b) => a.fullname.localeCompare(b.fullname),
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Join Date',
      dataIndex: 'joinDate',
      key: 'joinDate',
      sorter: (a, b) => new Date(a.joinDate) - new Date(b.joinDate),
    },
  ]

  const handleRowClick = (record) => {
    return {
      onClick: () => {
        setSelectedTrainee(record)
      },
    }
  }

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
          pageSizeOptions: ['5', '10', '20'],
          showTotal: (total) => `Total ${total} trainees`,
        }}
        onRow={handleRowClick}
        locale={{
          emptyText: <Empty description="No trainees found" />,
        }}
      />
    </div>
  )
}

export default TraineeTable
