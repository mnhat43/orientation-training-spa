import React from 'react'
import { Button } from 'antd'
import { Link } from 'react-router-dom'
import { UserOutlined } from '@ant-design/icons'
import Logo from '@components/Logo'
import '../styles/HeaderSection.scss'

const HeaderSection = () => {
  return (
    <header className="landing-header">
      <div className="header-container">
        <div className="logo">
          <Link to="/">
            <Logo />
          </Link>
        </div>
        <div className="login-button-container">
          <Button
            type="primary"
            size="large"
            className="login-button"
            icon={<UserOutlined />}
          >
            <Link to="/login">Login</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}

export default HeaderSection
