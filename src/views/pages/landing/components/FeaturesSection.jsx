import React from 'react'
import { Row, Col, Typography, Card, Layout } from 'antd'
import {
  ReadOutlined,
  RocketOutlined,
  TeamOutlined,
  TrophyOutlined,
} from '@ant-design/icons'

const { Content } = Layout
const { Title, Paragraph } = Typography

const FeaturesSection = () => {
  // Feature icon array for different colors
  const featureIcons = [
    <ReadOutlined className="feature-icon" />,
    <RocketOutlined className="feature-icon" />,
    <TeamOutlined className="feature-icon" />,
    <TrophyOutlined className="feature-icon" />,
  ]

  const features = [
    {
      title: 'Structured Learning Paths',
      description:
        'Follow guided course tracks to develop essential skills step by step and stay on track throughout your journey.',
    },
    {
      title: 'Self-Paced Interactive Learning',
      description:
        'Learn flexibly with personalized, interactive content that adapts to your progress and keeps you engaged.',
    },
    {
      title: 'Peer & Mentor Collaboration',
      description:
        'Team up with mentors and colleagues to share knowledge, solve problems, and grow together.',
    },
    {
      title: 'Verified Skill Certifications',
      description:
        'Earn digital certificates to showcase your progress and validate the skills you’ve gained during training.',
    },
  ]

  return (
    <div className="section features-section">
      <Content className="container">
        <div className="section-header animate-on-scroll">
          <Title level={2}>Powerful Platform Features</Title>
          <Paragraph className="section-description">
            Everything you need to onboard faster, learn smarter, and grow
            stronger from day one
          </Paragraph>
        </div>

        <Row gutter={[32, 32]}>
          {features.map((feature, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <Card
                className={`feature-card animate-on-scroll card-delay-${index}`}
              >
                <div className="feature-icon-wrapper">
                  {featureIcons[index]}
                </div>
                <Title level={4}>{feature.title}</Title>
                <Paragraph>{feature.description}</Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      </Content>
    </div>
  )
}

export default FeaturesSection
