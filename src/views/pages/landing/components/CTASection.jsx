import React from 'react'
import { Typography, Layout, Row, Col, Space } from 'antd'
import {
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  LinkedinOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons'

const { Footer } = Layout
const { Title, Paragraph, Text } = Typography

const CTASection = () => {
  const renderParticles = () => {
    return Array(25)
      .fill()
      .map((_, i) => <div key={i} className="particle"></div>)
  }

  return (
    <Footer className="footer-section">
      <div className="particles">{renderParticles()}</div>
      <div className="container">
        <Row gutter={[48, 32]} className="footer-content">
          <Col xs={24} sm={24} md={8} lg={8}>
            <div className="footer-contact">
              <Title level={3}>Contact Us</Title>
              <Space direction="vertical" size="middle">
                <Space>
                  <PhoneOutlined />
                  <Text>+84 965 485 133</Text>
                </Space>
                <Space>
                  <MailOutlined />
                  <Text>nhat.dm215107@sis.hust.edu.vn</Text>
                </Space>
                <Space>
                  <EnvironmentOutlined />
                  <Text>1 Đ. Đại Cồ Việt, Bách Khoa, Hai Bà Trưng, Hà Nội</Text>
                </Space>
              </Space>
            </div>
          </Col>

          <Col xs={24} sm={24} md={8} lg={8}>
            <div className="footer-about">
              <Title level={3}>About OrientHub</Title>
              <Paragraph>
                OrientHub provides a comprehensive training platform that makes
                learning accessible, engaging, and effective for organizations
                of all sizes.
              </Paragraph>
            </div>
          </Col>

          <Col xs={24} sm={24} md={8} lg={8}>
            <div className="footer-social">
              <Title level={3}>Follow Us</Title>
              <Space size="large" className="social-icons">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FacebookOutlined />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <TwitterOutlined />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <InstagramOutlined />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <LinkedinOutlined />
                </a>
              </Space>
            </div>
          </Col>
        </Row>

        <div className="footer-copyright">
          <Text>OrientHub © 2025 All Rights Reserved</Text>
        </div>
      </div>
    </Footer>
  )
}

export default CTASection
