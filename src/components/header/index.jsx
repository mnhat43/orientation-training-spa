import React, { useState, useCallback, useMemo } from 'react'
import { Button } from 'antd'
import { MenuOutlined } from '@ant-design/icons'
import { useLocation, useNavigate } from 'react-router-dom'
import useAuth from '@hooks/useAuth'
import { ROLE_NAVIGATION, DEFAULT_NAVIGATION } from '@constants/navigation'
import Logo from '@components/Logo'
import Navigation from './Navigation'
import UserMenu from './UserMenu'
import MobileDrawer from './MobileDrawer'
import './header.scss'

const HeaderRender = () => {
  const { currentUser, handleLogout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false)

  const navItems = useMemo(() => {
    if (!currentUser) return DEFAULT_NAVIGATION

    return ROLE_NAVIGATION[currentUser.role_id] || []
  }, [currentUser])

  const toggleMobileMenu = useCallback(
    () => setMobileMenuVisible((prev) => !prev),
    [],
  )
  const closeMobileMenu = useCallback(() => setMobileMenuVisible(false), [])

  const onLogout = useCallback(() => {
    handleLogout()
    navigate('/login')
  }, [handleLogout, navigate])

  return (
    <>
      <div className="header-wrapper">
        <div className="header-container">
          <div className="header-logo">
            <Logo />
          </div>

          <div className="header-main">
            <Navigation navItems={navItems} currentPath={location.pathname} />
          </div>

          <div className="header-user">
            <UserMenu
              currentUser={currentUser}
              onLogout={onLogout}
              navigate={navigate}
            />
          </div>

          <div className="mobile-menu-button">
            <Button
              icon={<MenuOutlined />}
              onClick={toggleMobileMenu}
              type="text"
            />
          </div>
        </div>
      </div>

      <MobileDrawer
        visible={mobileMenuVisible}
        onClose={closeMobileMenu}
        currentUser={currentUser}
        navItems={navItems}
        currentPath={location.pathname}
        onLogout={onLogout}
        navigate={navigate}
      />
    </>
  )
}

export default HeaderRender
