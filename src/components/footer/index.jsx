import { CopyrightOutlined } from '@ant-design/icons'
import { Layout } from 'antd'
import './footer.scss'

const { Footer } = Layout

const FooterRender = () => {
  return (
    <Footer className="app-footer">
      <span className="copyright">
        <CopyrightOutlined /> {new Date().getFullYear()} DaoMinhNhat
      </span>
    </Footer>
  )
}

export default FooterRender
