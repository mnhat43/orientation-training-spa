import React from 'react';
import { LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import HeaderRender from 'components/header';
import SiderRender from 'components/siderbar';
import FooterRender from 'components/footer';
const { Header, Content, Sider } = Layout;

const App = (props) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Layout>
      <HeaderRender />
      <Layout>
        <SiderRender
          width={200}
          style={{
            background: colorBgContainer,
          }}
          theme="light"
        />
        <Layout
          style={{
            padding: '0 24px 24px',
          }}
        >
          <Breadcrumb
            style={{
              margin: '16px 0',
            }}
          >
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
          </Breadcrumb>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 500,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <props.component />
          </Content>
          <FooterRender />
        </Layout>
      </Layout>
    </Layout>
  );
};
export default App;