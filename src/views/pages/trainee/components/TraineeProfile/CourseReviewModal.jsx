import React from 'react'
import { Modal, Form, Input, Rate, Button, Alert } from 'antd'

const { TextArea } = Input

const CourseReviewModal = ({
  visible,
  onCancel,
  onSubmit,
  courseTitle,
  form,
  isEditing = false,
}) => {
  const modalTitle = isEditing
    ? `Edit Review for Course: ${courseTitle}`
    : `Add Review for Course: ${courseTitle}`

  return (
    <Modal
      title={modalTitle}
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      <Alert
        message="You can only submit one review per course. You may edit your review at any time."
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
      />

      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item
          name="rating"
          label="Rating"
          rules={[
            {
              required: true,
              message: 'Please rate the course',
            },
          ]}
        >
          <Rate allowHalf />
        </Form.Item>

        <Form.Item
          name="comment"
          label="Your Review"
          rules={[{ required: true, message: 'Please provide your review' }]}
        >
          <TextArea
            rows={4}
            placeholder="Share your thoughts about this course"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            {isEditing ? 'Update Review' : 'Submit Review'}
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={onCancel}>
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default CourseReviewModal
