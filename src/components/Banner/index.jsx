import { TeamOutlined, CloseOutlined } from '@ant-design/icons'
import { Typography } from 'antd'
import { useState } from 'react'
import './index.scss'

const { Title, Text } = Typography

const BannerComponent = ({
  title,
  description,
  icon: CustomIcon = TeamOutlined,
  closable = true,
  onClose,
}) => {
  const [visible, setVisible] = useState(true)

  const handleClose = () => {
    setVisible(false)
    if (onClose) onClose()
  }

  if (!visible) return null

  return (
    <div className="welcome-banner">
      {closable && (
        <button className="close-button" onClick={handleClose}>
          <CloseOutlined />
        </button>
      )}
      <div className="wave-animation"></div>
      <div className="welcome-content">
        <CustomIcon className="welcome-icon" />
        <div className="welcome-text">
          <Title level={3}>{title}</Title>
          <Text>{description}</Text>
        </div>
      </div>
    </div>
  )
}

export default BannerComponent
