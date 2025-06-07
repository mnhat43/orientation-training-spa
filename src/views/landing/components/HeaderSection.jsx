import React from 'react'
import { Button } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import Logo from '@components/Logo'
import '../styles/HeaderSection.scss'
import { useNavigate } from 'react-router-dom'

const HeaderSection = () => {
  const navigate = useNavigate()
  const goLogin = () => {
    navigate('/login')
  }
  return (
    <header className="landing-header">
      <div className="header-container">
        <div className="logo">
          <Logo />
        </div>
        <div className="login-button-container">
          <Button
            type="primary"
            size="large"
            className="login-button"
            icon={<UserOutlined />}
            onClick={goLogin}
          >
            Login
          </Button>
        </div>
      </div>
    </header>
  )
}

export default HeaderSection
