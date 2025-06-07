import React from 'react'
import { Form, Input, Button, Typography, Alert } from 'antd'
import { LinkOutlined, InfoCircleOutlined } from '@ant-design/icons'

const VideoForm = ({ form, onSubmit }) => {
  const handleSubmit = (values) => {
    onSubmit({
      ...values,
    })
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      className="form-content"
    >
      <div className="form-content__compact-section">
        <div className="form-content__section-header">
          <div className="form-content__section-icon">
            <InfoCircleOutlined />
          </div>
          <div className="form-content__section-title">Video Information</div>
        </div>

        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: 'Please enter a title' }]}
          className="form-content__form-item"
        >
          <Input placeholder="Enter title" className="form-content__input" />
        </Form.Item>
      </div>

      <div className="form-content__compact-section">
        <div className="form-content__section-header">
          <div className="form-content__section-icon">
            <LinkOutlined />
          </div>
          <div className="form-content__section-title">Video Source</div>
        </div>

        <Alert
          message="Supported: YouTube, Vimeo, and other streaming services"
          type="info"
          showIcon
          className="form-content__alert"
        />

        <Form.Item
          name="resource"
          label="Video URL"
          rules={[
            { required: true, message: 'Please enter video URL' },
            { type: 'url', message: 'Please enter a valid URL' },
          ]}
          className="form-content__form-item"
        >
          <Input
            prefix={<LinkOutlined />}
            placeholder="Enter video URL (YouTube, Vimeo, etc.)"
            className="form-content__input"
          />
        </Form.Item>
      </div>

      <Form.Item className="form-content__submit">
        <Button type="primary" htmlType="submit" block>
          Add Video
        </Button>
      </Form.Item>
    </Form>
  )
}
export default VideoForm
