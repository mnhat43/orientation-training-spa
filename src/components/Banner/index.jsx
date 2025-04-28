import { TeamOutlined } from '@ant-design/icons'
import { Typography } from 'antd'
import './index.scss'

const { Title, Text } = Typography

const BannerComponent = ({ title, description }) => {
  return (
    <div className="welcome-banner">
      <div className="welcome-content">
        <TeamOutlined className="welcome-icon" />
        <div className="welcome-text">
          <Title level={3}>{title}</Title>
          <Text>{description}</Text>
        </div>
      </div>
    </div>
  )
}

export default BannerComponent
