import React, { useState, forwardRef, useImperativeHandle } from 'react'
import { Form, Input, Button, message, Typography } from 'antd'
import {
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from '@ant-design/icons'
import userApi from '@api/user'

const { Title } = Typography

const ChangePasswordForm = forwardRef(
  ({ currentUser, onPasswordChanged }, ref) => {
    const [passwordForm] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const [hasPasswordChanges, setHasPasswordChanges] = useState(false)

    useImperativeHandle(ref, () => ({
      resetForm: () => {
        passwordForm.resetFields()
        setHasPasswordChanges(false)
      },
    }))

    const handlePasswordValuesChange = (changedValues, allValues) => {
      const { oldPassword, newPassword, confirmPassword } = allValues
      const hasChanges = oldPassword || newPassword || confirmPassword
      setHasPasswordChanges(!!hasChanges)
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
          if (onPasswordChanged) {
            onPasswordChanged()
          }
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

    const validatePassword = (_, value) => {
      if (!value || value.length < 6) {
        return Promise.reject(
          new Error('Password must be at least 6 characters'),
        )
      }
      return Promise.resolve()
    }

    return (
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
          </Form.Item>{' '}
        </Form>
      </div>
    )
  },
)

export default ChangePasswordForm
