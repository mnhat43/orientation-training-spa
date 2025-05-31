import React from 'react'
import {
  List,
  Card,
  Tag,
  Typography,
  Button,
  Divider,
  Row,
  Col,
  Form,
  InputNumber,
  Input,
} from 'antd'
import {
  BookOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  EditOutlined,
  QuestionCircleOutlined,
  CheckOutlined,
  TrophyOutlined,
} from '@ant-design/icons'
import './ReviewsList.scss'

const { Title, Text, Paragraph } = Typography
const { TextArea } = Input

const ReviewsList = ({
  reviews,
  expandedCards,
  toggleCard,
  handleReviewSubmission,
}) => (
  <List
    className="reviews-list"
    itemLayout="vertical"
    dataSource={reviews}
    renderItem={(review) => (
      <List.Item key={review.submission_id}>
        <Card
          className={`review-item-card ${expandedCards[review.submission_id] ? 'expanded' : ''}`}
        >
          <div
            className="review-card-header"
            onClick={() => toggleCard(review.submission_id)}
          >
            <div className="review-main-info">
              <div className="review-icon">
                <BookOutlined />
              </div>
              <div className="review-title-info">
                <Title level={5} className="review-title">
                  {review.question_text}
                </Title>
                <div className="review-meta">
                  <Tag color="blue">{review.course_title}</Tag>
                  <Text type="secondary">
                    <ClockCircleOutlined /> {review.submitted_at}
                  </Text>
                  <Tag color="gold" icon={<TrophyOutlined />}>
                    Max: {review.maxScore} points
                  </Tag>
                </div>
              </div>
            </div>
            <Button
              type="primary"
              ghost
              size="small"
              icon={<EditOutlined />}
              onClick={(e) => {
                e.stopPropagation()
                toggleCard(review.submission_id)
              }}
            >
              {expandedCards[review.submission_id] ? 'Hide Details' : 'Review'}
            </Button>
          </div>

          {expandedCards[review.submission_id] && (
            <div className="review-expanded-content">
              <Divider className="section-divider" />
              <Row gutter={32}>
                <Col xs={24} md={14}>
                  <div className="quiz-section">
                    <div className="section-label">
                      <QuestionCircleOutlined className="section-icon" />
                      <Text strong>Quiz Question</Text>
                    </div>
                    <div className="quiz-question-content">
                      <Paragraph>{review.question_text}</Paragraph>
                    </div>
                  </div>
                  <div className="submission-section">
                    <div className="section-label">
                      <FileTextOutlined className="section-icon" />
                      <Text strong>Student Submission</Text>
                    </div>
                    <div className="submission-content">
                      <Paragraph>{review.answer_text}</Paragraph>
                    </div>
                  </div>
                </Col>
                <Col xs={24} md={10}>
                  <div className="grading-section grading-section--vertical">
                    <div className="section-header">
                      <div className="section-label">
                        <CheckOutlined className="section-icon" />
                        <Text strong>Grading</Text>
                      </div>
                      <div className="max-score-badge">
                        <Tag color="gold" icon={<TrophyOutlined />}>
                          Maximum: {review.maxScore} points
                        </Tag>
                      </div>
                    </div>

                    <Form
                      layout="vertical"
                      className="grading-form"
                      onFinish={(values) => {
                        const limitedScore = Math.min(
                          values.score,
                          review.maxScore,
                        )
                        handleReviewSubmission({
                          ...values,
                          score: limitedScore,
                        })
                      }}
                    >
                      <Form.Item
                        name="submission_id"
                        initialValue={review.submission_id}
                        hidden
                      >
                        <Input type="hidden" />
                      </Form.Item>

                      <Form.Item
                        name="score"
                        label={`Score (0-${review.maxScore})`}
                        rules={[
                          { required: true, message: 'Score is required' },
                          {
                            type: 'number',
                            max: review.maxScore,
                            message: `Score cannot exceed ${review.maxScore} points`,
                          },
                        ]}
                      >
                        <InputNumber
                          min={0}
                          max={review.maxScore}
                          style={{ width: '100%' }}
                          placeholder="Enter score"
                          addonAfter={`/ ${review.maxScore}`}
                        />
                      </Form.Item>

                      <Form.Item
                        name="feedback"
                        label="Feedback"
                        tooltip="Provide constructive feedback to help the employee improve"
                      >
                        <TextArea
                          rows={4}
                          placeholder="Provide feedback on this submission..."
                        />
                      </Form.Item>
                      <Form.Item className="form-actions">
                        <Button
                          type="primary"
                          htmlType="submit"
                          icon={<CheckOutlined />}
                        >
                          Submit Grade
                        </Button>
                      </Form.Item>
                    </Form>
                  </div>
                </Col>
              </Row>
            </div>
          )}
        </Card>
      </List.Item>
    )}
  />
)

export default ReviewsList
