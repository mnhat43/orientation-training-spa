import { Layout } from 'antd'
import { useLocation } from 'react-router-dom'
import FooterRender from '@components/footer'
import BreadcrumbNavigation from '@components/BreadcrumbNavigation'
import HeaderRender from '@components/header'
import './main-layout.scss'

const { Content, Header, Footer } = Layout

const MainLayout = ({ component: Component }) => {
  const location = useLocation()
  const isCourseRoute = location.pathname.includes('/course/')

  return (
    <Layout className="main-layout">
      <Header className="main-layout-header">
        {isCourseRoute ? <BreadcrumbNavigation /> : <HeaderRender />}
      </Header>
      <Content className="main-layout-content">
        <Component />
      </Content>
      <Footer className="main-layout-footer">
        <FooterRender />
      </Footer>
    </Layout>
  )
}

export default MainLayout
