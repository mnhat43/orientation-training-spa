import React from 'react'
import { Card, Typography, Tag, Divider, Alert } from 'antd'
import {
  EditOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons'

const { Title, Paragraph, Text } = Typography

const EssayQuizReview = ({ questions, quizResult }) => {
  const { answers, feedback, user_score } = quizResult

  const question = questions.length > 0 ? questions[0] : null

  return (
    <div className="quiz-review essay-review">
      <div className="essay-question-header-row">
        <div className="essay-question-wrapper">
          <QuestionCircleOutlined className="essay-question-icon" />
          <div className="essay-question-text">
            <Text>{question?.question_text}</Text>
          </div>
        </div>
        <div className="essay-status">
          {user_score ? (
            <Tag color={'success'} icon={<TrophyOutlined />}>
              Grade: {user_score}
            </Tag>
          ) : (
            <Tag color="processing" icon={<ClockCircleOutlined />}>
              Awaiting Review
            </Tag>
          )}
        </div>
      </div>

      <Divider />

      <div className="quiz-review-scroll-container">
        <div className="essay-review-content">
          <Title level={5}>Your Submission</Title>
          <div className="essay-answer">
            <Card className="essay-answer-card">
              <Paragraph>
                {answers[0]?.answer_text || 'No submission found'}
              </Paragraph>
            </Card>
          </div>

          {user_score && (
            <>
              <Title level={5} className="feedback-title">
                Instructor Feedback
              </Title>
              {feedback ? (
                <Card className="feedback-card">
                  <Paragraph>{feedback}</Paragraph>
                </Card>
              ) : (
                <Alert message="No feedback provided" type="info" />
              )}
            </>
          )}

          {!user_score && (
            <Alert
              message="Your essay has been submitted"
              description="Your submission is being reviewed by an instructor. You'll be able to see feedback once it's been evaluated."
              type="info"
              showIcon
              icon={<EditOutlined />}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default EssayQuizReview
