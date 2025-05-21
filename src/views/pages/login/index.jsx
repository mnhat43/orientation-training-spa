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
import { toast } from 'react-toastify'
import useAuth from '@hooks/useAuth'

function LoginPage() {
  const navigate = useNavigate()
  const { handleLogin } = useAuth()

  const [isLoading, setIsLoading] = useState(false)

  const onFinish = async (values) => {
    setIsLoading(true)
    try {
      await handleLogin(values.email, values.password)
      navigate('/courses')
    } catch (error) {
      toast.error('Login failed! Please check your credentials.')
    } finally {
      setIsLoading(false)
    }
  }

  const goToHome = () => {
    navigate('/')
  }

  return (
    <div className="login-container">
      {/* Background elements */}
      <div className="particle"></div>
      <div className="particle"></div>
      <div className="particle"></div>
      <div className="particle"></div>
      <div className="bg-gradient"></div>

      <div className="login-card">
        <div className="login-logo">
          <CompassOutlined className="logo-icon" />
          <h1 className="logo-text">OrienHub</h1>
        </div>

        <div className="login-form-container">
          <h2 className="login-heading">Welcome Back</h2>
          <p className="login-subheading">Sign in to your OrienHub account</p>

          <Form
            layout="vertical"
            name="login"
            className="login-form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
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
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
                className="login-input"
                autoComplete="current-password"
              />
            </Form.Item>

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
