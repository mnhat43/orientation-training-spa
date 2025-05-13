import React, { useState } from 'react'
import {
  Form,
  Input,
  Button,
  Select,
  InputNumber,
  Upload,
  Typography,
  Checkbox,
  Tooltip,
  Row,
  Col,
  Collapse,
  Badge,
} from 'antd'
import {
  PlusOutlined,
  MinusCircleOutlined,
  UploadOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
  CheckOutlined,
  QuestionCircleOutlined,
  TrophyOutlined,
  FireOutlined,
  ReloadOutlined,
  FormOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  CaretRightOutlined,
  EditOutlined,
} from '@ant-design/icons'
import PropTypes from 'prop-types'
import './QuizForm.scss'

const { TextArea } = Input
const { Text } = Typography
const { Panel } = Collapse

const QuizForm = ({ form, onSubmit, isInDrawer = false }) => {
  const [quizType, setQuizType] = useState('multiple_choice')

  const difficultyOptions = [
    { label: 'Easy', value: 'easy' },
    { label: 'Medium', value: 'medium' },
    { label: 'Hard', value: 'hard' },
  ]

  const handleSubmit = (values) => {
    const formattedValues = {
      title: values.title,
      item_type: 'quiz',
      quiz_data: {
        type: quizType,
        category: values.category,
        score: values.score,
        max_attempts: values.max_attempts,
        time_limit: values.time_limit || null,
        questions: quizType === 'multiple_choice' ? values.questions : null,
        essay_question: quizType === 'essay' ? values.essay_question : null,
        pdf_file:
          quizType === 'essay' && values.pdf_file
            ? values.pdf_file[0].originFileObj
            : null,
      },
    }

    onSubmit(formattedValues)
  }

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e
    }
    return e?.fileList
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      requiredMark={false}
      className="form-content quiz-form"
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
              name="category"
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
          <Col xs={24} md={8}>
            <Form.Item
              name="score"
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
                placeholder="10"
                style={{ width: '100%' }}
                className="form-content__input-number"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              name="max_attempts"
              label={
                <span className="form-content__label">
                  <ReloadOutlined /> Max Attempts
                </span>
              }
              rules={[
                {
                  required: quizType === 'multiple_choice',
                  message: 'Required',
                },
              ]}
              className="form-content__form-item form-content__form-item--compact"
            >
              <InputNumber
                min={1}
                max={10}
                placeholder="3"
                style={{ width: '100%' }}
                disabled={quizType !== 'multiple_choice'}
                className="form-content__input-number"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
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
            className={`quiz-form__type-option ${quizType === 'multiple_choice' ? 'quiz-form__type-option--active' : ''}`}
            onClick={() => setQuizType('multiple_choice')}
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
            {quizType === 'multiple_choice' && (
              <CheckOutlined className="quiz-form__type-check" />
            )}
          </div>

          <div
            className={`quiz-form__type-option ${quizType === 'essay' ? 'quiz-form__type-option--active' : ''}`}
            onClick={() => setQuizType('essay')}
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
            {quizType === 'essay' && (
              <CheckOutlined className="quiz-form__type-check" />
            )}
          </div>
        </div>

        <div className="quiz-form__type-content">
          {quizType === 'multiple_choice' && (
            <Form.List name="questions">
              {(fields, { add, remove }) => (
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
                      onClick={() =>
                        add({
                          question_text: '',
                          question_score: 1,
                          allow_multiple: false,
                          options: [
                            { text: '', is_correct: false },
                            { text: '', is_correct: false },
                          ],
                        })
                      }
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
                              question_score: 1,
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
                    >
                      {fields.map(({ key, name, ...restField }) => (
                        <Panel
                          key={key}
                          className="quiz-form__question-panel"
                          header={
                            <div className="quiz-form__question-header">
                              <div className="quiz-form__question-number">
                                Q{name + 1}
                              </div>
                              <div className="quiz-form__question-preview">
                                <Form.Item
                                  noStyle
                                  shouldUpdate={(prevValues, currentValues) => {
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
                                    return <Text ellipsis>{questionText}</Text>
                                  }}
                                </Form.Item>
                              </div>
                              <div className="quiz-form__question-points-badge">
                                <Form.Item
                                  noStyle
                                  shouldUpdate={(prevValues, currentValues) => {
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
                                        count={`${points} pts`}
                                        style={{ backgroundColor: '#52c41a' }}
                                      />
                                    )
                                  }}
                                </Form.Item>
                              </div>
                            </div>
                          }
                          extra={
                            <Button
                              type="text"
                              danger
                              icon={<DeleteOutlined />}
                              onClick={(e) => {
                                e.stopPropagation()
                                remove(name)
                              }}
                              className="quiz-form__delete-question-btn"
                            />
                          }
                        >
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
                                        message: 'Please enter question text',
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
                                    label="Points"
                                    rules={[
                                      { required: true, message: 'Required' },
                                    ]}
                                    className="quiz-form__question-score"
                                  >
                                    <InputNumber
                                      min={1}
                                      max={100}
                                      style={{ width: '100%' }}
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

                              <Form.List name={[name, 'options']}>
                                {(subFields, subOpt) => (
                                  <div className="quiz-form__options-list">
                                    {subFields.map((subField, index) => (
                                      <div
                                        key={subField.key}
                                        className="quiz-form__option-item"
                                      >
                                        <Form.Item
                                          {...restField}
                                          name={[subField.name, 'is_correct']}
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
                                            placeholder={`Option ${index + 1}`}
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
                                      onClick={() => subOpt.add()}
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
                        </Panel>
                      ))}
                    </Collapse>
                  )}
                </>
              )}
            </Form.List>
          )}

          {quizType === 'essay' && (
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

              <Form.Item
                name="pdf_file"
                label="Or Upload Question PDF (optional)"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                className="form-content__form-item quiz-form__pdf-upload form-content__upload-item--compact"
              >
                <Upload
                  maxCount={1}
                  beforeUpload={() => false}
                  accept=".pdf"
                  className="form-content__upload form-content__upload--compact"
                >
                  <Button
                    icon={<UploadOutlined />}
                    className="form-content__upload-btn form-content__upload-btn--compact"
                  >
                    Upload PDF
                  </Button>
                </Upload>
              </Form.Item>

              <Form.Item
                name="answer_format"
                label="Expected Answer Format"
                className="form-content__form-item quiz-form__answer-format"
              >
                <TextArea
                  rows={3}
                  placeholder="Describe the expected format of answers (optional)"
                  className="form-content__textarea"
                />
              </Form.Item>
            </div>
          )}
        </div>
      </div>

      <Form.Item className="form-content__submit">
        <Button type="primary" htmlType="submit" block>
          Create Quiz
        </Button>
      </Form.Item>
    </Form>
  )
}

QuizForm.propTypes = {
  form: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isInDrawer: PropTypes.bool,
}

export default QuizForm
