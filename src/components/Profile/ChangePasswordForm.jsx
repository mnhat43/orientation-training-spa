import React, { useState, forwardRef, useImperativeHandle } from 'react'
import { Form, Input, Button, message, Typography } from 'antd'
import {
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from '@ant-design/icons'
import userApi from '@api/user'

const { Title } = Typography

const ChangePasswordForm = forwardRef((props, ref) => {
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
    const { currentPassword, newPassword, confirmPassword } = allValues
    const hasChanges = currentPassword || newPassword || confirmPassword
    setHasPasswordChanges(!!hasChanges)
  }

  const handleChangePassword = async (values) => {
    try {
      setLoading(true)
      const response = await userApi.changePassword({
        current_password: values.currentPassword,
        new_password: values.newPassword,
        confirm_password: values.confirmPassword,
      })

      if (response.status === 1) {
        message.success('Password changed successfully!')
        passwordForm.resetFields()
        setHasPasswordChanges(false)
      } else {
        passwordForm.setFields([
          {
            name: 'currentPassword',
            errors: ['Current password is incorrect'],
          },
        ])
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

  // Enhanced password validation
  const validatePassword = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('Password is required'))
    }
    if (value.length < 8) {
      return Promise.reject(new Error('Password must be at least 8 characters'))
    }
    if (!/[A-Z]/.test(value)) {
      return Promise.reject(
        new Error('Password must contain at least one uppercase letter'),
      )
    }
    if (!/[a-z]/.test(value)) {
      return Promise.reject(
        new Error('Password must contain at least one lowercase letter'),
      )
    }
    if (!/[0-9]/.test(value)) {
      return Promise.reject(
        new Error('Password must contain at least one number'),
      )
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      return Promise.reject(
        new Error('Password must contain at least one special character'),
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
          name="currentPassword"
          label="Current Password"
          rules={[
            {
              required: true,
              message: 'Please enter your current password',
            },
          ]}
          validateTrigger={['onChange', 'onBlur']}
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
          validateTrigger={['onChange', 'onBlur']}
          extra="Password must be at least 8 characters and include uppercase, lowercase, number, and special character"
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
          validateTrigger={['onChange', 'onBlur']}
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
})

export default ChangePasswordForm
