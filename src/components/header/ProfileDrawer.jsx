import React, { useState, useEffect } from 'react'
import {
  Drawer,
  Form,
  Input,
  Button,
  Avatar,
  Upload,
  message,
  Divider,
  Typography,
  Row,
  Col,
} from 'antd'
import {
  UserOutlined,
  LockOutlined,
  SaveOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from '@ant-design/icons'
import userApi from '@api/user'
import { convertFileToBase64 } from '@helpers/common'
import './ProfileDrawer.scss'

const { Title, Text } = Typography

const ProfileDrawer = ({ visible, onClose, currentUser, onUpdateUser }) => {
  const [form] = Form.useForm()
  const [passwordForm] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [avatarLoading, setAvatarLoading] = useState(false)
  const [hasProfileChanges, setHasProfileChanges] = useState(false)
  const [hasPasswordChanges, setHasPasswordChanges] = useState(false)
  const [tempAvatar, setTempAvatar] = useState(null)

  useEffect(() => {
    if (visible && currentUser) {
      const initialValues = {
        first_name: currentUser.first_name || '',
        last_name: currentUser.last_name || '',
        email: currentUser.email || '',
        phone_number: currentUser.phone_number || '',
        birthday: currentUser.birthday
          ? currentUser.birthday.split('T')[0]
          : '',
      }
      form.setFieldsValue(initialValues)
      setHasProfileChanges(false)
      setTempAvatar(null)
    }
  }, [visible, currentUser, form])
  const handleProfileValuesChange = (changedValues, allValues) => {
    if (currentUser) {
      const original = {
        first_name: currentUser.first_name || '',
        last_name: currentUser.last_name || '',
        email: currentUser.email || '',
        phone_number: currentUser.phone_number || '',
        birthday: currentUser.birthday
          ? currentUser.birthday.split('T')[0]
          : '',
      }

      const hasChanges =
        Object.keys(allValues).some(
          (key) => allValues[key] !== original[key],
        ) || tempAvatar !== null
      setHasProfileChanges(hasChanges)
    }
  }

  const handlePasswordValuesChange = (changedValues, allValues) => {
    const { oldPassword, newPassword, confirmPassword } = allValues
    const hasChanges = oldPassword || newPassword || confirmPassword
    setHasPasswordChanges(!!hasChanges)
  }
  const handleUpdateProfile = async (values) => {
    try {
      setLoading(true)

      const updateData = { ...values }
      if (tempAvatar) {
        updateData.avatar = tempAvatar
      }

      const response = await userApi.updateUserInfo(currentUser.id, updateData)

      if (response.status === 1) {
        message.success('Profile updated successfully!')
        if (onUpdateUser) {
          onUpdateUser({ ...currentUser, ...updateData })
        }
        setHasProfileChanges(false)
        setTempAvatar(null)
      } else {
        message.error(response.message || 'Failed to update profile')
      }
    } catch (error) {
      console.error('Profile update error:', error)
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to update profile'
      message.error('Error updating profile: ' + errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async (values) => {
    try {
      setLoading(true)
      const response = await userApi.changePassword({
        user_id: currentUser.id,
        old_password: values.oldPassword,
        new_password: values.newPassword,
      })

      if (response.status === 1) {
        message.success('Password changed successfully!')
        passwordForm.resetFields()
        setHasPasswordChanges(false)
        handleTabChange('profile')
      } else {
        const errorMessage =
          response.message ||
          'Failed to change password. Please check your current password.'
        message.error(errorMessage)
      }
    } catch (error) {
      console.error('Password change error:', error)
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to change password'
      message.error('Error changing password: ' + errorMessage)
    } finally {
      setLoading(false)
    }
  }
  const handleAvatarUpload = async (file) => {
    try {
      setAvatarLoading(true)
      const base64String = await convertFileToBase64(file)

      setTempAvatar(base64String)
      setHasProfileChanges(true)

      message.success(
        'Avatar selected! Click "Update Profile" to save changes.',
      )
    } catch (error) {
      message.error(
        'Error processing avatar: ' + (error.message || 'Unknown error'),
      )
    } finally {
      setAvatarLoading(false)
    }

    return false
  }

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!')
      return false
    }
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!')
      return false
    }
    return true
  }
  const validatePassword = (_, value) => {
    if (!value || value.length < 6) {
      return Promise.reject(new Error('Password must be at least 6 characters'))
    }
    return Promise.resolve()
  }

  const handleDrawerClose = () => {
    form.resetFields()
    passwordForm.resetFields()
    setHasProfileChanges(false)
    setHasPasswordChanges(false)
    setTempAvatar(null)
    onClose()
  }

  return (
    <Drawer
      placement="right"
      width={600}
      open={visible}
      onClose={handleDrawerClose}
      className="profile-drawer"
      destroyOnClose
      title={<Title level={4}>Profile Settings</Title>}
    >
      <div className="profile-drawer-content">
        {/* Profile Information Section */}
        <div className="profile-section">
          <Title level={5}>
            <UserOutlined /> Profile Information
          </Title>

          <Row gutter={24}>
            {/* Left Column - Avatar and Department */}
            <Col span={8}>
              <div style={{ textAlign: 'center' }}>
                <Upload
                  name="avatar"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  beforeUpload={beforeUpload}
                  customRequest={({ file }) => handleAvatarUpload(file)}
                  style={{ marginBottom: '16px' }}
                >
                  {' '}
                  <div style={{ position: 'relative' }}>
                    <Avatar
                      size={80}
                      src={tempAvatar || currentUser?.avatar}
                      icon={
                        !(tempAvatar || currentUser?.avatar) && <UserOutlined />
                      }
                      className="profile-avatar"
                    />
                  </div>
                </Upload>

                <div style={{ marginTop: '16px' }}>
                  <Text
                    strong
                    style={{ display: 'block', marginBottom: '4px' }}
                  >
                    Department
                  </Text>
                  <Text type="secondary">
                    {currentUser?.department || 'Not specified'}
                  </Text>
                </div>
              </div>
            </Col>

            {/* Right Column - Form Fields */}
            <Col span={16}>
              <Form
                form={form}
                layout="vertical"
                onFinish={handleUpdateProfile}
                onValuesChange={handleProfileValuesChange}
                className="profile-form"
              >
                {/* Row 1: First Name, Last Name */}
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="first_name"
                      label="First Name"
                      rules={[
                        {
                          required: true,
                          message: 'Please enter your first name',
                        },
                      ]}
                    >
                      <Input
                        placeholder="Enter your first name"
                        prefix={<UserOutlined />}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="last_name"
                      label="Last Name"
                      rules={[
                        {
                          required: true,
                          message: 'Please enter your last name',
                        },
                      ]}
                    >
                      <Input
                        placeholder="Enter your last name"
                        prefix={<UserOutlined />}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                {/* Row 2: Email Address */}
                <Form.Item
                  name="email"
                  label="Email Address"
                  rules={[
                    { required: true, message: 'Please enter your email' },
                    {
                      type: 'email',
                      message: 'Please enter a valid email',
                    },
                  ]}
                >
                  <Input
                    placeholder="Enter your email"
                    disabled
                    style={{ backgroundColor: '#f5f5f5' }}
                  />
                </Form.Item>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="phone_number"
                      label="Phone Number"
                      rules={[
                        {
                          pattern: /^[+]?[\d\s\-\(\)]+$/,
                          message: 'Please enter a valid phone number',
                        },
                      ]}
                    >
                      <Input
                        placeholder="Enter your phone number"
                        maxLength={20}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="birthday" label="Birthday">
                      <Input
                        type="date"
                        max={new Date().toISOString().split('T')[0]}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item style={{ marginTop: '24px', marginBottom: 0 }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    disabled={!hasProfileChanges}
                    icon={<SaveOutlined />}
                    size="large"
                    block
                  >
                    Update Profile
                  </Button>
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </div>

        <Divider />

        {/* Change Password Section */}
        <div className="password-section">
          <Title level={5}>
            <LockOutlined /> Change Password
          </Title>

          <Form
            form={passwordForm}
            layout="vertical"
            onFinish={handleChangePassword}
            onValuesChange={handlePasswordValuesChange}
            className="password-form"
          >
            <Form.Item
              name="oldPassword"
              label="Current Password"
              rules={[
                {
                  required: true,
                  message: 'Please enter your current password',
                },
              ]}
            >
              <Input.Password
                placeholder="Enter current password"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="newPassword"
              label="New Password"
              rules={[
                {
                  required: true,
                  message: 'Please enter new password',
                },
                { validator: validatePassword },
              ]}
            >
              <Input.Password
                placeholder="Enter new password"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Confirm New Password"
              dependencies={['newPassword']}
              rules={[
                {
                  required: true,
                  message: 'Please confirm your new password',
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve()
                    }
                    return Promise.reject(new Error('Passwords do not match!'))
                  },
                }),
              ]}
            >
              <Input.Password
                placeholder="Confirm new password"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
                size="large"
              />
            </Form.Item>

            <Form.Item style={{ marginTop: '32px', marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                disabled={!hasPasswordChanges}
                icon={<LockOutlined />}
                size="large"
                block
              >
                Change Password
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </Drawer>
  )
}

export default ProfileDrawer
