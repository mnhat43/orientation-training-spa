import {
  Layout,
  Menu,
  Badge,
  Button,
  Tooltip,
  Popover,
  Dropdown,
  Modal,
  Typography,
  Tag,
  Card,
} from 'antd'
const { Header } = Layout
import { Avatar } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  UserOutlined,
  SettingOutlined,
  BookOutlined,
  DashboardOutlined,
  UsergroupAddOutlined,
  FileProtectOutlined,
  TrophyOutlined,
  LogoutOutlined,
  UserSwitchOutlined,
  BellOutlined,
  CheckCircleOutlined,
  LaptopOutlined,
  ReadOutlined,
  FileDoneOutlined,
  BarChartOutlined,
  EditOutlined,
  AuditOutlined,
  FormOutlined,
  ProfileOutlined,
  TeamOutlined,
  ScheduleOutlined,
  HistoryOutlined,
  FileSearchOutlined,
  SolutionOutlined,
  FileTextOutlined,
  RocketOutlined,
  PartitionOutlined,
} from '@ant-design/icons'
import './header.scss'
import { useEffect, useState } from 'react'

const HeaderRender = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [activeKey, setActiveKey] = useState('dashboard')
  const [userRole, setUserRole] = useState('manager') // or 'user'
  const [showRoleSelector, setShowRoleSelector] = useState(false)

  // Common items for both roles - removed Home
  const commonNavigationItems = []

  // Manager-specific navigation items with updated structure
  const managerNavigationItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      path: '/dashboard',
      description: 'Overview of employee statistics and progress',
    },
    {
      key: 'courses',
      icon: <BookOutlined />,
      label: 'Courses',
      path: '/courses',
      description: 'Manage training courses and enrollments',
    },
    {
      key: 'templates',
      icon: <FileTextOutlined />,
      label: 'Templates',
      path: '/templates',
      description: 'Create and manage training path templates',
    },
    {
      key: 'learningPaths',
      icon: <PartitionOutlined />,
      label: 'Learning Paths',
      path: '/learning-paths/create',
      description: 'Create personalized learning paths for employees',
    },
    {
      key: 'employees',
      icon: <TeamOutlined />,
      label: 'Manage Employees',
      path: '/manage-employee',
      description: 'Comprehensive employee management',
    },
    {
      key: 'reports',
      icon: <BarChartOutlined />,
      label: 'Reports',
      path: '/reports',
      description: 'View and manage employee submitted reports',
    },
  ]

  // New employee-specific navigation items
  const userNavigationItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      path: '/dashboard',
    },
    {
      key: 'my-training',
      icon: <ReadOutlined />,
      label: 'My Training',
      path: '/my-training',
    },
    {
      key: 'certificates',
      icon: <FileProtectOutlined />,
      label: 'Certificates',
      path: '/certificates',
    },
    {
      key: 'skills',
      icon: <TrophyOutlined />,
      label: 'Skills',
      path: '/skills',
    },
    {
      key: 'assignments',
      icon: <CheckCircleOutlined />,
      label: 'Assignments',
      path: '/assignments',
    },
    {
      key: 'submit-report',
      icon: <FormOutlined />,
      label: 'Submit Report',
      path: '/submit-report',
    },
  ]

  // Get navigation items based on role
  const getNavigationItems = () => {
    if (userRole === 'manager') {
      return [...commonNavigationItems, ...managerNavigationItems]
    } else {
      return [...commonNavigationItems, ...userNavigationItems]
    }
  }

  const navigationItems = getNavigationItems()

  // Switch role function
  const switchRole = (role) => {
    setUserRole(role)
    setShowRoleSelector(false)
    if (role === 'manager') {
      navigate('/dashboard')
    } else {
      navigate('/dashboard')
    }
  }

  // Set active menu item based on current path
  useEffect(() => {
    const path = location.pathname

    // Match specific paths
    if (path === '/templates') {
      setActiveKey('templates')
      return
    }

    if (path.startsWith('/learning-paths')) {
      setActiveKey('learningPaths')
      return
    }

    // Check direct matches for other items
    const matchedItem = navigationItems.find(
      (item) =>
        path === item.path ||
        (path !== '/' && path.startsWith(item.path) && item.path !== '/'),
    )

    if (matchedItem) {
      setActiveKey(matchedItem.key)
      return
    }

    setActiveKey('dashboard') // Default to dashboard
  }, [location.pathname, userRole])

  // Handle menu item click
  const handleMenuClick = ({ key }) => {
    // Check if this is a submenu item
    let targetPath

    // First check top-level items
    const selectedItem = navigationItems.find((item) => item.key === key)
    if (selectedItem && selectedItem.path) {
      targetPath = selectedItem.path
    } else {
      // Then check children items
      for (const item of navigationItems) {
        if (item.children) {
          const childItem = item.children.find((child) => child.key === key)
          if (childItem && childItem.path) {
            targetPath = childItem.path
            break
          }
        }
      }
    }

    if (targetPath) {
      navigate(targetPath)
    }
  }

  // Build menu items with proper structure for Ant Design Menu
  const buildMenuItems = (items) => {
    return items.map((item) => {
      if (item.children) {
        return {
          key: item.key,
          icon: item.icon,
          label: item.label,
          children: item.children.map((child) => ({
            key: child.key,
            icon: child.icon,
            label: child.label,
          })),
        }
      }
      return {
        key: item.key,
        icon: item.icon,
        label: item.label,
      }
    })
  }

  // Manager notifications content
  const managerNotificationContent = (
    <div className="notification-popover">
      <h3>Notifications</h3>
      <div className="notification-list">
        <div className="notification-item">
          <div className="notification-icon report">
            <FormOutlined />
          </div>
          <div className="notification-content">
            <div className="notification-title">New report submitted</div>
            <div className="notification-desc">
              Nguyen Van A submitted a progress report
            </div>
            <div className="notification-time">2 hours ago</div>
          </div>
          <div className="notification-badge"></div>
        </div>
        <div className="notification-item">
          <div className="notification-icon course">
            <BookOutlined />
          </div>
          <div className="notification-content">
            <div className="notification-title">Course completion</div>
            <div className="notification-desc">
              Tran Thi B completed Technical Onboarding
            </div>
            <div className="notification-time">Yesterday</div>
          </div>
          <div className="notification-badge"></div>
        </div>
        <div className="notification-item">
          <div className="notification-icon evaluation">
            <AuditOutlined />
          </div>
          <div className="notification-content">
            <div className="notification-title">Evaluation needed</div>
            <div className="notification-desc">
              3 employees pending skills evaluation
            </div>
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

  // User notifications content
  const userNotificationContent = (
    <div className="notification-popover">
      <h3>Notifications</h3>
      <div className="notification-list">
        <div className="notification-item">
          <div className="notification-icon course">
            <BookOutlined />
          </div>
          <div className="notification-content">
            <div className="notification-title">New course assigned</div>
            <div className="notification-desc">
              You've been enrolled in Technical Onboarding
            </div>
            <div className="notification-time">2 hours ago</div>
          </div>
          <div className="notification-badge"></div>
        </div>
        <div className="notification-item">
          <div className="notification-icon assignment">
            <CheckCircleOutlined />
          </div>
          <div className="notification-content">
            <div className="notification-title">Assignment due tomorrow</div>
            <div className="notification-desc">
              Complete your security training
            </div>
            <div className="notification-time">Yesterday</div>
          </div>
          <div className="notification-badge"></div>
        </div>
        <div className="notification-item">
          <div className="notification-icon certificate">
            <FileProtectOutlined />
          </div>
          <div className="notification-content">
            <div className="notification-title">Certificate issued</div>
            <div className="notification-desc">
              You earned Company Orientation Certificate
            </div>
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

  // User menu dropdown items
  const userMenuItems = [
    {
      key: 'profile',
      label: 'My Profile',
      icon: <UserOutlined />,
      onClick: () =>
        userRole === 'manager'
          ? navigate('/manager/profile')
          : navigate('/personal-info'),
    },
    {
      key: 'switch-role',
      label: 'Switch Role',
      icon: <UserSwitchOutlined />,
      onClick: () => setShowRoleSelector(true),
    },
    {
      key: 'settings',
      label: 'Settings',
      icon: <SettingOutlined />,
      onClick: () => navigate('/setting'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: 'Logout',
      icon: <LogoutOutlined />,
      onClick: () => navigate('/login'),
    },
  ]

  return (
    <Header className="header-wrapper">
      <div className="header-content">
        <div
          className="header-wrapper__logo"
          onClick={() => navigate('/dashboard')}
        >
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
            items={buildMenuItems(navigationItems)}
          />
        </div>

        <div className="header-wrapper__right-side">
          <Popover
            content={
              userRole === 'manager'
                ? managerNotificationContent
                : userNotificationContent
            }
            title={null}
            trigger="click"
            placement="bottomRight"
            overlayClassName="notification-popover-container"
          >
            <Badge
              count={userRole === 'manager' ? 3 : 3}
              size="small"
              className="notification-badge"
            >
              <Button
                type="text"
                icon={<BellOutlined />}
                className="header-icon-button notification-button"
              />
            </Badge>
          </Popover>

          <Dropdown
            menu={{ items: userMenuItems }}
            placement="bottomRight"
            trigger={['click']}
          >
            <Button type="text" className="profile-button">
              <Avatar className="user-avatar" icon={<UserOutlined />} />
            </Button>
          </Dropdown>
        </div>
      </div>

      <Modal
        title="Switch Role"
        open={showRoleSelector}
        onCancel={() => setShowRoleSelector(false)}
        footer={null}
      >
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
          <Card
            hoverable
            style={{ width: 200, textAlign: 'center', cursor: 'pointer' }}
            onClick={() => switchRole('manager')}
          >
            <Avatar
              size={64}
              icon={<UserOutlined />}
              style={{ backgroundColor: '#1890ff', marginBottom: 16 }}
            />
            <Typography.Title level={4}>Manager</Typography.Title>
            <Typography.Text type="secondary">
              Manage employee training
            </Typography.Text>
          </Card>

          <Card
            hoverable
            style={{ width: 200, textAlign: 'center', cursor: 'pointer' }}
            onClick={() => switchRole('user')}
          >
            <Avatar
              size={64}
              icon={<LaptopOutlined />}
              style={{ backgroundColor: '#52c41a', marginBottom: 16 }}
            />
            <Typography.Title level={4}>Employee</Typography.Title>
            <Typography.Text type="secondary">
              Access your training courses
            </Typography.Text>
          </Card>
        </div>
      </Modal>
    </Header>
  )
}

export default HeaderRender
