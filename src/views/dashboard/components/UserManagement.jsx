import React, { useState, useEffect } from 'react'
import { Form, message } from 'antd'
import userAPI from '@api/user'
import UserStatsCards from './UserStatsCards'
import UserFilters from './UserFilters'
import UserTable from './UserTable'
import UserModal from './UserModal'

const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchText, setSearchText] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState(null)
  const [roleFilter, setRoleFilter] = useState(null)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [addModalVisible, setAddModalVisible] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [modalLoading, setModalLoading] = useState(false)
  const [form] = Form.useForm()

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await userAPI.getAllUsers()
      if (response.data && response.status === 1) {
        setUsers(response.data)
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleEditUser = (user) => {
    setSelectedUser(user)
    setEditModalVisible(true)
  }
  const handleUpdateUser = async (values) => {
    setModalLoading(true)
    try {
      const response = await userAPI.updateUser({
        user_id: selectedUser.user_id,
        ...values,
      })

      if (response.status === 1) {
        message.success('User updated successfully')
        setEditModalVisible(false)
        setSelectedUser(null)
        fetchUsers()
      }
    } catch (error) {
      console.error('Failed to update user:', error)
    } finally {
      setModalLoading(false)
    }
  }

  const handleDeleteUser = async (userId) => {
    try {
      const response = await userAPI.deleteUser(userId)

      if (response.status === 1) {
        message.success('User deleted successfully')
        fetchUsers()
      }
    } catch (error) {
      console.error('Failed to delete user:', error)
    }
  }
  const handleAddUser = async (values) => {
    setModalLoading(true)
    try {
      const response = await userAPI.register(values)

      if (response.status === 1) {
        message.success('User created successfully')
        setAddModalVisible(false)
        fetchUsers()
      }
    } catch (error) {
      console.error('Failed to create user:', error)
    } finally {
      setModalLoading(false)
    }
  }

  const userStats = {
    total: users.filter((user) => user.role_name !== 'Admin').length,
    managers: users.filter((user) => user.role_name === 'Manager').length,
    employees: users.filter((user) => user.role_name === 'Employee').length,
  }
  const filteredUsers = users
    .filter((user) => user.role_name !== 'Admin')
    .filter((user) => {
      const matchesSearch =
        !searchText ||
        user.fullname?.toLowerCase().includes(searchText.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchText.toLowerCase()) ||
        user.department?.toLowerCase().includes(searchText.toLowerCase())

      const matchesDepartment =
        !departmentFilter || user.department === departmentFilter

      const matchesRole = !roleFilter || user.role_name === roleFilter

      return matchesSearch && matchesDepartment && matchesRole
    })

  return (
    <div className="user-management">
      {/* Statistics Cards */}
      <UserStatsCards userStats={userStats} />
      {/* Filters and Search */}
      <UserFilters
        searchText={searchText}
        setSearchText={setSearchText}
        departmentFilter={departmentFilter}
        setDepartmentFilter={setDepartmentFilter}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        onAddUser={() => setAddModalVisible(true)}
      />
      {/* Users Table */}
      <UserTable
        users={filteredUsers}
        loading={loading}
        onEditUser={handleEditUser}
        onDeleteUser={handleDeleteUser}
      />
      {/* Edit User Modal */}
      <UserModal
        visible={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false)
          setSelectedUser(null)
        }}
        onFinish={handleUpdateUser}
        form={form}
        title="Edit User"
        isEdit={true}
        loading={modalLoading}
        selectedUser={selectedUser}
      />
      {/* Add User Modal */}
      <UserModal
        visible={addModalVisible}
        onCancel={() => setAddModalVisible(false)}
        onFinish={handleAddUser}
        form={form}
        title="Add New User"
        isEdit={false}
        loading={modalLoading}
        selectedUser={null}
      />
    </div>
  )
}

export default UserManagement
