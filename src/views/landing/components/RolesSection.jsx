import React from 'react'
import { Row, Col, Typography, Card, Layout } from 'antd'
import { TeamOutlined, UserOutlined, CheckOutlined } from '@ant-design/icons'

const { Content } = Layout
const { Title, Paragraph } = Typography

const RolesSection = () => {
  return (
    <div className="section roles-section">
      <Content className="container">
        <div className="section-header animate-on-scroll">
          <Title level={2}>Role-Specific Benefits</Title>
          <Paragraph className="section-description">
            Our platform offers tailored advantages for both managers and
            employees
          </Paragraph>
        </div>

        <Row gutter={[40, 40]}>
          <Col xs={24} md={12}>
            <Card className="role-card manager-card animate-on-scroll">
              <div className="role-icon-wrapper">
                <TeamOutlined className="role-icon" />
              </div>
              <Title level={3}>For Managers</Title>
              <ul className="role-benefits">
                <li>
                  <CheckOutlined /> Easily create and customize training courses
                </li>
                <li>
                  <CheckOutlined /> Assign relevant courses to team members
                </li>
                <li>
                  <CheckOutlined /> Track employee progress in real-time
                </li>
                <li>
                  <CheckOutlined /> Generate performance reports and analytics
                </li>
                <li>
                  <CheckOutlined /> Standardize onboarding
                </li>
              </ul>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card className="role-card employee-card animate-on-scroll card-delay-1">
              <div className="role-icon-wrapper">
                <UserOutlined className="role-icon" />
              </div>
              <Title level={3}>For Employees</Title>
              <ul className="role-benefits">
                <li>
                  <CheckOutlined /> Access personalized learning paths
                </li>
                <li>
                  <CheckOutlined /> Learn at your own pace with flexible
                  scheduling
                </li>
                <li>
                  <CheckOutlined /> Track your progress and achievements
                </li>
                <li>
                  <CheckOutlined /> Receive feedback on completed assignments
                </li>
                <li>
                  <CheckOutlined /> Earn certificates for completed courses
                </li>
              </ul>
            </Card>
          </Col>
        </Row>
      </Content>
    </div>
  )
}

export default RolesSection
