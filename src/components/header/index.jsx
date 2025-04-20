import { Layout, Menu, Badge, Button, Tooltip, Popover } from 'antd'
const { Header } = Layout
import { Avatar } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  UserOutlined,
  SettingOutlined,
  HomeOutlined,
  BookOutlined,
  TeamOutlined,
  CalendarOutlined,
  AppstoreOutlined,
  BellOutlined,
} from '@ant-design/icons'
import './header.scss'
import { useEffect, useState } from 'react'

const HeaderRender = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [activeKey, setActiveKey] = useState('home')

  const navigationItems = [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: 'Home',
      path: '/',
    },
    {
      key: 'courses',
      icon: <BookOutlined />,
      label: 'Courses',
      path: '/courses',
    },
    {
      key: 'teams',
      icon: <TeamOutlined />,
      label: 'Teams',
      path: '/teams',
    },
    {
      key: 'calendar',
      icon: <CalendarOutlined />,
      label: 'Calendar',
      path: '/calendar',
    },
    {
      key: 'resources',
      icon: <AppstoreOutlined />,
      label: 'Resources',
      path: '/resources',
    },
  ]

  useEffect(() => {
    const path = location.pathname
    const matchedItem = navigationItems.find(
      (item) =>
        path === item.path ||
        (path !== '/' && path.startsWith(item.path) && item.path !== '/'),
    )
    setActiveKey(matchedItem?.key || 'home')
  }, [location.pathname])

  // Handle menu item click
  const handleMenuClick = (item) => {
    const selectedItem = navigationItems.find((nav) => nav.key === item.key)
    if (selectedItem) {
      navigate(selectedItem.path)
      setActiveKey(selectedItem.key)
    }
  }

  // Notification content
  const notificationContent = (
    <div className="notification-popover">
      <h3>Notifications</h3>
      <div className="notification-list">
        <div className="notification-item">
          <div className="notification-icon course">
            <BookOutlined />
          </div>
          <div className="notification-content">
            <div className="notification-title">New course available</div>
            <div className="notification-time">2 hours ago</div>
          </div>
          <div className="notification-badge"></div>
        </div>
        <div className="notification-item">
          <div className="notification-icon team">
            <TeamOutlined />
          </div>
          <div className="notification-content">
            <div className="notification-title">Team meeting scheduled</div>
            <div className="notification-time">Yesterday</div>
          </div>
        </div>
        <div className="notification-item">
          <div className="notification-icon resource">
            <AppstoreOutlined />
          </div>
          <div className="notification-content">
            <div className="notification-title">New resources added</div>
            <div className="notification-time">3 days ago</div>
          </div>
          <div className="notification-badge"></div>
        </div>
      </div>
      <div className="notification-footer">
        <Button type="link">View all notifications</Button>
      </div>
    </div>
  )

  return (
    <Header className="header-wrapper">
      <div className="header-content">
        <div className="header-wrapper__logo" onClick={() => navigate('/')}>
          <div className="logo-container">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/0a7ec8b021aa8f242c74c6fefb029d66b5c28ea7be26ba07593ea659c8fd3147?apiKey=10b1e221f97543f5b056ca1fc29636cb&"
              alt="Logo"
              className="logo-image"
            />
            <div className="textLogo">OrientHub</div>
          </div>
        </div>

        <div className="header-navigation-container">
          <Menu
            mode="horizontal"
            selectedKeys={[activeKey]}
            onClick={handleMenuClick}
            className="header-navigation"
            items={navigationItems.map((item) => ({
              key: item.key,
              icon: item.icon,
              label: item.label,
            }))}
          />
        </div>

        <div className="header-wrapper__right-side">
          <Popover
            content={notificationContent}
            title={null}
            trigger="click"
            placement="bottomRight"
            overlayClassName="notification-popover-container"
          >
            <Badge count={3} size="small" className="notification-badge">
              <Button
                type="text"
                icon={<BellOutlined />}
                className="header-icon-button notification-button"
              />
            </Badge>
          </Popover>

          <Tooltip title="Profile" placement="bottom">
            <Button
              type="text"
              className="profile-button"
              onClick={() => navigate('/personal-info')}
            >
              <Avatar className="user-avatar" icon={<UserOutlined />} />
            </Button>
          </Tooltip>

          <Tooltip title="Settings" placement="bottom">
            <Button
              type="text"
              icon={<SettingOutlined />}
              className="header-icon-button settings-button"
              onClick={() => navigate('/setting')}
            />
          </Tooltip>
        </div>
      </div>
    </Header>
  )
}

export default HeaderRender
