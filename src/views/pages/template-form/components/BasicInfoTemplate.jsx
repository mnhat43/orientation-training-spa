import React from 'react'
import { Form, Input, Card, Typography, Space, Row, Col } from 'antd'
import {
  FormOutlined,
  InfoCircleOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons'
import './BasicInfoTemplate.scss'

const { TextArea } = Input
const { Title, Text } = Typography

const BasicInfoTemplate = () => {
  return (
    <Card
      className="template-details-card"
      bordered={false}
      style={{ marginBottom: 24 }}
    >
      <div className="card-header">
        <Title level={4}>Basic Information</Title>
      </div>

      <div className="form-fields">
        <Row gutter={24}>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              name="name"
              label={
                <Space>
                  <FormOutlined />
                  <span>Template Name</span>
                  <QuestionCircleOutlined className="help-icon" />
                </Space>
              }
              tooltip="Choose a descriptive name that clearly identifies the purpose of this template"
              rules={[
                {
                  required: true,
                  message: 'Please enter a template name',
                },
                {
                  max: 100,
                  message: 'Name cannot exceed 100 characters',
                },
              ]}
            >
              <Input
                placeholder="Enter descriptive name (e.g. Frontend Developer Orientation)"
                className="template-name-input"
                size="large"
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={12}>
            <Form.Item
              name="description"
              label={
                <Space>
                  <InfoCircleOutlined />
                  <span>Description</span>
                  <Text type="secondary" className="optional-text">
                    (Optional)
                  </Text>
                  <QuestionCircleOutlined className="help-icon" />
                </Space>
              }
              tooltip="Explain what users will learn from this template and its key benefits"
              rules={[
                {
                  max: 500,
                  message: 'Description cannot exceed 500 characters',
                },
              ]}
            >
              <TextArea
                placeholder="Describe the purpose, goals, and target audience of this template..."
                rows={2}
                showCount
                maxLength={500}
              />
            </Form.Item>
          </Col>
        </Row>
      </div>
    </Card>
  )
}

export default BasicInfoTemplate
