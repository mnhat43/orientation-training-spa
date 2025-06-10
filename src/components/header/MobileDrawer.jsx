import React, { memo, useCallback, useMemo, useState } from 'react'
import { Drawer, Button, Menu, Avatar } from 'antd'
import {
  CloseOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import { Link } from 'react-router-dom'
import Logo from '@components/Logo'
import useWindowSize from '@hooks/useWindowSize'
import ProfileDrawer from './ProfileDrawer'

const MobileDrawer = ({
  visible,
  onClose,
  currentUser,
  navItems,
  currentPath,
  onLogout,
  navigate,
  onUpdateUser,
}) => {
  const { width } = useWindowSize()
  const activeKey = currentPath.split('/')[1] || 'home'
  const [profileDrawerVisible, setProfileDrawerVisible] = useState(false)

  const drawerWidth = useMemo(() => {
    if (width <= 480) return '85%'
    return 280
  }, [width])

  const handleLogoutClick = useCallback(() => {
    onLogout()
    onClose()
  }, [onLogout, onClose])
  const handleLoginClick = useCallback(() => {
    onClose()
    navigate('/login')
  }, [onClose, navigate])

  const handleOpenProfile = useCallback(() => {
    setProfileDrawerVisible(true)
    onClose()
  }, [onClose])

  const handleCloseProfile = useCallback(() => {
    setProfileDrawerVisible(false)
  }, [])

  const getUserRole = (roleId) => {
    switch (roleId) {
      case 1:
        return 'Admin'
      case 2:
        return 'Manager'
      default:
        return 'Employee'
    }
  }

  return (
    <Drawer
      title={
        <div className="mobile-drawer-header">
          <Logo size="small" />
          <Button icon={<CloseOutlined />} onClick={onClose} type="text" />
        </div>
      }
      placement="right"
      closable={false}
      onClose={onClose}
      open={visible}
      width={drawerWidth}
      className="mobile-menu-drawer"
      styles={{ body: { padding: 0 } }}
    >
      {' '}
      <div className="mobile-menu-content">
        {currentUser && (
          <div className="mobile-user-info">
            <Avatar
              src={currentUser.avatar}
              icon={!currentUser.avatar && <UserOutlined />}
            />
            <div className="mobile-user-details">
              <div className="mobile-username">
                {currentUser.fullname || currentUser.name || 'User'}
              </div>
              <div className="mobile-user-role">
                {getUserRole(currentUser.role_id)}
              </div>
            </div>
          </div>
        )}

        <Menu
          mode="vertical"
          selectedKeys={[activeKey]}
          className="mobile-nav-menu"
        >
          {navItems.map((item) => (
            <Menu.Item key={item.key} icon={item.icon} onClick={onClose}>
              <Link to={item.path}>{item.label}</Link>
            </Menu.Item>
          ))}{' '}
          {currentUser ? (
            <>
              <Menu.Divider />
              <Menu.Item
                key="profile"
                icon={<SettingOutlined />}
                onClick={handleOpenProfile}
              >
                Profile Settings
              </Menu.Item>
              <Menu.Item
                key="logout"
                icon={<LogoutOutlined />}
                onClick={handleLogoutClick}
              >
                Logout
              </Menu.Item>
            </>
          ) : (
            <Menu.Item key="login" onClick={handleLoginClick}>
              Login
            </Menu.Item>
          )}{' '}
        </Menu>
      </div>
      <ProfileDrawer
        visible={profileDrawerVisible}
        onClose={handleCloseProfile}
        currentUser={currentUser}
        onUpdateUser={onUpdateUser}
      />
    </Drawer>
  )
}

export default memo(MobileDrawer)
