import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Row, Col, Typography, Button, Layout } from 'antd'
import { ArrowRightOutlined } from '@ant-design/icons'
import heroImage from '@assets/hero.png'

const { Content } = Layout
const { Title, Paragraph } = Typography

const HeroSection = () => {
  const navigate = useNavigate()

  const renderBubbles = () => {
    return Array(15)
      .fill()
      .map((_, i) => <div key={i} className="bubble"></div>)
  }

  return (
    <div className="hero-section">
      <div className="bubbles">{renderBubbles()}</div>
      <Content className="container">
        <Row gutter={[24, 24]} align="middle">
          <Col xs={24} md={14}>
            <div className="hero-content">
              <Title level={1} className="animate-title">
                Boost Your <span>Skills</span> from Day One
              </Title>
              <Paragraph className="hero-subtitle animate-subtitle">
                A smart platform to help new employees learn faster, grow
                stronger, and succeed from day one
              </Paragraph>
              <Button
                type="primary"
                size="large"
                className="cta-button animate-button"
                onClick={() => navigate('/login')}
              >
                START LEARNING <ArrowRightOutlined />
              </Button>
            </div>
          </Col>
          <Col xs={24} md={10}>
            <div className="hero-image">
              <img
                src={heroImage}
                alt="Learning platform illustration"
                className="hero-img"
              />
            </div>
          </Col>
        </Row>
      </Content>
    </div>
  )
}

export default HeroSection
