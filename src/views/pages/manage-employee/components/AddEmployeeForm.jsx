import React, { useState } from 'react'
import {
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  Typography,
  Space,
  Modal,
  message,
  Row,
  Col,
  Tooltip,
  Radio,
} from 'antd'
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
  TeamOutlined,
  LockOutlined,
  ReloadOutlined,
  UploadOutlined,
  ManOutlined,
  WomanOutlined,
} from '@ant-design/icons'
import { DEPARTMENT_NAMES } from '@constants'
import { generateRandomPassword } from '@helpers/common'

const { Title, Text } = Typography
const { Option } = Select

const AddEmployeeForm = ({ visible, onCancel, onSubmit }) => {
  const [form] = Form.useForm()
  const [password, setPassword] = useState(generateRandomPassword())
  const [avatar, setAvatar] = useState(null)

  const getRandomAvatarUrl = () => {
    const gender = Math.random() < 0.5 ? 'men' : 'women'
    const id = Math.floor(Math.random() * 100)
    return `https://randomuser.me/api/portraits/${gender}/${id}.jpg`
  }

  const handleRegeneratePassword = () => {
    const newPassword = generateRandomPassword()
    setPassword(newPassword)
    form.setFieldsValue({ password: newPassword })
  }

  const handleSubmit = (values) => {
    const employeeData = {
      ...values,
      birthday: values.birthday ? values.birthday.toISOString() : null,
      avatar: avatar || getRandomAvatarUrl(),
    }

    onSubmit(employeeData)
    resetForm()
  }

  const resetForm = () => {
    form.resetFields()
    setPassword(generateRandomPassword())
    setAvatar(null)
  }

  return (
    <Modal
      title={<Title level={4}>Add New Employee</Title>}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={1500}
      centered
      className="add-employee-modal-centered"
      style={{ pointerEvents: 'auto' }}
      forceRender
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          password,
          role_id: 3,
          role_name: 'Employee',
          gender: 1,
        }}
      >
        <Row gutter={16}>
          <Col span={6}>
            <div className="profile-picture-container">
              <div
                className={`avatar-container ${avatar ? 'has-avatar' : ''}`}
                onClick={() => {
                  if (avatar) {
                    document.getElementById('avatar-upload-input').click()
                  }
                }}
              >
                {avatar ? (
                  <img
                    src={avatar}
                    alt="Employee Avatar"
                    className="avatar-image"
                  />
                ) : (
                  <div className="avatar-placeholder">
                    <UserOutlined className="avatar-icon" />
                  </div>
                )}
              </div>

              <input
                type="file"
                id="avatar-upload-input"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    if (!file.type.match('image.*')) {
                      message.error('Please upload an image file')
                      return
                    }

                    const reader = new FileReader()
                    reader.onload = (event) => {
                      if (event.target?.result) {
                        setAvatar(event.target.result)
                      }
                    }
                    reader.onerror = () => {
                      message.error('Failed to read image file')
                    }
                    reader.readAsDataURL(file)
                  }
                }}
              />

              <div className="profile-picture-actions">
                <Space align="center" className="button-group">
                  {!avatar ? (
                    <Button
                      size="small"
                      className="upload-btn"
                      icon={<UploadOutlined />}
                      onClick={() =>
                        document.getElementById('avatar-upload-input').click()
                      }
                    >
                      Upload
                    </Button>
                  ) : (
                    <Button
                      size="small"
                      danger
                      className="remove-btn"
                      onClick={() => setAvatar(null)}
                    >
                      Remove
                    </Button>
                  )}
                </Space>
              </div>
            </div>

            <style jsx>{`
              .profile-picture-container {
                display: flex;
                flex-direction: column;
                align-items: center;
              }
              .avatar-container {
                position: relative;
                width: 90px;
                height: 90px;
                border-radius: 50%;
                overflow: hidden;
                background-color: #f5f5f5;
                cursor: pointer;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                transition: all 0.3s ease;
                margin-bottom: 12px;
              }

              .avatar-container:hover {
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
              }

              .avatar-image {
                width: 100%;
                height: 100%;
                object-fit: cover;
              }

              .avatar-placeholder {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 100%;
                height: 100%;
                background-color: #e6f7ff;
              }
              .avatar-icon {
                font-size: 36px;
                color: #1890ff;
              }
              .avatar-overlay {
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                height: 30px;
                display: flex;
                justify-content: center;
                align-items: center;
                background: rgba(0, 0, 0, 0.5);
                color: white;
                opacity: 0;
                transition: opacity 0.3s;
              }

              .avatar-container:hover .avatar-overlay {
                opacity: 1;
              }

              .avatar-edit-icon {
                font-size: 20px;
              }

              .profile-picture-actions {
                width: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 8px;
              }
              .upload-text {
                margin-bottom: 4px;
                font-size: 12px;
              }

              .button-group {
                display: flex;
                justify-content: center;
                width: 100%;
              }

              .upload-btn,
              .remove-btn {
                min-width: 80px;
                font-size: 12px;
              }
            `}</style>
          </Col>

          <Col span={18}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="first_name"
                  label="First Name"
                  rules={[
                    { required: true, message: 'Please enter first name' },
                  ]}
                >
                  <Input prefix={<UserOutlined />} placeholder="First Name" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="last_name"
                  label="Last Name"
                  rules={[
                    { required: true, message: 'Please enter last name' },
                  ]}
                >
                  <Input prefix={<UserOutlined />} placeholder="Last Name" />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              name="personnal_email"
              label="Email"
              rules={[
                { required: true, message: 'Please enter email' },
                { type: 'email', message: 'Please enter a valid email' },
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="Email" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="gender"
              label="Gender"
              rules={[{ required: true, message: 'Please select gender' }]}
            >
              <Radio.Group buttonStyle="solid" defaultValue={1}>
                <Radio.Button value={1}>
                  <Space>
                    <ManOutlined />
                    Male
                  </Space>
                </Radio.Button>
                <Radio.Button value={2}>
                  <Space>
                    <WomanOutlined />
                    Female
                  </Space>
                </Radio.Button>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="department"
              label="Department"
              rules={[{ required: true, message: 'Please select department' }]}
            >
              <Select
                placeholder="Select Department"
                suffixIcon={<TeamOutlined />}
              >
                {DEPARTMENT_NAMES.map((dept) => (
                  <Option key={dept} value={dept}>
                    {dept}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="phone_number" label="Phone Number">
              <Input prefix={<PhoneOutlined />} placeholder="Phone Number" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="birthday" label="Birthday">
              <DatePicker
                style={{ width: '100%' }}
                format="YYYY-MM-DD"
                placeholder="Select Birthday"
                suffixIcon={<CalendarOutlined />}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="password"
              label={
                <Space>
                  <Text>Password</Text>
                  <Tooltip title="This password will be provided to the employee"></Tooltip>
                </Space>
              }
            >
              <Input.Password
                prefix={<LockOutlined />}
                value={password}
                readOnly
                addonAfter={
                  <Tooltip title="Generate a new password">
                    <Button
                      type="text"
                      icon={<ReloadOutlined />}
                      onClick={handleRegeneratePassword}
                      style={{ border: 'none' }}
                    />
                  </Tooltip>
                }
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="role_id" hidden initialValue={3}>
          <Input />
        </Form.Item>

        <div style={{ textAlign: 'right', marginTop: 24 }}>
          <Space>
            <Button onClick={onCancel}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              Create Employee
            </Button>
          </Space>
        </div>
      </Form>
    </Modal>
  )
}

export default AddEmployeeForm
