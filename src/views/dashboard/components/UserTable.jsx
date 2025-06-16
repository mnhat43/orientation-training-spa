import React from 'react'
import {
  Table,
  Tag,
  Avatar,
  Space,
  Button,
  Empty,
  Tooltip,
  Popconfirm,
} from 'antd'
import {
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
  PhoneOutlined,
} from '@ant-design/icons'
import LastLoginCell from './LastLoginCell'

const UserTable = ({ users, loading, onEditUser, onDeleteUser }) => {
  const columns = [
    {
      title: 'User',
      key: 'user',
      render: (_, record) => (
        <Space>
          <Avatar src={record.avatar} icon={<UserOutlined />} size="large" />
          <div>
            <div className="user-name">{record.fullname}</div>
            <div style={{ color: '#666', fontSize: '12px' }}>
              {record.email}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      render: (dept) => <Tag color="blue">{dept}</Tag>,
    },
    {
      title: 'Role',
      dataIndex: 'role_name',
      key: 'role_name',
      render: (role_name) => {
        let color = 'default'

        if (role_name === 'Manager') {
          color = 'orange'
        } else if (role_name === 'Employee') {
          color = 'blue'
        }

        return <Tag color={color}>{role_name}</Tag>
      },
    },
    {
      title: 'Last Login',
      dataIndex: 'last_login',
      key: 'last_login',
      width: 150,
      render: (lastLogin) => <LastLoginCell lastLogin={lastLogin} />,
    },
    {
      title: 'Contact',
      key: 'contact',
      render: (_, record) => (
        <div>
          {record.phone_number && (
            <div>
              <PhoneOutlined style={{ marginRight: 4 }} />
              {record.phone_number}
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit User">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => onEditUser(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Delete User"
            description="Are you sure you want to delete this user?"
            onConfirm={() => onDeleteUser(record.user_id)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete User">
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <Table
      columns={columns}
      dataSource={users}
      rowKey="user_id"
      loading={loading}
      pagination={{
        pageSize: 5,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} of ${total} users`,
        position: ['bottomCenter'],
      }}
      locale={{
        emptyText: (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No users found"
          />
        ),
      }}
    />
  )
}

export default UserTable
