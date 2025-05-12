import React from 'react'
import { Link } from 'react-router-dom'
import { BookOutlined } from '@ant-design/icons'
import './logo.scss'

const Logo = ({ size = 'default' }) => {
  const sizeClass = size === 'small' ? 'logo-small' : 'logo-default'

  return (
    <Link to="/" className={`app-logo ${sizeClass}`}>
      <div className="logo-container">
        <BookOutlined className="logo-icon" />
        <span className="logo-text">
          <span className="highlight">O</span>rient
          <span className="highlight">H</span>ub
        </span>
      </div>
    </Link>
  )
}

export default Logo
