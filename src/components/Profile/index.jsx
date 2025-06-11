import React, { useRef } from 'react'
import { Drawer, Divider, Typography } from 'antd'
import ProfileInformationForm from './ProfileInformationForm'
import ChangePasswordForm from './ChangePasswordForm'
import './ProfileDrawer.scss'

const { Title } = Typography

const ProfileDrawer = ({ visible, onClose, currentUser, onUpdateUser }) => {
  const profileFormRef = useRef()
  const passwordFormRef = useRef()

  const handleDrawerClose = () => {
    if (profileFormRef.current?.resetForm) {
      profileFormRef.current.resetForm()
    }
    if (passwordFormRef.current?.resetForm) {
      passwordFormRef.current.resetForm()
    }
    onClose()
  }

  return (
    <Drawer
      placement="right"
      width={600}
      open={visible}
      onClose={handleDrawerClose}
      className="profile-drawer"
      destroyOnClose
      title={<Title level={4}>Profile Settings</Title>}
    >
      <div className="profile-drawer-content">
        <ProfileInformationForm
          ref={profileFormRef}
          currentUser={currentUser}
          onUpdateUser={onUpdateUser}
        />

        <Divider />

        <ChangePasswordForm ref={passwordFormRef} currentUser={currentUser} />
      </div>
    </Drawer>
  )
}

export default ProfileDrawer
