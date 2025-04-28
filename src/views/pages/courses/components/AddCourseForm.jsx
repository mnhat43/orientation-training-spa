import React from 'react'
import {
  Modal,
  Form,
  Input,
  Upload,
  Button,
  Select,
  Typography,
  Row,
  Col,
} from 'antd'
import { PlusOutlined, InfoCircleOutlined } from '@ant-design/icons'
import PropTypes from 'prop-types'
import './AddCourseForm.scss'

const { Option } = Select
const { Text, Title } = Typography
const { TextArea } = Input

const AddCourseForm = ({ isModalOpen, setIsModalOpen, handleAddCourse }) => {
  const [form] = Form.useForm()

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e
    }
    return e?.fileList
  }

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        handleAddCourse(values)
        form.resetFields()
      })
      .catch((info) => {
        console.log('Validate Failed:', info)
      })
  }

  return (
    <Modal
      title={
        <div className="add-course-modal-header">
          <Title level={4}>Create New Training Course</Title>
          <Text type="secondary">
            Add details for your new employee training course
          </Text>
        </div>
      }
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      onOk={handleSubmit}
      okText="Create Course"
      cancelText="Cancel"
      className="add-course-modal"
      destroyOnClose={true}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        name="course_form"
        requiredMark={false}
        className="course-form"
      >
        <Row gutter={16}>
          <Col span={14}>
            <Form.Item
              name="title"
              label="Title"
              rules={[{ required: true, message: 'Please enter a title' }]}
            >
              <Input placeholder="Enter course title" />
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item
              name="category"
              label="Category"
              rules={[{ required: true, message: 'Please select a category' }]}
              tooltip={{
                title: 'Categorize to help trainees find relevant content',
                icon: <InfoCircleOutlined />,
              }}
            >
              <Select placeholder="Select category">
                <Option value="Onboarding">Onboarding Essentials</Option>
                <Option value="Company">Company Policies</Option>
                <Option value="Technical">Technical Skills</Option>
                <Option value="Soft">Soft Skills</Option>
                <Option value="Compliance">Compliance</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={14}>
            <Form.Item
              name="description"
              label="Description"
              tooltip={{
                title: 'Helps trainees understand what they will learn',
                icon: <InfoCircleOutlined />,
              }}
            >
              <TextArea
                placeholder="Brief description (optional)"
                rows={5}
                showCount
                maxLength={500}
              />
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item
              name="thumbnail"
              label="Thumbnail"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              extra="Add an image to make your course visually appealing"
            >
              <Upload
                listType="picture-card"
                maxCount={1}
                beforeUpload={() => false}
                className="course-thumbnail-upload"
              >
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              </Upload>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

AddCourseForm.propTypes = {
  isModalOpen: PropTypes.bool.isRequired,
  setIsModalOpen: PropTypes.func.isRequired,
  handleAddCourse: PropTypes.func.isRequired,
}

export default AddCourseForm
