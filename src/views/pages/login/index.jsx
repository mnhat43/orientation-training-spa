import { useState } from 'react'
import { Form, Input, Button, Checkbox } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import './login.scss'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import auth from '@api/auth'
// import UserContext from '@context/UserContext';
import useAuth from '@hooks/useAuth'

function Login() {
  const navigate = useNavigate()

  const { setUserInfo } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData()
      formData.append('email', values.email)
      formData.append('password', values.password)

      const response = await auth.login(formData)
      console.log(response)
      if (response.status === 1) {
        setUserInfo(response.data.token)
        toast.success('Đăng nhập thành công')
        navigate('/courses')
      }
    } catch (error) {
      toast.error(
        'Đăng nhập thất bại! Vui lòng kiểm tra lại thông tin đăng nhập.',
      )
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
            initialValues={{ email, password, remember: true }}
            onFinish={handleSubmit}
          >
            <div className="login-container__sub__content__form__header">
              <h3 className="login-container__sub__content__form__header__title">
                Đăng nhập
              </h3>
              <hr />
            </div>

            <Form.Item
              label="Địa chỉ email"
              name="email"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập email!',
                },
              ]}
            >
              <Input
                value={email}
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Email"
              />
            </Form.Item>

            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
            >
              <Input.Password
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>

            <Form.Item>
              <div className="remember-forgot">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Lưu mật khẩu</Checkbox>
                </Form.Item>

                <div className="login-form-forgot" style={{ color: '#09C4AE' }}>
                  Quên mật khẩu?
                </div>
              </div>
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              style={{ background: '#209EA6', height: '38px' }}
            >
              Đăng nhập
            </Button>
          </Form>
          <div className="register">
            Chưa có tài khoản?
            <span className="register-link">Đăng ký tại đây</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
