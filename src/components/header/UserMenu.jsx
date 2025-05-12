import React, { memo } from 'react'
import { Menu, Dropdown, Button, Avatar } from 'antd'
import { UserOutlined, LogoutOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'

const UserMenu = ({ currentUser, onLogout, navigate }) => {
  if (!currentUser) {
    return (
      <Button type="primary" size="middle" onClick={() => navigate('/login')}>
        Login
      </Button>
    )
  }

  const dropdownMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        <Link to="/profile">Profile</Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={onLogout}>
        Logout
      </Menu.Item>
    </Menu>
  )

  return (
    <Dropdown overlay={dropdownMenu} trigger={['click']}>
      <div className="user-dropdown-trigger">
        <Avatar size="small" icon={<UserOutlined />} />
        <span className="username">{currentUser.fullname || 'User'}</span>
      </div>
    </Dropdown>
  )
}

export default memo(UserMenu)
