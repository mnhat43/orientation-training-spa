import React from 'react'
import { Card, Typography, Form, Input, Button, Rate, Space } from 'antd'
import {
  TrophyOutlined,
  CheckCircleOutlined,
  CloseOutlined,
} from '@ant-design/icons'
import './AssessmentForm.scss'

const { Text } = Typography
const { TextArea } = Input

const AssessmentForm = ({ courseName, form, onSubmit, onCancel }) => {
  return (
    <Card
      className="assessment-form-card"
      title={
        <div className="assessment-header">
          <TrophyOutlined className="assessment-icon" />
          <span>Assess Course: {courseName}</span>
        </div>
      }
      extra={
        <Button
          type="text"
          icon={<CloseOutlined />}
          onClick={onCancel}
          aria-label="Close"
        />
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
        className="assessment-form"
      >
        <Form.Item
          name="rating"
          label={<Text strong>Performance Rating</Text>}
          rules={[{ required: true, message: 'Please rate the performance' }]}
        >
          <Rate allowHalf />
        </Form.Item>

        <Form.Item
          name="feedback"
          label={<Text strong>Feedback</Text>}
          rules={[{ required: true, message: 'Please provide feedback' }]}
        >
          <TextArea
            rows={3}
            placeholder="Provide your assessment feedback..."
            maxLength={500}
            showCount
          />
        </Form.Item>

        <Form.Item className="form-actions">
          <Space>
            <Button onClick={onCancel}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              icon={<CheckCircleOutlined />}
            >
              Submit Assessment
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  )
}

export default AssessmentForm
