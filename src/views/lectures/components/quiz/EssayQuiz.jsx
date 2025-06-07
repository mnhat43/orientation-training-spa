import React from 'react'
import { Button, Input, Typography, Statistic, Alert } from 'antd'
import {
  FormOutlined,
  CheckOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons'
import './EssayQuiz.scss'

const { TextArea } = Input
const { Text, Paragraph, Title } = Typography
const { Countdown } = Statistic

const EssayQuiz = ({
  questions,
  deadline,
  showResults,
  essayAnswer,
  onEssayChange,
  onSubmit,
  onTimeWarning,
  handleConfirmModal,
  resultData,
}) => {
  const questionText =
    questions && questions.length > 0
      ? questions[0].question_text
      : 'No question available'

  return (
    <div className="quiz-modern quiz-modern-essay">
      <div className="quiz-modern-header">
        {deadline && !showResults && (
          <div className="quiz-modern-timer">
            <Countdown
              value={deadline}
              format="mm:ss"
              onFinish={onSubmit}
              onChange={(val) => {
                if (val <= 2 * 60 * 1000 && val > 0) {
                  onTimeWarning()
                }
              }}
            />
          </div>
        )}
      </div>

      <div className="essay-modern-container">
        {showResults ? (
          <div className="essay-confirmation-custom">
            <div className="essay-confirmation-header">
              <div
                className={`essay-confirmation-icon ${resultData?.passed ? 'passed' : 'pending'}`}
              >
                {resultData?.passed ? (
                  <CheckOutlined />
                ) : (
                  <ClockCircleOutlined />
                )}
              </div>
              <div className="essay-confirmation-title">
                <Title level={3}>Essay Submitted Successfully</Title>
                <Text type="secondary" className="essay-confirmation-subtitle">
                  {resultData?.passed
                    ? 'Your essay has passed the requirements!'
                    : 'Your essay has been submitted and is pending review.'}
                </Text>
              </div>
            </div>

            <div className="essay-confirmation-content">
              {resultData?.passed && (
                <Alert
                  message="Success"
                  description="You have completed this essay quiz successfully."
                  type="success"
                  showIcon
                  className="essay-confirmation-alert"
                />
              )}

              {resultData?.essay_submissions?.some((sub) => !sub.reviewed) && (
                <Alert
                  message="Pending Review"
                  description="Your submission will be reviewed by an instructor."
                  type="info"
                  showIcon
                  className="essay-confirmation-alert"
                />
              )}

              <div className="essay-submission-box">
                <Title level={5} className="essay-submission-title">
                  Your Submission
                </Title>
                <div className="essay-submission-content-wrapper">
                  <div className="essay-submission-text">
                    {essayAnswer || (
                      <Text type="secondary">No response submitted</Text>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="essay-modern-question">
              <div className="essay-question-card">
                <div className="essay-question-row">
                  <FormOutlined className="essay-question-icon" />
                  <div className="essay-question-content">
                    <Paragraph>{questionText}</Paragraph>
                  </div>
                </div>
              </div>
            </div>

            <div className="essay-modern-answer">
              <TextArea
                rows={6}
                value={essayAnswer}
                onChange={onEssayChange}
                placeholder="Type your answer here..."
                className="essay-input"
              />
              <div className="essay-input-footer">
                <Text type="secondary">
                  {essayAnswer.length} characters |{' '}
                  {essayAnswer.split(/\s+/).filter(Boolean).length} words
                </Text>
              </div>
            </div>

            <div className="quiz-modern-footer">
              <Button
                type="primary"
                onClick={handleConfirmModal}
                className="submit-button"
                disabled={!essayAnswer.trim().length}
              >
                Submit Essay
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default EssayQuiz
