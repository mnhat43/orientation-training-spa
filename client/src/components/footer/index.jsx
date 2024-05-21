import { CopyrightOutlined } from '@ant-design/icons'
import { Layout } from 'antd'

const { Footer } = Layout

const FooterRender = () => {
  return (
    <Footer
      style={{
        textAlign: 'center',
      }}
    >
      COPYRIGHT <CopyrightOutlined /> {new Date().getFullYear()} DaoMinhNhat
    </Footer>
  )
}

export default FooterRender
