import React from 'react'
import { Row, Col, Typography, Badge, Layout } from 'antd'
import {
  BarsOutlined,
  ScheduleOutlined,
  ReadOutlined,
  LineChartOutlined,
} from '@ant-design/icons'

const { Content } = Layout
const { Title, Paragraph } = Typography

const HowItWorksSection = () => {
  const steps = [
    {
      number: '01',
      title: 'Course Creation',
      description:
        'Managers design comprehensive courses with modules, lectures, and assessments.',
      icon: <BarsOutlined />,
    },
    {
      number: '02',
      title: 'Assignment',
      description:
        'Managers assign relevant courses to employees based on roles and development needs.',
      icon: <ScheduleOutlined />,
    },
    {
      number: '03',
      title: 'Learning',
      description:
        'Employees access their personalized learning paths and complete assigned courses.',
      icon: <ReadOutlined />,
    },
    {
      number: '04',
      title: 'Progress Tracking',
      description:
        'Both managers and employees monitor progress and performance with detailed analytics.',
      icon: <LineChartOutlined />,
    },
  ]

  return (
    <div className="section how-it-works-section">
      <Content className="container">
        <div className="section-header animate-on-scroll">
          <Title level={2}>How It Works</Title>
          <Paragraph className="section-description">
            Our platform streamlines the training process from course creation
            to completion
          </Paragraph>
        </div>

        <div className="steps-container">
          <Row gutter={[40, 40]}>
            {steps.map((step, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <div
                  className={`step-card animate-on-scroll card-delay-${index}`}
                >
                  <div className="step-number">
                    <span>{index + 1}</span>
                  </div>
                  <div className="step-icon">{step.icon}</div>
                  <Title level={4}>{step.title}</Title>
                  <Paragraph>{step.description}</Paragraph>

                  <div className="role-indicator">
                    {index < 2 ? (
                      <Badge color="#5243AA" text="Manager" />
                    ) : (
                      <Badge color="#00B8D9" text="Employee" />
                    )}
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </Content>
    </div>
  )
}

export default HowItWorksSection
