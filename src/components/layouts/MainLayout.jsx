import { Layout } from 'antd';
import HeaderRender from '@components/header';
import SiderRender from '@components/siderbar';
import FooterRender from '@components/footer';
import CourseNavigation from '@components/CourseNavigation';
const { Content } = Layout;

const MainLayout = ({ component: Component }) => {
  // const {
  //   token: { colorBgContainer, borderRadiusLG }
  // } = theme.useToken();
  return (
    <Layout>
      <HeaderRender />
      <Layout>
        <SiderRender
          width={200}
          style={{
            // background: colorBgContainer,
          }}
          theme="light"
        />
        <Layout
          style={{
            padding: '0 24px 24px'
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
          <CourseNavigation />
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 500,
              background: 'colorBgContainer'
              // borderRadius: borderRadiusLG,
            }}
          >
            <Component />
          </Content>
          <FooterRender />
        </Layout>
      </Layout>
    </Layout>
  );
};
export default MainLayout;