import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Row, Col, Typography, Button, Layout } from 'antd'
import { CheckCircleOutlined } from '@ant-design/icons'
import benefitsImage from '@assets/benefit.png'

const { Content } = Layout
const { Title, Paragraph, Text } = Typography

const BenefitsSection = () => {
  const navigate = useNavigate()

  const benefits = [
    'Personalized learning paths',
    'Interactive assessments',
    'Real-time progress tracking',
    'Expert-led content',
    'Mobile-friendly platform',
    'Certification opportunities',
  ]

  return (
    <div className="section benefits-section">
      <Content className="container">
        <Row gutter={[80, 60]} align="middle" justify="center">
          <Col xs={24} lg={12}>
            <div className="animate-on-scroll benefits-content">
              <Title level={2}>Why Choose Our Platform</Title>
              <Paragraph className="section-description">
                Our training platform is designed with your organization's
                success in mind, offering exceptional benefits to enhance
                learning and development:
              </Paragraph>

              <div className="benefits-list">
                {benefits.map((benefit, index) => (
                  <div
                    className={`benefit-item animate-on-scroll benefit-delay-${index}`}
                    key={index}
                  >
                    <CheckCircleOutlined className="benefit-icon" />
                    <Text>{benefit}</Text>
                  </div>
                ))}
              </div>

              <Button
                type="primary"
                size="large"
                className="benefit-cta animate-on-scroll"
                onClick={() => navigate('/login')}
              >
                Start Learning Today
              </Button>
            </div>
          </Col>
          <Col xs={24} lg={12}>
            <div className="benefits-image-container animate-on-scroll">
              <img
                src={benefitsImage}
                alt="Platform benefits illustration"
                className="benefits-img"
              />
            </div>
          </Col>
        </Row>
      </Content>
    </div>
  )
}

export default BenefitsSection
