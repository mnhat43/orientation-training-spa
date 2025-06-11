import React, { memo, useState } from 'react'
import { Dropdown, Button, Avatar } from 'antd'
import {
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import ProfileDrawer from '@components/Profile'

const UserMenu = ({ currentUser, onLogout, navigate, onUpdateUser }) => {
  const [profileDrawerVisible, setProfileDrawerVisible] = useState(false)

  if (!currentUser) {
    return (
      <Button type="primary" size="middle" onClick={() => navigate('/login')}>
        Login
      </Button>
    )
  }

  const handleOpenProfile = () => {
    setProfileDrawerVisible(true)
  }

  const handleCloseProfile = () => {
    setProfileDrawerVisible(false)
  }

  const menuItems = [
    {
      key: 'profile',
      icon: <SettingOutlined />,
      label: 'Profile Settings',
      onClick: handleOpenProfile,
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
    <>
      <Dropdown
        menu={{ items: menuItems }}
        trigger={['click']}
        placement="bottomRight"
        overlayClassName="user-dropdown-overlay"
      >
        <div className="user-dropdown-trigger">
          <Avatar
            size="small"
            src={currentUser.avatar}
            icon={!currentUser.avatar && <UserOutlined />}
          />
          <span className="username">{currentUser.fullname || 'User'}</span>
        </div>
      </Dropdown>

      <ProfileDrawer
        visible={profileDrawerVisible}
        onClose={handleCloseProfile}
        currentUser={currentUser}
        onUpdateUser={onUpdateUser}
      />
    </>
  )
}

export default memo(UserMenu)
