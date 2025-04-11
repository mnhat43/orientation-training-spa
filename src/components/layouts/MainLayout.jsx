import { Layout } from 'antd'
// import HeaderRender from '@components/header';
import SiderRender from '@components/siderbar'
import FooterRender from '@components/footer'
import CourseNavigation from '@components/CourseNavigation'
const { Content } = Layout

const MainLayout = ({ component: Component }) => {
  // const {
  //   token: { colorBgContainer, borderRadiusLG }
  // } = theme.useToken();
  return (
    <Layout>
      {/* <HeaderRender /> */}
      <Layout>
        <SiderRender
          width={200}
          style={
            {
              // background: colorBgContainer,
            }
          }
          theme="light"
        />
        <div
          style={{ display: 'flex', flexDirection: 'column', width: '100%' }}
        >
          <CourseNavigation style={{ display: 'fex' }} />

          <Layout
            style={{
              padding: '0 8px 8px',
            }}
          >
            {/* <Breadcrumb
            style={{
              margin: '16px 0',
            }}
          >
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
          </Breadcrumb> */}
            <Content
              style={{
                padding: 24,
                margin: 0,
                minHeight: 500,
                background: 'colorBgContainer',
                // height: '90vh',
                // borderRadius: borderRadiusLG,
              }}
            >
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
