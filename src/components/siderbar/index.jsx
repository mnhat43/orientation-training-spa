import React, { useState } from 'react'
import { TableOutlined, FormOutlined, LogoutOutlined, BarChartOutlined, ScheduleOutlined, ProfileOutlined } from '@ant-design/icons'
import { Breadcrumb, Button, Layout, Menu, theme } from 'antd'
import { Navigate, Link, useLocation } from 'react-router-dom'
const { Sider } = Layout
import './siderbar.scss'
import styled from "styled-components";
import { useNavigate } from 'react-router-dom';

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  }
}

const adminMenu = [
  getItem('Dashboard', '/dashboard', <BarChartOutlined />),
  getItem('Manage Accounts', '/manage-account', <ProfileOutlined />),
  getItem('Manage Evaluation', '/manage-evaluation', <ScheduleOutlined />),
  getItem('Courses', '/courses', <ScheduleOutlined />),
]

// const trainerMenu = [
//   getItem('Dashboard', '/dashboard', <BarChartOutlined />),
//   getItem('Manage Accounts', '/manage-account', <ProfileOutlined />),
//   getItem('Manage Evaluation', '/manage-evaluation', <ScheduleOutlined />),
// ]

// const traineeMenu = [
//   getItem('Dashboard', '/dashboard', <BarChartOutlined />),
//   getItem('Manage Accounts', '/manage-account', <ProfileOutlined />),
//   getItem('Manage Evaluation', '/manage-evaluation', <ScheduleOutlined />),
// ]

const SiderRender = (props) => {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  }

  return (
    <Sider
      width={200}
      className="sider-wrapper"
      theme={props.theme}
      collapsible
      collapsed={collapsed}
      // style={{ position: "fixed", marginTop: "50px", height: "100vh" }}
      onCollapse={(value) => setCollapsed(value)}
    // style = {{height: 'inherit'}}
    >
      <Menu
        className="sider-wrapper__menu-item"
        theme={props.theme}
        selectedKeys={location.pathname}
        mode="inline"
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['service']}
      >
        {adminMenu.map((item) => {
          if (item.children) {
            return (
              <Menu.SubMenu
                popupOffset={false}
                key={item.key}
                icon={item.icon}
                title={item.label}
              >
                {item.children.map((subItem) => (
                  <Menu.Item key={subItem.key}>
                    <Link to={subItem.key}>{subItem.label}</Link>
                  </Menu.Item>
                ))}
              </Menu.SubMenu>
            )
          } else {
            return (
              <Menu.Item key={item.key} icon={item.icon}>
                <Link to={item.key}>{item.label}</Link>
              </Menu.Item>
            )
          }
        })}
      </Menu>
    </Sider>
  )
}

export default SiderRender

const ImageWrapper1 = styled.div`
  align-self: stretch;
`;

const Image1 = styled.img`
  aspect-ratio: 1.41;
  object-fit: cover;
  object-position: center;
  width: 100%;
`;
