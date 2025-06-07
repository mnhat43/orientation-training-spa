import React from 'react'
import { Radio, Checkbox, Tag, Row, Col, Tooltip } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'

const QuestionCard = ({
  question,
  userAnswers,
  multipleAnswers,
  onSingleAnswerSelect,
  onMultipleAnswerSelect,
}) => {
  const { question_id, question_text, allow_multiple, points, options } =
    question

  return (
    <div className="question-content-wrapper">
      <div className="question-header">
        <div className="question-text">{question_text}</div>
        <div className="question-points">
          <Tooltip title="Points for this question">
            <span className="question-points-value">{points} points</span>
            <InfoCircleOutlined className="question-points-icon" />
          </Tooltip>
        </div>
      </div>

      <div className="question-type-tag">
        <Tag color={allow_multiple ? 'purple' : 'blue'}>
          {allow_multiple ? 'Select all that apply' : 'Select one answer'}
        </Tag>
      </div>

      <div className="answer-options-modern">
        {allow_multiple ? (
          <Checkbox.Group
            value={multipleAnswers[question_id] || []}
            onChange={(checkedValues) =>
              onMultipleAnswerSelect(checkedValues, question_id)
            }
          >
            <Row gutter={[0, 12]}>
              {options.map((option) => (
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
            value={userAnswers[question_id]}
            onChange={(e) => onSingleAnswerSelect(question_id, e.target.value)}
          >
            <Row gutter={[0, 12]}>
              {options.map((option) => (
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
