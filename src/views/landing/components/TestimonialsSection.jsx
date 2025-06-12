import React, { useState, useEffect } from 'react'
import { Row, Col, Typography, Card, Avatar, Divider, Layout, Spin } from 'antd'
import { UserOutlined, StarFilled, StarOutlined } from '@ant-design/icons'
import { topAppFeedback } from '@api/feedback'

const { Content } = Layout
const { Title, Paragraph, Text } = Typography

const defaultTestimonials = [
  {
    name: 'David Chen',
    role: 'Software Developer',
    rating: 5,
    feedback:
      'The orientation program helped me get up to speed quickly with company standards and technologies.',
  },
  {
    name: 'Sarah Johnson',
    role: 'Team Manager',
    rating: 5,
    feedback:
      "Creating and assigning courses has never been easier. The platform provides clear insights into each team member's progress and helps me identify areas where additional support is needed.",
  },
  {
    name: 'Michael Rodriguez',
    role: 'New Employee',
    rating: 4,
    feedback:
      'As someone new to the industry, the structured learning approach made complex topics much more approachable. My assigned learning path was perfectly tailored to my role.',
  },
]

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState(defaultTestimonials)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTestimonials(defaultTestimonials)

    const fetchTopFeedback = async () => {
      try {
        const response = await topAppFeedback()

        if (response?.data?.length > 0) {
          const formattedFeedback = response.data.map((item) => ({
            name: item.name,
            role: item.role,
            rating: item.rating,
            feedback: item.feedback,
            avatar: item.avatar,
          }))
          setTestimonials(formattedFeedback)
        } else {
          console.log('No testimonials data in API response, keeping defaults')
        }
      } catch (error) {
        console.error('Error fetching testimonials:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTopFeedback()
  }, [])

  const renderStars = (count) => {
    let stars = []
    try {
      const starCount = Number(count)

      if (isNaN(starCount)) {
        for (let i = 0; i < 5; i++) {
          stars.push(<StarFilled key={i} className="star-icon" />)
        }
      } else {
        const validCount = Math.min(Math.max(1, starCount), 5)

        const fullStars = Math.floor(validCount)

        const decimal = validCount - fullStars

        for (let i = 0; i < fullStars; i++) {
          stars.push(<StarFilled key={i} className="star-icon" />)
        }

        if (decimal >= 0.5 && fullStars < 5) {
          stars.push(
            <StarFilled
              key="half"
              className="star-icon half-star"
              style={{
                opacity: 0.6,
                transform: 'scale(0.85)',
              }}
            />,
          )
        }

        const emptyStars = 5 - Math.ceil(validCount)
        for (let i = 0; i < emptyStars; i++) {
          stars.push(
            <StarOutlined
              key={`empty-${i}`}
              className="star-icon empty-star"
            />,
          )
        }
      }
    } catch (error) {
      console.error('Error rendering stars:', error)

      for (let i = 0; i < 5; i++) {
        stars.push(<StarFilled key={i} className="star-icon" />)
      }
    }
    return stars
  }

  return (
    <div className="section testimonials-section">
      <Content className="container">
        <div className="section-header animate-on-scroll">
          <Title level={2}>What Our Users Say</Title>
          <Paragraph className="section-description">
            Hear from real users who have experienced our platform and shared
            their feedback
          </Paragraph>
        </div>

        <Row gutter={[40, 40]} justify="center">
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <Col xs={24} sm={20} md={8} key={index}>
              <Card
                className={`testimonial-card animate-on-scroll card-delay-${index}`}
              >
                <div className="testimonial-content">
                  <Paragraph className="testimonial-text">
                    "{testimonial.feedback}"
                  </Paragraph>
                  <div className="stars-container">
                    {renderStars(testimonial.rating)}
                  </div>
                  <Divider />
                  <div className="testimonial-author">
                    <Avatar
                      className="avatar"
                      size={56}
                      src={testimonial.avatar}
                      icon={!testimonial.avatar && <UserOutlined />}
                      style={{
                        background: !testimonial.avatar
                          ? index === 0
                            ? '#0052CC'
                            : index === 1
                              ? '#5243AA'
                              : '#00B8D9'
                          : undefined,
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
