import React, { useState, useEffect } from 'react'
import {
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  Typography,
  Space,
  Drawer,
  message,
  Row,
  Col,
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
  CopyOutlined,
} from '@ant-design/icons'
import { DEPARTMENT_NAMES } from '@constants'
import { generateRandomPassword } from '@helpers/common'
import moment from 'moment'
import './AddEmployeeForm.scss'

const { Title } = Typography
const { Option } = Select

const AddEmployeeForm = ({ visible, onCancel, onSubmit, loading = false }) => {
  const [form] = Form.useForm()
  const [password, setPassword] = useState(generateRandomPassword())
  const [avatar, setAvatar] = useState(null)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)

  useEffect(() => {
    if (visible) {
      const initialPassword = generateRandomPassword()
      setPassword(initialPassword)
      form.setFieldsValue({ password: initialPassword })
    }
  }, [visible, form])

  const handleRegeneratePassword = () => {
    const newPassword = generateRandomPassword()
    setPassword(newPassword)
    form.setFieldsValue({ password: newPassword })
  }
  const handleCopyPassword = () => {
    try {
      navigator.clipboard.writeText(password)
    } catch (error) {
      const textArea = document.createElement('textarea')
      textArea.value = password
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
    }
  }

  const handleSubmit = (values) => {
    const employeeData = {
      ...values,
      birthday: values.birthday
        ? moment(values.birthday).format('YYYY-MM-DD')
        : null,
      company_joined_date: values.company_joined_date
        ? moment(values.company_joined_date).format('YYYY-MM-DD')
        : moment().format('YYYY-MM-DD'),
      avatar: avatar || null,
    }

    onSubmit(employeeData)
    resetForm()
  }

  const resetForm = () => {
    form.resetFields()
    const newPassword = generateRandomPassword()
    setPassword(newPassword)
    form.setFieldsValue({ password: newPassword })
    setAvatar(null)
  }

  return (
    <Drawer
      title={<Title level={4}>Add New Employee</Title>}
      open={visible}
      onClose={loading ? undefined : onCancel}
      width={720}
      className={`add-employee-drawer ${loading ? 'is-loading' : ''}`}
      destroyOnClose={true}
      maskClosable={!loading}
      footer={
        <div style={{ textAlign: 'right' }}>
          <Space>
            <Button onClick={onCancel} disabled={loading}>
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={() => form.submit()}
              loading={loading}
            >
              {loading ? 'Creating...' : 'Create Employee'}
            </Button>
          </Space>
        </div>
      }
    >
      {' '}
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          password,
          gender: 1,
          company_joined_date: moment(),
        }}
        className="employee-form"
        disabled={loading}
      >
        <Row gutter={24}>
          {/* Left Column - Avatar */}
          <Col span={8}>
            <div className="profile-picture-container">
              <div
                className={`avatar-container ${avatar ? 'has-avatar' : ''} ${isUploadingAvatar ? 'uploading' : ''}`}
                onClick={() => {
                  if (!loading && !isUploadingAvatar) {
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
                    <UserOutlined
                      className={
                        isUploadingAvatar
                          ? 'avatar-icon loading'
                          : 'avatar-icon'
                      }
                    />
                  </div>
                )}
                {isUploadingAvatar && (
                  <div className="avatar-loading-overlay">
                    <div>Uploading...</div>
                  </div>
                )}
              </div>

              <input
                type="file"
                id="avatar-upload-input"
                accept="image/*"
                disabled={loading || isUploadingAvatar}
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    if (!file.type.match('image.*')) {
                      message.error('Please upload an image file')
                      return
                    }

                    setIsUploadingAvatar(true)
                    const reader = new FileReader()
                    reader.onload = (event) => {
                      if (event.target?.result) {
                        setAvatar(event.target.result)
                      }
                      setIsUploadingAvatar(false)
                    }
                    reader.onerror = () => {
                      message.error('Failed to read image file')
                      setIsUploadingAvatar(false)
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
                      disabled={loading}
                    >
                      Upload
                    </Button>
                  ) : (
                    <Button
                      size="small"
                      danger
                      className="remove-btn"
                      onClick={() => setAvatar(null)}
                      disabled={loading}
                    >
                      Remove
                    </Button>
                  )}
                </Space>
              </div>
            </div>
          </Col>

          {/* Right Column - Form Fields */}
          <Col span={16}>
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

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: 'Please enter email' },
                    { type: 'email', message: 'Please enter a valid email' },
                  ]}
                >
                  <Input prefix={<MailOutlined />} placeholder="Email" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="department"
                  label="Department"
                  rules={[
                    { required: true, message: 'Please select department' },
                  ]}
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
          </Col>
        </Row>

        {/* Full Width Form Fields */}
        <Row gutter={16} className="mt-4">
          <Col span={8}>
            <Form.Item
              name="gender"
              label="Gender"
              rules={[{ required: true, message: 'Please select gender' }]}
            >
              <Radio.Group className="gender-radio-group">
                <Radio value={1}>
                  <Space>
                    <ManOutlined />
                    Male
                  </Space>
                </Radio>
                <Radio value={2}>
                  <Space>
                    <WomanOutlined />
                    Female
                  </Space>
                </Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="company_joined_date"
              label="Joined Date"
              rules={[{ required: true, message: 'Please select joined date' }]}
            >
              <DatePicker
                style={{ width: '100%' }}
                format="YYYY-MM-DD"
                placeholder="Select Joined Date"
                suffixIcon={<CalendarOutlined />}
              />
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
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="phone_number" label="Phone Number">
              <Input prefix={<PhoneOutlined />} placeholder="Phone Number" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: 'Password is required' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                value={password}
                readOnly
                addonAfter={
                  <Space>
                    {' '}
                    <Button
                      type="text"
                      icon={<ReloadOutlined />}
                      onClick={handleRegeneratePassword}
                      style={{ border: 'none' }}
                      title="Generate new password"
                      disabled={loading}
                    />
                    <Button
                      type="text"
                      icon={<CopyOutlined />}
                      onClick={handleCopyPassword}
                      style={{ border: 'none' }}
                      title="Copy password"
                      className="copy-password-btn"
                      disabled={loading}
                    />
                  </Space>
                }
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="role_id" hidden initialValue={3}>
          <Input />
        </Form.Item>
      </Form>
    </Drawer>
  )
}

export default AddEmployeeForm
