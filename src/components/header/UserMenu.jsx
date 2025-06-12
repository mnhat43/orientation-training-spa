import React, { memo, useState } from 'react'
import { Dropdown, Button, Avatar } from 'antd'
import {
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  CommentOutlined,
} from '@ant-design/icons'
import ProfileDrawer from '@components/Profile'
import FeedbackModal from '@components/Feedback'
import { ROLES } from '@constants/roles'

const UserMenu = ({ currentUser, onLogout, navigate, onUpdateUser }) => {
  const [profileDrawerVisible, setProfileDrawerVisible] = useState(false)
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false)

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

  const handleOpenFeedback = () => {
    setFeedbackModalVisible(true)
  }
  const handleCloseFeedback = () => {
    setFeedbackModalVisible(false)
  }

  const canProvideFeedback =
    currentUser?.role_id === ROLES.MANAGER ||
    currentUser?.role_id === ROLES.EMPLOYEE

  const baseMenuItems = [
    {
      key: 'profile',
      icon: <SettingOutlined />,
      label: 'Profile Settings',
      onClick: handleOpenProfile,
    },
  ]

  const feedbackMenuItem = canProvideFeedback
    ? [
        {
          key: 'feedback',
          icon: <CommentOutlined />,
          label: 'Provide Feedback',
          onClick: handleOpenFeedback,
        },
      ]
    : []

  const menuItems = [
    ...baseMenuItems,
    ...feedbackMenuItem,
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
      {' '}
      <Dropdown
        menu={{ items: menuItems }}
        trigger={['click']}
        placement="bottomRight"
        overlayClassName="user-dropdown-overlay"
        getPopupContainer={(trigger) => trigger.parentNode}
      >
        <div
          className="user-dropdown-trigger"
          onClick={(e) => e.preventDefault()}
        >
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
      <FeedbackModal
        visible={feedbackModalVisible}
        onClose={handleCloseFeedback}
        currentUser={currentUser}
      />
    </>
  )
}

export default memo(UserMenu)
