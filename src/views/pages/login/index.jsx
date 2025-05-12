import { useState } from 'react'
import { Form, Input, Button, Checkbox } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
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

  return (
    <div className="login-container">
      <div className="login-container__sub">
        <div className="login-container__sub__logo">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/0a7ec8b021aa8f242c74c6fefb029d66b5c28ea7be26ba07593ea659c8fd3147?apiKey=10b1e221f97543f5b056ca1fc29636cb&"
            alt="eTracking logo"
          />
          <div className="textLogo">Orientation</div>
          <div className="textLogo2">Training</div>
        </div>

        <div className="login-container__sub__content">
          <Form
            layout="vertical"
            name="login"
            className="login-container__sub__content__form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <div className="login-container__sub__content__form__header">
              <h3 className="login-container__sub__content__form__header__title">
                Login
              </h3>
              <hr />
            </div>

            <Form.Item
              label="Email Address"
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
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Email"
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: 'Please enter your password!' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="Password"
              />
            </Form.Item>

            <Form.Item>
              <div className="remember-forgot">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Remember me</Checkbox>
                </Form.Item>

                <div className="login-form-forgot" style={{ color: '#09C4AE' }}>
                  Forgot password?
                </div>
              </div>
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              style={{ background: '#209EA6', height: '38px' }}
              loading={isLoading}
            >
              Login
            </Button>
          </Form>
          <div className="register">
            Don't have an account?
            <span className="register-link">Register here</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
