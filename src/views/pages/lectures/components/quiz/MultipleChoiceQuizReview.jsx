import React from 'react'
import { Typography, Divider, Progress } from 'antd'
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons'
import CollapseResultQuiz from './CollapseResultQuiz'

const { Text } = Typography

const MultipleChoiceQuizReview = ({ questions, quizResult }) => {
  const { answers, total_score, user_score } = quizResult

  const correctCount = answers.filter((a) => a.is_correct).length
  const incorrectCount = answers.length - correctCount
  const percentage =
    total_score > 0 ? Math.round((user_score / total_score) * 100) : 0

  return (
    <div className="quiz-review multiple-choice-review">
      <div className="quiz-review-header">
        <div className="quiz-review-summary">
          <div className="quiz-review-status-card">
            <div className="quiz-review-status-icon passed">
              <CheckCircleFilled />
            </div>
            <div className="quiz-review-status-content">
              <div className="quiz-review-status-label">Quiz Passed</div>
              <div className="quiz-review-score-bar">
                <Progress
                  percent={percentage}
                  size="small"
                  status="success"
                  showInfo={false}
                />
                <span className="quiz-review-score-text">{percentage}%</span>
              </div>
              <div className="quiz-review-score-detail">
                Grade: <strong>{user_score}</strong> / {total_score} points
              </div>
            </div>
          </div>

          <div className="quiz-review-stats">
            <div className="quiz-review-stat correct">
              <div className="quiz-review-stat-icon">
                <CheckCircleFilled />
              </div>
              <div className="quiz-review-stat-value">{correctCount}</div>
              <div className="quiz-review-stat-label">Correct</div>
            </div>

            <div className="quiz-review-stat incorrect">
              <div className="quiz-review-stat-icon">
                <CloseCircleFilled />
              </div>
              <div className="quiz-review-stat-value">{incorrectCount}</div>
              <div className="quiz-review-stat-label">Incorrect</div>
            </div>
          </div>
        </div>
      </div>

      <Divider>
        <Text strong>Review Questions</Text>
      </Divider>

      <CollapseResultQuiz questions={questions} answers={answers} />
    </div>
  )
}

export default MultipleChoiceQuizReview
