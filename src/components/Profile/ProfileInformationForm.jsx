import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react'
import {
  Form,
  Input,
  Button,
  Avatar,
  Upload,
  message,
  Typography,
  Row,
  Col,
} from 'antd'
import { UserOutlined, SaveOutlined } from '@ant-design/icons'
import userApi from '@api/user'
import { convertFileToBase64 } from '@helpers/common'

const { Title, Text } = Typography

const ProfileInformationForm = forwardRef(
  ({ currentUser, onUpdateUser }, ref) => {
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const [avatarLoading, setAvatarLoading] = useState(false)
    const [hasProfileChanges, setHasProfileChanges] = useState(false)
    const [tempAvatar, setTempAvatar] = useState(null)

    useImperativeHandle(ref, () => ({
      resetForm: () => {
        form.resetFields()
        setHasProfileChanges(false)
        setTempAvatar(null)
      },
    }))

    useEffect(() => {
      if (currentUser) {
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
    }, [currentUser, form])

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

    const handleUpdateProfile = async (values) => {
      try {
        setLoading(true)

        const updateData = { ...values }

        if (tempAvatar) {
          updateData.avatar = tempAvatar
        }

        const response = await userApi.updateProfile(updateData)

        if (response.status === 1) {
          message.success('Profile updated successfully!')
          if (onUpdateUser) {
            onUpdateUser({ ...currentUser, ...response.data })
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

    const handleAvatarUpload = async (file) => {
      try {
        setAvatarLoading(true)
        const base64String = await convertFileToBase64(file)

        setTempAvatar(base64String)
        setHasProfileChanges(true)
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

    return (
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
                <div style={{ position: 'relative' }}>
                  <Avatar
                    size={100}
                    src={tempAvatar || currentUser?.avatar}
                    icon={
                      !(tempAvatar || currentUser?.avatar) && <UserOutlined />
                    }
                    className="profile-avatar"
                  />
                </div>
              </Upload>

              <div style={{ marginTop: '16px' }}>
                <Text strong style={{ display: 'block', marginBottom: '4px' }}>
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

              <Form.Item label="Email Address">
                <Input
                  value={currentUser?.email}
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
            </Form>{' '}
          </Col>
        </Row>
      </div>
    )
  },
)

export default ProfileInformationForm
