import React from 'react'
import {
  Collapse,
  Tag,
  Button,
  Divider,
  Typography,
  Progress,
  Card,
} from 'antd'
import {
  CheckCircleOutlined,
  CloseOutlined,
  CheckOutlined,
  ReloadOutlined,
} from '@ant-design/icons'
import './QuizResults.scss'

const { Text, Title } = Typography
const { Panel } = Collapse

const QuizResults = ({ quizData, quizResult, onRetry }) => {
  const {
    max_score,
    pass_threshold,
    passed,
    total_score,
    submissions = [],
  } = quizResult || {}

  const percentage = max_score ? Math.round((total_score / max_score) * 100) : 0
  const correctCount = submissions.filter((sub) => sub.is_correct).length
  const incorrectCount = submissions.length - correctCount

  return (
    <div className="quiz-results">
      <div className="quiz-results__header">
        <Title level={4} className="quiz-results__title">
          Quiz Results
        </Title>
      </div>

      <div className="quiz-results__content">
        <div className="quiz-results__summary-redesign">
          <div className="quiz-results__status-card">
            <div
              className={`quiz-results__status-icon ${passed ? 'passed' : 'failed'}`}
            >
              {passed ? <CheckCircleOutlined /> : <CloseOutlined />}
            </div>
            <div className="quiz-results__status-content">
              <div className="quiz-results__status-label">
                {passed ? 'Quiz Passed' : 'Quiz Failed'}
              </div>
              <div className="quiz-results__score-bar">
                <Progress
                  percent={percentage}
                  size="small"
                  status={passed ? 'success' : 'exception'}
                  showInfo={false}
                />
                <span className="quiz-results__score-text">{percentage}%</span>
              </div>
              <div className="quiz-results__score-detail">
                Score: <strong>{total_score}</strong> / {max_score} points
              </div>
            </div>
          </div>

          <div className="quiz-results__stats-cards quiz-results__stats-cards--two">
            <Card className="quiz-results__stat-card correct">
              <div className="quiz-results__stat-card-icon">
                <CheckCircleOutlined />
              </div>
              <div className="quiz-results__stat-card-value">
                {correctCount}
              </div>
              <div className="quiz-results__stat-card-label">Correct</div>
            </Card>

            <Card className="quiz-results__stat-card incorrect">
              <div className="quiz-results__stat-card-icon">
                <CloseOutlined />
              </div>
              <div className="quiz-results__stat-card-value">
                {incorrectCount}
              </div>
              <div className="quiz-results__stat-card-label">Incorrect</div>
            </Card>
          </div>
        </div>

        <Divider className="quiz-results__divider">
          <Text strong>Review Questions</Text>
        </Divider>

        <div className="quiz-results__questions">
          <Collapse
            defaultActiveKey={[]}
            expandIconPosition="end"
            className="quiz-results__collapse"
          >
            {quizData.questions.map((question, index) => {
              const submission = submissions.find(
                (sub) => sub.question_id === question.id,
              )
              if (!submission) return null

              const { is_correct, selected_answers, correct_answers, score } =
                submission
              const questionScore = score || 0

              return (
                <Panel
                  key={question.id}
                  header={
                    <div className="quiz-results__question-header">
                      <div
                        className={`quiz-results__question-number ${is_correct ? 'correct' : 'incorrect'}`}
                      >
                        Q{index + 1}
                      </div>
                      <div className="quiz-results__question-text">
                        {question.question_text}
                      </div>
                      <div className="quiz-results__question-meta">
                        <div className="quiz-results__question-points">
                          {questionScore} point
                        </div>
                        <div className="quiz-results__question-result">
                          {is_correct ? (
                            <Tag color="success" icon={<CheckOutlined />}>
                              Correct
                            </Tag>
                          ) : (
                            <Tag color="error" icon={<CloseOutlined />}>
                              Incorrect
                            </Tag>
                          )}
                        </div>
                      </div>
                    </div>
                  }
                  className={`quiz-results__panel ${is_correct ? 'correct' : 'incorrect'}`}
                >
                  <div className="quiz-results__options">
                    {question.options.map((option) => {
                      let optionClass = ''
                      let optionIcon = null

                      const isSelected = selected_answers.includes(option.id)
                      const isCorrect = correct_answers.includes(option.id)

                      if (isSelected && isCorrect) {
                        optionClass = 'correct'
                        optionIcon = <CheckOutlined />
                      } else if (isSelected && !isCorrect) {
                        optionClass = 'incorrect'
                        optionIcon = <CloseOutlined />
                      } else if (!isSelected && isCorrect) {
                        optionClass = 'missed'
                        optionIcon = <CheckOutlined />
                      }

                      return (
                        <div
                          key={option.id}
                          className={`quiz-results__option ${optionClass}`}
                        >
                          <div className="quiz-results__option-indicator">
                            {optionIcon}
                          </div>
                          <div className="quiz-results__option-text">
                            {option.text}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </Panel>
              )
            })}
          </Collapse>
        </div>
      </div>

      <div className="quiz-results__footer">
        {!passed && (
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            className="quiz-results__retry-button"
            onClick={onRetry}
          >
            Retry Quiz
          </Button>
        )}
      </div>
    </div>
  )
}

export default QuizResults
