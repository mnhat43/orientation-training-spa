import { Layout } from 'antd'
import { useLocation } from 'react-router-dom'
import FooterRender from '@components/footer'
import CourseNavigation from '@components/CourseNavigation'
import HeaderRender from '@components/header'
import './main-layout.scss'

const { Content } = Layout

const MainLayout = ({ component: Component }) => {
  const location = useLocation()
  const isCourseRoute = location.pathname.includes('/course/')

  return (
    <Layout className="main-layout">
      <Layout className="main-layout-header">
        {isCourseRoute ? <CourseNavigation /> : <HeaderRender />}
      </Layout>
      <Layout className="main-layout-content">
        <Component />
      </Layout>
      {/* <FooterRender /> */}
    </Layout>
  )
}

export default MainLayout
