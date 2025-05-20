import React from 'react'
import { Row, Col, Typography, Card, Avatar, Divider, Layout } from 'antd'
import { UserOutlined, StarFilled } from '@ant-design/icons'

const { Content } = Layout
const { Title, Paragraph, Text } = Typography

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'David Chen',
      role: 'Software Developer',
      rating: 5,
      content:
        'The orientation program helped me get up to speed quickly with company standards and technologies.',
    },
    {
      name: 'Sarah Johnson',
      role: 'Team Manager',
      rating: 5,
      description:
        "Creating and assigning courses has never been easier. The platform provides clear insights into each team member's progress and helps me identify areas where additional support is needed.",
    },
    {
      name: 'Michael Rodriguez',
      role: 'New Employee',
      rating: 4,
      description:
        'As someone new to the industry, the structured learning approach made complex topics much more approachable. My assigned learning path was perfectly tailored to my role.',
    },
  ]

  // Function to render star ratings
  const renderStars = (count) => {
    return Array(count)
      .fill()
      .map((_, i) => <StarFilled key={i} className="star-icon" />)
  }

  return (
    <div className="section testimonials-section">
      <Content className="container">
        <div className="section-header animate-on-scroll">
          <Title level={2}>What Our Users Say</Title>
          <Paragraph className="section-description">
            Hear from professionals who have experienced our platform and
            achieved their goals
          </Paragraph>
        </div>

        <Row gutter={[40, 40]} justify="center">
          {testimonials.map((testimonial, index) => (
            <Col xs={24} sm={20} md={8} key={index}>
              <Card
                className={`testimonial-card animate-on-scroll card-delay-${index}`}
              >
                <div className="testimonial-content">
                  <Paragraph className="testimonial-text">
                    "{testimonial.content || testimonial.description}"
                  </Paragraph>
                  <div className="stars-container">
                    {renderStars(testimonial.rating || 5)}
                  </div>
                  <Divider />
                  <div className="testimonial-author">
                    <Avatar
                      className="avatar"
                      size={56}
                      icon={<UserOutlined />}
                      style={{
                        background:
                          index === 0
                            ? '#0052CC'
                            : index === 1
                              ? '#5243AA' // Manager color
                              : '#00B8D9',
                      }}
                    />
                    <div className="author-info">
                      <Text className="author-name">{testimonial.name}</Text>
                      <Text className="author-role">{testimonial.role}</Text>
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Content>
    </div>
  )
}

export default TestimonialsSection
