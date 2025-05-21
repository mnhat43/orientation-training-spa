import React, { memo } from 'react'
import { Dropdown, Button, Avatar } from 'antd'
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

  const menuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: <Link to="/profile">Profile</Link>,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: onLogout,
    },
  ]

  return (
    <Dropdown menu={{ items: menuItems }} trigger={['click']}>
      <div className="user-dropdown-trigger">
        <Avatar size="small" icon={<UserOutlined />} />
        <span className="username">{currentUser.fullname || 'User'}</span>
      </div>
    </Dropdown>
  )
}

export default memo(UserMenu)
