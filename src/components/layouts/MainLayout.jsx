import { Layout, Grid } from 'antd'
import { useState, useEffect } from 'react'
import SiderRender from '@components/siderbar'
import FooterRender from '@components/footer'
import CourseNavigation from '@components/CourseNavigation'
import './main-layout.scss'

const { Content } = Layout
const { useBreakpoint } = Grid

const MainLayout = ({ component: Component }) => {
  const [collapsed, setCollapsed] = useState(false)
  const screens = useBreakpoint()

  // Automatically collapse sidebar on small screens
  useEffect(() => {
    setCollapsed(!screens.md)
  }, [screens.md])

  return (
    <Layout className="main-layout">
      <Layout>
        <SiderRender
          width={200}
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          breakpoint="md"
          theme="light"
          className="main-layout-sider"
        />
        <div className="main-layout-content-wrapper">
          <CourseNavigation className="main-layout-navigation" />
          <Layout className="main-layout-inner">
            <Content className="main-layout-content">
              <Component />
            </Content>
            <FooterRender />
          </Layout>
        </div>
      </Layout>
    </Layout>
  )
}

export default MainLayout
