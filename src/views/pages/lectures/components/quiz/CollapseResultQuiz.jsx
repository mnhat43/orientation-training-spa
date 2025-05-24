import React from 'react'
import { Tag, Alert, Collapse } from 'antd'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import './CollapseResultQuiz.scss'

const CollapseResultQuiz = ({ questions, answers }) => {
  const collapseItems = questions.map((question, index) => {
    const userAnswer = answers.find((a) => a.question_id === question.id)
    const isCorrect = userAnswer?.is_correct
    const questionScore = question.points

    const header = (
      <div className="quiz-questions-review-header">
        <div
          className={`quiz-questions-review-number ${
            isCorrect ? 'correct' : 'incorrect'
          }`}
        >
          Q{index + 1}
        </div>
        <div className="quiz-questions-review-text">
          {question.question_text}
        </div>
        <div className="quiz-questions-review-meta">
          <div className="quiz-questions-review-points">
            {questionScore} points
          </div>
          <div className="quiz-questions-review-result">
            {isCorrect !== undefined && (
              <Tag
                color={isCorrect ? 'success' : 'error'}
                icon={isCorrect ? <CheckOutlined /> : <CloseOutlined />}
              >
                {isCorrect ? 'Correct' : 'Incorrect'}
              </Tag>
            )}
          </div>
        </div>
      </div>
    )

    const children = (
      <>
        <div className="quiz-questions-review-options">
          {question.options.map((option) => {
            let optionClass = ''
            let optionIcon = null

            const isSelected = userAnswer?.selected_answer_ids?.includes(
              option.id,
            )
            const isCorrectAnswer = userAnswer?.correct_answer_ids?.includes(
              option.id,
            )

            if (isSelected && isCorrectAnswer) {
              optionClass = 'correct'
              optionIcon = <CheckOutlined />
            } else if (isSelected && !isCorrectAnswer) {
              optionClass = 'incorrect'
              optionIcon = <CloseOutlined />
            } else if (!isSelected && isCorrectAnswer) {
              optionClass = 'missed'
              optionIcon = <CheckOutlined />
            }

            return (
              <div
                key={option.id}
                className={`quiz-questions-review-option ${optionClass}`}
              >
                <div className="quiz-questions-review-option-indicator">
                  {optionIcon}
                </div>
                <div className="quiz-questions-review-option-text">
                  {option.text}
                </div>
              </div>
            )
          })}
        </div>

        {userAnswer?.explanation && (
          <div className="quiz-questions-review-explanation">
            <Alert
              message="Explanation"
              description={userAnswer.explanation}
              type="info"
            />
          </div>
        )}
      </>
    )

    return {
      key: question.id,
      label: header,
      children: children,
      className: `quiz-questions-review-panel ${
        isCorrect ? 'correct' : 'incorrect'
      }`,
    }
  })

  return (
    <div className="quiz-questions-review">
      <Collapse
        defaultActiveKey={[]}
        expandIconPosition="end"
        className="quiz-questions-review-collapse"
        items={collapseItems}
      />
    </div>
  )
}

export default CollapseResultQuiz
