import React, { useState } from 'react'
import {
  Modal,
  Rate,
  Input,
  Form,
  Button,
  message,
  Typography,
  Divider,
} from 'antd'
import {
  StarFilled,
  SmileOutlined,
  MehOutlined,
  FrownOutlined,
  CloseCircleOutlined,
  CommentOutlined,
} from '@ant-design/icons'
import { submitAppFeedback } from '@api/feedback'
import './index.scss'

const { TextArea } = Input
const { Title, Text } = Typography

const FeedbackModal = ({ visible, onClose, currentUser }) => {
  const [form] = Form.useForm()
  const [submitting, setSubmitting] = useState(false)
  const [overallRating, setOverallRating] = useState(5)
  const [submitted, setSubmitted] = useState(false)

  const handleRatingChange = (value) => {
    setOverallRating(value)
  }

  const renderFeedbackEmoji = (rating) => {
    if (rating >= 4) return <SmileOutlined className="feedback-emoji happy" />
    if (rating >= 2) return <MehOutlined className="feedback-emoji neutral" />
    return <FrownOutlined className="feedback-emoji sad" />
  }
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      setSubmitting(true)

      try {
        const feedbackData = {
          ...values,
          submittedAt: new Date().toISOString(),
        }

        const response = await submitAppFeedback(feedbackData)

        if (response && response.data) {
          message.success('Thank you for your feedback!')
          setSubmitted(true)

          setTimeout(() => {
            form.resetFields()
          }, 1500)
        } else {
          console.warn('Unexpected response format:', response)
          message.success('Feedback submitted')
          setSubmitted(true)
        }
      } catch (apiError) {
        console.error('Error submitting feedback:', apiError)

        if (apiError.response) {
          console.error('Server error:', apiError.response.data)
          message.error(
            `Failed to submit feedback: ${apiError.response.data.message || 'Server error'}`,
          )
        } else if (apiError.request) {
          console.error('Network error:', apiError.request)
          message.error(
            'Network error. Please check your connection and try again.',
          )
        } else {
          message.error('Failed to submit feedback. Please try again later.')
        }
      } finally {
        setSubmitting(false)
      }
    } catch (validationError) {
      console.error('Validation error:', validationError)
    }
  }

  const renderSuccessContent = () => (
    <div className="feedback-success">
      <div className="success-icon">
        <SmileOutlined />
      </div>
      <Title level={4}>Thank You For Your Feedback!</Title>
    </div>
  )
  return (
    <Modal
      title={
        <div className="feedback-modal-header">
          <CommentOutlined className="feedback-icon" />
          <span>Application Feedback</span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={
        !submitted
          ? [
              <Button key="cancel" onClick={onClose}>
                Cancel
              </Button>,
              <Button
                key="submit"
                type="primary"
                onClick={handleSubmit}
                loading={submitting}
              >
                Submit
              </Button>,
            ]
          : null
      }
      width={500}
      destroyOnClose
      centered={true}
      className="feedback-modal"
      wrapClassName="feedback-modal-wrapper"
      maskClosable={!submitting}
      closeIcon={<CloseCircleOutlined />}
    >
      {submitted ? (
        renderSuccessContent()
      ) : (
        <Form
          form={form}
          layout="vertical"
          initialValues={{ rating: 5 }}
          className="feedback-form"
        >
          <div className="rating-section">
            <Title level={4}>How would you rate your experience?</Title>
            <div className="emoji-display">
              {renderFeedbackEmoji(overallRating)}
            </div>
            <Form.Item
              name="rating"
              rules={[
                { required: true, message: 'Please rate your experience' },
              ]}
            >
              <Rate
                allowHalf
                character={<StarFilled />}
                onChange={handleRatingChange}
              />
            </Form.Item>
          </div>

          <Divider />

          <Form.Item
            name="feedback"
            label={<Text strong>Your Feedback</Text>}
            rules={[
              { required: true, message: 'Please provide your feedback' },
            ]}
          >
            <TextArea
              placeholder="Please share your thoughts about the application..."
              rows={3}
              maxLength={500}
              showCount
              className="feedback-textarea"
            />
          </Form.Item>
        </Form>
      )}
    </Modal>
  )
}

export default FeedbackModal
