import { useState } from 'react'
import {
  BarChartOutlined,
  ScheduleOutlined,
  ProfileOutlined,
} from '@ant-design/icons'
import { Layout, Menu } from 'antd'
import { Link, useLocation } from 'react-router-dom'
const { Sider } = Layout
import './siderbar.scss'

// Helper function to create menu items with proper structure
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label: children ? label : <Link to={key}>{label}</Link>,
  }
}

const adminMenu = [
  getItem('Dashboard', '/dashboard', <BarChartOutlined />),
  getItem('Manage Accounts', '/manage-account', <ProfileOutlined />),
  getItem('Manage Evaluation', '/manage-evaluation', <ScheduleOutlined />),
  getItem('Courses', '/courses', <ScheduleOutlined />),
]

const SiderRender = (props) => {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()

  return (
    <Sider
      width={200}
      className="sider-wrapper"
      theme={props.theme}
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
    >
      <Menu
        className="sider-wrapper__menu-item"
        theme={props.theme}
        selectedKeys={location.pathname}
        mode="inline"
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['service']}
        items={adminMenu}
      />
    </Sider>
  )
}

export default SiderRender
