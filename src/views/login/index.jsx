import { useState } from 'react'
import { Form, Input, Button } from 'antd'
import {
  UserOutlined,
  LockOutlined,
  ArrowLeftOutlined,
  CompassOutlined,
} from '@ant-design/icons'
import './login.scss'
import { useNavigate } from 'react-router-dom'
import useAuth from '@hooks/useAuth'

function LoginPage() {
  const navigate = useNavigate()
  const { handleLogin } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [form] = Form.useForm() // Handle form submission and login
  const onFinish = async (values) => {
    setIsLoading(true)
    setErrorMessage('')

    try {
      // Instead of await and then navigate, use the return value
      const loginSuccess = await handleLogin(values.email, values.password)

      // Only navigate if login was successful
      if (loginSuccess) {
        navigate('/dashboard')
      } else {
        // Show error if login failed
        setErrorMessage(
          'Your email or password is incorrect. Please try again.',
        )
      }
    } catch (error) {
      // Handle API errors with more descriptive message
      if (error.response && error.response.status === 429) {
        setErrorMessage(
          'Too many failed login attempts. Please try again later.',
        )
      } else if (error.response && error.response.status === 403) {
        setErrorMessage(
          'Your account has been locked. Please contact administrator.',
        )
      } else {
        setErrorMessage(
          'Unable to sign in. Please check your credentials and try again.',
        )
      }
    } finally {
      setIsLoading(false)
    }
  }
  const goToHome = () => {
    navigate('/')
  }
  // Clear error message when user starts typing with a slight delay
  const handleValuesChange = () => {
    // Keep the error message visible briefly so user can read it
    // Then clear it when they start entering new credentials
    if (errorMessage) {
      setTimeout(() => {
        setErrorMessage('')
      }, 300)
    }
  }

  return (
    <div className="login-container">
      <div className="particle"></div>
      <div className="particle"></div>
      <div className="particle"></div>
      <div className="particle"></div>
      <div className="bg-gradient"></div>

      <div className="login-card">
        <div className="login-logo">
          <CompassOutlined className="logo-icon" />
          <h1 className="logo-text">OrientHub</h1>
        </div>

        <div className="login-form-container">
          <h2 className="login-heading">Welcome Back</h2>
          <p className="login-subheading">
            Sign in to your OrientHub account
          </p>{' '}
          <Form
            form={form}
            layout="vertical"
            name="login"
            className="login-form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onValuesChange={handleValuesChange}
          >
            {' '}
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: 'Please enter your email!',
                },
                {
                  type: 'email',
                  message: 'Invalid email format!',
                },
              ]}
              className={errorMessage ? 'has-login-error' : ''}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Email Address"
                className="login-input"
                autoComplete="current-email"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Please enter your password!' },
              ]}
              className={errorMessage ? 'has-login-error' : ''}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
                className="login-input"
                autoComplete="current-password"
              />
            </Form.Item>{' '}
            {/* Error message with improved design */}
            <div
              className={`login-error-alert ${errorMessage ? 'visible' : ''}`}
            >
              {errorMessage && (
                <>
                  <div className="error-icon">
                    <svg
                      viewBox="64 64 896 896"
                      data-icon="exclamation-circle"
                      width="1em"
                      height="1em"
                      fill="currentColor"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm-32 232c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V296zm32 440a48.01 48.01 0 010-96 48.01 48.01 0 010 96z"></path>
                    </svg>
                  </div>
                  <span className="error-text">{errorMessage}</span>
                </>
              )}
            </div>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-button"
                loading={isLoading}
              >
                Sign In
              </Button>
            </Form.Item>
            <Button
              type="link"
              className="home-button"
              onClick={goToHome}
              icon={<ArrowLeftOutlined />}
            >
              Return to Home
            </Button>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
