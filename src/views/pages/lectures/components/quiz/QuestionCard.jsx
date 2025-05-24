import React from 'react'
import { Radio, Checkbox, Tag, Row, Col, Tooltip } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'

const QuestionCard = ({
  question,
  userAnswers,
  multipleAnswers,
  onSingleAnswerSelect,
  onMultipleAnswerSelect,
  quizTotalScore,
}) => {
  const isMultipleSelect = question.allow_multiple

  return (
    <div className="question-content-wrapper">
      <div className="question-header">
        <div className="question-text">{question.question_text}</div>
        <div className="question-points">
          <Tooltip title="Points for this question">
            <span className="question-points-value">
              {question.question_score * quizTotalScore} point
            </span>
            <InfoCircleOutlined className="question-points-icon" />
          </Tooltip>
        </div>
      </div>

      <div className="question-type-tag">
        <Tag color={isMultipleSelect ? 'purple' : 'blue'}>
          {isMultipleSelect ? 'Select all that apply' : 'Select one answer'}
        </Tag>
      </div>

      <div className="answer-options-modern">
        {isMultipleSelect ? (
          <Checkbox.Group
            value={multipleAnswers[question.id] || []}
            onChange={(checkedValues) =>
              onMultipleAnswerSelect(checkedValues, question.id)
            }
          >
            <Row gutter={[0, 12]}>
              {question.options.map((option) => (
                <Col span={24} key={option.id}>
                  <div className="answer-option-card multiple">
                    <Checkbox value={option.id}>{option.text}</Checkbox>
                  </div>
                </Col>
              ))}
            </Row>
          </Checkbox.Group>
        ) : (
          <Radio.Group
            value={userAnswers[question.id]}
            onChange={(e) => onSingleAnswerSelect(question.id, e.target.value)}
          >
            <Row gutter={[0, 12]}>
              {question.options.map((option) => (
                <Col span={24} key={option.id}>
                  <div className="answer-option-card single">
                    <Radio value={option.id}>{option.text}</Radio>
                  </div>
                </Col>
              ))}
            </Row>
          </Radio.Group>
        )}
      </div>
    </div>
  )
}

export default QuestionCard
