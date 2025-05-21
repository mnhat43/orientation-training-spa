import React, { useState, useEffect, useRef } from 'react'
import {
  Form,
  Input,
  Button,
  Select,
  InputNumber,
  Typography,
  Checkbox,
  Tooltip,
  Row,
  Col,
  Collapse,
  Badge,
  message,
} from 'antd'
import {
  PlusOutlined,
  MinusCircleOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
  CheckOutlined,
  QuestionCircleOutlined,
  TrophyOutlined,
  FireOutlined,
  FormOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  CaretRightOutlined,
} from '@ant-design/icons'
import './QuizForm.scss'
import { DIFFICULTY, QUESTION_TYPE } from '@/constants/quiz'

const { TextArea } = Input
const { Text } = Typography

const QuizForm = ({ form, onSubmit }) => {
  const [quizType, setQuizType] = useState(QUESTION_TYPE.MultipleChoice)
  const [totalWeight, setTotalWeight] = useState(0)

  const questionsFieldsRef = useRef([])
  const hasAdjustedWeightsRef = useRef(false)

  const difficultyOptions = [
    { label: 'Easy', value: DIFFICULTY.Easy },
    { label: 'Medium', value: DIFFICULTY.Medium },
    { label: 'Hard', value: DIFFICULTY.Hard },
  ]

  useEffect(() => {
    if (quizType === QUESTION_TYPE.MultipleChoice) {
      const questions = form.getFieldValue('questions') || []
      const total = questions.reduce(
        (sum, q) => sum + (q?.question_score || 0),
        0,
      )

      setTotalWeight(total)

      if (
        questions.length > 0 &&
        total !== 100 &&
        !hasAdjustedWeightsRef.current &&
        questionsFieldsRef.current.length === questions.length
      ) {
        hasAdjustedWeightsRef.current = true

        const adjustedQuestions = [...questions]
        const equalWeight = Math.floor(100 / questions.length)
        let remainder = 100 - equalWeight * questions.length

        adjustedQuestions.forEach((q, index) => {
          let weight = equalWeight
          if (remainder > 0) {
            weight += 1
            remainder--
          }
          adjustedQuestions[index] = {
            ...q,
            question_score: weight,
          }
        })

        setTimeout(() => {
          form.setFieldsValue({ questions: adjustedQuestions })
          setTotalWeight(100)
        }, 0)
      }
    }
  }, [quizType, form])

  const handleFormValuesChange = (changedValues) => {
    if (changedValues.questions) {
      hasAdjustedWeightsRef.current = false
    }
  }

  const handleSubmit = async (values) => {
    if (quizType === QUESTION_TYPE.MultipleChoice) {
      const questions = values.questions || []
      const totalWeight = questions.reduce(
        (sum, q) => sum + (q?.question_score || 0),
        0,
      )

      if (totalWeight !== 100) {
        message.error('Question weights must add up to 100%')
        return
      }

      const formattedQuestions = questions.map((question) => {
        const formattedOptions = question.options.map((option) => ({
          answers_text: option.text,
          is_correct: option.is_correct,
        }))

        return {
          question_text: question.question_text,
          weight: question.question_score / 100,
          allow_multiple: question.allow_multiple,
          options: formattedOptions,
        }
      })

      const formattedValues = {
        title: values.title,
        quiz_data: {
          question_type: QUESTION_TYPE.MultipleChoice,
          difficulty: values.difficulty,
          total_score: values.total_score,
          time_limit: values.time_limit * 60 || null,
          questions: formattedQuestions,
        },
      }

      onSubmit(formattedValues)
    } else if (quizType === QUESTION_TYPE.Essay) {
      const formattedValues = {
        title: values.title,
        quiz_data: {
          question_type: QUESTION_TYPE.Essay,
          difficulty: values.difficulty,
          total_score: values.total_score,
          time_limit: values.time_limit * 60 || null,
          essay_question: values.essay_question,
        },
      }

      onSubmit(formattedValues)
    }
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      requiredMark={false}
      className="form-content quiz-form"
      onValuesChange={handleFormValuesChange}
      initialValues={{
        score: 100,
      }}
      onFinishFailed={(errorInfo) => {
        console.log('Form validation failed:', errorInfo)
      }}
    >
      <div className="form-content__section form-content__compact-section">
        <div className="form-content__section-header">
          <div className="form-content__section-icon">
            <QuestionCircleOutlined />
          </div>
          <div className="form-content__section-title">Quiz Details</div>
        </div>
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="title"
              label="Quiz Title"
              rules={[{ required: true, message: 'Please enter quiz title' }]}
              className="form-content__form-item form-content__form-item--compact"
            >
              <Input
                placeholder="Enter quiz title"
                className="form-content__input"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="difficulty"
              label={
                <span className="form-content__label">
                  <FireOutlined /> Difficulty
                </span>
              }
              rules={[{ required: true, message: 'Please select difficulty' }]}
              className="form-content__form-item form-content__form-item--compact"
            >
              <Select
                placeholder="Select difficulty"
                options={difficultyOptions}
                className="form-content__select"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="total_score"
              label={
                <span className="form-content__label">
                  <TrophyOutlined /> Total Score
                </span>
              }
              rules={[{ required: true, message: 'Required' }]}
              className="form-content__form-item form-content__form-item--compact"
            >
              <InputNumber
                min={1}
                max={100}
                placeholder="100"
                style={{ width: '100%' }}
                className="form-content__input-number"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="time_limit"
              label={
                <span className="form-content__label">
                  <ClockCircleOutlined /> Time Limit (min)
                </span>
              }
              className="form-content__form-item form-content__form-item--compact"
            >
              <InputNumber
                min={1}
                max={180}
                placeholder="No limit"
                style={{ width: '100%' }}
                className="form-content__input-number"
              />
            </Form.Item>
          </Col>
        </Row>
      </div>
      <div className="form-content__section">
        <div className="form-content__section-header">
          <div className="form-content__section-icon">
            <FileTextOutlined />
          </div>
          <div className="form-content__section-title">Question Type</div>
        </div>
        <div className="quiz-form__type-selector">
          <div
            className={`quiz-form__type-option ${
              quizType === QUESTION_TYPE.MultipleChoice
                ? 'quiz-form__type-option--active'
                : ''
            }`}
            onClick={() => setQuizType(QUESTION_TYPE.MultipleChoice)}
          >
            <div className="quiz-form__type-icon">
              <QuestionCircleOutlined />
            </div>
            <div className="quiz-form__type-info">
              <div className="quiz-form__type-title">Multiple Choice</div>
              <div className="quiz-form__type-desc">
                Questions with predefined answer options
              </div>
            </div>
            {quizType === QUESTION_TYPE.MultipleChoice && (
              <CheckOutlined className="quiz-form__type-check" />
            )}
          </div>
          <div
            className={`quiz-form__type-option ${
              quizType === QUESTION_TYPE.Essay
                ? 'quiz-form__type-option--active'
                : ''
            }`}
            onClick={() => setQuizType(QUESTION_TYPE.Essay)}
          >
            <div className="quiz-form__type-icon">
              <FormOutlined />
            </div>
            <div className="quiz-form__type-info">
              <div className="quiz-form__type-title">Essay</div>
              <div className="quiz-form__type-desc">
                Open questions requiring written responses
              </div>
            </div>
            {quizType === QUESTION_TYPE.Essay && (
              <CheckOutlined className="quiz-form__type-check" />
            )}
          </div>
        </div>
        <div className="quiz-form__type-content">
          {quizType === QUESTION_TYPE.MultipleChoice && (
            <>
              <div className="quiz-form__weight-container">
                <div className="quiz-form__weight-indicator">
                  <div className="quiz-form__weight-label">
                    <Text strong>Total Question Weights:</Text>
                  </div>
                  <div className="quiz-form__weight-value">
                    <Badge
                      count={`${totalWeight}%`}
                      style={{
                        backgroundColor:
                          totalWeight === 100 ? '#52c41a' : '#f5222d',
                        fontSize: '14px',
                        padding: '0 8px',
                      }}
                    />
                  </div>
                </div>
                {totalWeight !== 100 && (
                  <div className="quiz-form__weight-warning">
                    <Text type="danger">
                      <InfoCircleOutlined /> Question weights must add up to
                      100%
                    </Text>
                  </div>
                )}
              </div>

              <Form.List
                name="questions"
                rules={[
                  {
                    validator: async (_, questions) => {
                      if (!questions || questions.length < 1) {
                        return Promise.reject(
                          new Error('At least one question is required'),
                        )
                      }
                    },
                  },
                ]}
              >
                {(fields, { add, remove }) => {
                  questionsFieldsRef.current = fields

                  return (
                    <>
                      <div className="quiz-form__questions-header">
                        <Badge
                          count={fields.length}
                          showZero
                          color="#1890ff"
                          style={{ fontSize: '12px' }}
                          overflowCount={999}
                        >
                          <Text strong style={{ marginRight: '8px' }}>
                            Questions
                          </Text>
                        </Badge>
                        <Button
                          type="primary"
                          size="small"
                          icon={<PlusOutlined />}
                          onClick={() => {
                            const currentQuestions =
                              form.getFieldValue('questions') || []
                            const newQuestionWeight =
                              currentQuestions.length === 0
                                ? 100
                                : Math.floor(
                                    (100 - totalWeight) /
                                      (currentQuestions.length + 1),
                                  )

                            add({
                              question_text: '',
                              question_score: Math.max(newQuestionWeight, 1),
                              allow_multiple: false,
                              options: [
                                { text: '', is_correct: false },
                                { text: '', is_correct: false },
                              ],
                            })

                            hasAdjustedWeightsRef.current = false
                          }}
                        >
                          Add Question
                        </Button>
                      </div>

                      {fields.length === 0 ? (
                        <div className="quiz-form__no-questions">
                          <div className="quiz-form__no-questions-content">
                            <QuestionCircleOutlined className="quiz-form__no-questions-icon" />
                            <Text>No questions added yet.</Text>
                            <Button
                              type="primary"
                              onClick={() =>
                                add({
                                  question_text: '',
                                  question_score: 100,
                                  allow_multiple: false,
                                  options: [
                                    { text: '', is_correct: false },
                                    { text: '', is_correct: false },
                                  ],
                                })
                              }
                            >
                              Add your first question
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Collapse
                          className="quiz-form__questions-list"
                          expandIcon={({ isActive }) => (
                            <CaretRightOutlined rotate={isActive ? 90 : 0} />
                          )}
                          expandIconPosition="end"
                          ghost
                          items={fields.map(({ key, name, ...restField }) => ({
                            key,
                            className: 'quiz-form__question-panel',
                            label: (
                              <div className="quiz-form__question-header">
                                <div className="quiz-form__question-number">
                                  Q{name + 1}
                                </div>
                                <div className="quiz-form__question-preview">
                                  <Form.Item
                                    noStyle
                                    shouldUpdate={(
                                      prevValues,
                                      currentValues,
                                    ) => {
                                      return (
                                        prevValues?.questions?.[name]
                                          ?.question_text !==
                                        currentValues?.questions?.[name]
                                          ?.question_text
                                      )
                                    }}
                                  >
                                    {({ getFieldValue }) => {
                                      const questionText =
                                        getFieldValue([
                                          'questions',
                                          name,
                                          'question_text',
                                        ]) || 'New Question'
                                      return (
                                        <Text ellipsis>{questionText}</Text>
                                      )
                                    }}
                                  </Form.Item>
                                </div>
                                <div className="quiz-form__question-points-badge">
                                  <Form.Item
                                    noStyle
                                    shouldUpdate={(
                                      prevValues,
                                      currentValues,
                                    ) => {
                                      return (
                                        prevValues?.questions?.[name]
                                          ?.question_score !==
                                        currentValues?.questions?.[name]
                                          ?.question_score
                                      )
                                    }}
                                  >
                                    {({ getFieldValue }) => {
                                      const points =
                                        getFieldValue([
                                          'questions',
                                          name,
                                          'question_score',
                                        ]) || 1
                                      return (
                                        <Badge
                                          count={`${points}%`}
                                          style={{
                                            backgroundColor: '#52c41a',
                                          }}
                                        />
                                      )
                                    }}
                                  </Form.Item>
                                </div>
                              </div>
                            ),
                            extra: (
                              <Button
                                type="text"
                                danger
                                icon={<DeleteOutlined />}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  remove(name)
                                }}
                                className="quiz-form__delete-question-btn"
                                disabled={fields.length <= 1}
                              />
                            ),
                            children: (
                              <div className="quiz-form__question-content">
                                <div className="quiz-form__question-main">
                                  <Row gutter={16} align="middle">
                                    <Col xs={24} md={18}>
                                      <Form.Item
                                        {...restField}
                                        name={[name, 'question_text']}
                                        rules={[
                                          {
                                            required: true,
                                            message:
                                              'Please enter question text',
                                          },
                                        ]}
                                        label="Question Text"
                                      >
                                        <TextArea
                                          rows={2}
                                          placeholder="Enter your question"
                                          className="quiz-form__question-textarea"
                                        />
                                      </Form.Item>
                                    </Col>
                                    <Col xs={24} md={6}>
                                      <Form.Item
                                        {...restField}
                                        name={[name, 'question_score']}
                                        label={
                                          <span>
                                            Weight{' '}
                                            <Tooltip title="Percentage of the Total Score for this question">
                                              <InfoCircleOutlined />
                                            </Tooltip>
                                          </span>
                                        }
                                        rules={[
                                          {
                                            required: true,
                                            message: 'Required',
                                          },
                                          {
                                            type: 'number',
                                            min: 1,
                                            max: 100,
                                            message: 'Between 1-100%',
                                          },
                                        ]}
                                        className="quiz-form__question-score"
                                      >
                                        <InputNumber
                                          min={1}
                                          max={100}
                                          formatter={(value) => `${value}%`}
                                          parser={(value) =>
                                            value.replace('%', '')
                                          }
                                          style={{ width: '100%' }}
                                          onChange={() => {
                                            setTimeout(() => {
                                              const questions =
                                                form.getFieldValue(
                                                  'questions',
                                                ) || []
                                              const total = questions.reduce(
                                                (sum, q) =>
                                                  sum +
                                                  (q?.question_score || 0),
                                                0,
                                              )
                                              setTotalWeight(total)
                                            }, 0)
                                          }}
                                        />
                                      </Form.Item>
                                    </Col>
                                  </Row>

                                  <Form.Item
                                    {...restField}
                                    name={[name, 'allow_multiple']}
                                    valuePropName="checked"
                                    className="quiz-form__allow-multiple"
                                  >
                                    <Checkbox>
                                      <Text>
                                        Allow multiple correct answers{' '}
                                        <Tooltip title="Check this if more than one option can be correct">
                                          <InfoCircleOutlined />
                                        </Tooltip>
                                      </Text>
                                    </Checkbox>
                                  </Form.Item>

                                  <div className="quiz-form__options-heading">
                                    <Text strong>Answer Options</Text>
                                    <Text
                                      type="secondary"
                                      className="quiz-form__options-hint"
                                    >
                                      Mark the correct answer(s) with checkbox
                                    </Text>
                                  </div>

                                  <Form.List
                                    name={[name, 'options']}
                                    rules={[
                                      {
                                        validator: async (_, options) => {
                                          if (!options || options.length < 2) {
                                            return Promise.reject(
                                              new Error(
                                                'At least 2 options required',
                                              ),
                                            )
                                          }

                                          const hasCorrect = options.some(
                                            (o) => o.is_correct,
                                          )
                                          if (!hasCorrect) {
                                            return Promise.reject(
                                              new Error(
                                                'At least 1 correct answer required',
                                              ),
                                            )
                                          }
                                        },
                                      },
                                    ]}
                                  >
                                    {(subFields, subOpt) => (
                                      <div className="quiz-form__options-list">
                                        {subFields.map((subField, index) => (
                                          <div
                                            key={subField.key}
                                            className="quiz-form__option-item"
                                          >
                                            <Form.Item
                                              {...restField}
                                              name={[
                                                subField.name,
                                                'is_correct',
                                              ]}
                                              valuePropName="checked"
                                              className="quiz-form__option-correct"
                                            >
                                              <Checkbox />
                                            </Form.Item>
                                            <Form.Item
                                              {...restField}
                                              name={[subField.name, 'text']}
                                              rules={[
                                                {
                                                  required: true,
                                                  message: 'Enter answer text',
                                                },
                                              ]}
                                              className="quiz-form__option-text"
                                            >
                                              <Input
                                                placeholder={`Option ${
                                                  index + 1
                                                }`}
                                              />
                                            </Form.Item>

                                            <Button
                                              type="text"
                                              danger
                                              icon={<MinusCircleOutlined />}
                                              onClick={() =>
                                                subOpt.remove(subField.name)
                                              }
                                              disabled={subFields.length <= 2}
                                              className="quiz-form__option-delete"
                                            />
                                          </div>
                                        ))}

                                        <Button
                                          type="dashed"
                                          onClick={() =>
                                            subOpt.add({
                                              text: '',
                                              is_correct: false,
                                            })
                                          }
                                          icon={<PlusOutlined />}
                                          className="quiz-form__add-option-btn"
                                        >
                                          Add Option
                                        </Button>
                                      </div>
                                    )}
                                  </Form.List>
                                </div>
                              </div>
                            ),
                          }))}
                        />
                      )}
                    </>
                  )
                }}
              </Form.List>
            </>
          )}

          {quizType === QUESTION_TYPE.Essay && (
            <div className="quiz-form__essay-section">
              <Form.Item
                name="essay_question"
                label="Essay Question"
                rules={[
                  {
                    required: true,
                    message: 'Please enter the essay question',
                  },
                ]}
                className="form-content__form-item"
              >
                <TextArea
                  rows={4}
                  placeholder="Enter the essay question"
                  className="form-content__textarea"
                />
              </Form.Item>
            </div>
          )}
        </div>
      </div>
      <Form.Item className="form-content__submit">
        <Button
          type="primary"
          htmlType="submit"
          block
          disabled={
            quizType === QUESTION_TYPE.MultipleChoice && totalWeight !== 100
          }
        >
          Create Quiz
        </Button>
      </Form.Item>
    </Form>
  )
}

export default QuizForm
