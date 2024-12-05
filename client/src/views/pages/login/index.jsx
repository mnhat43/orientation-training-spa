import { Form, Input, Button, Checkbox } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import './login.scss'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'

function Login() {
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      navigate('/dashboard');
      window.location.reload();
    } catch (error) {
      toast.error('Đăng nhập thất bại')
    }
  }

  const handleToRegister = () => {
    navigate('/register');
  }
  const handleToForgotPassword = () => {
    navigate('/forgot-password');
  }


  return (
    <div className="login-container" >
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
            initialValues={{
              remember: true
            }}
            onFinish={handleSubmit}
          >
            <div className='login-container__sub__content__form__header'>
              <h3 className='login-container__sub__content__form__header__title'>
                Đăng nhập
              </h3>
              <hr />

            </div>

            <Form.Item
              label="Tên đăng nhập"
              className="form-item"
              name="username"
              rules={[
                {
                  required: true,
                  message: 'Please input your Username!'
                }
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Username"
                style={{ background: "#F6F8FE" }}
              />
            </Form.Item>

            <Form.Item
              label="Mật khẩu"
              className="form-item"
              name="password"
              rules={[
                {
                  required: true,
                  message: 'Please input your Password!'
                }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
                className='input-password'
                style={{ background: "#F6F8FE" }}
              />
            </Form.Item>

            <Form.Item>
              <div className='remember-forgot'>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Lưu mật khẩu</Checkbox>
                </Form.Item>

                <div className="login-form-forgot" onClick={() => handleToForgotPassword()} style={{ color: "#09C4AE" }}>
                  Quên mật khẩu?
                </div>
              </div>
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              onClick={() => handleSubmit()}
              style={{ background: "#209EA6", height: "38px" }}
            >
              Đăng nhập
            </Button>
          </Form>
          <div className="register">
            Chưa có tài khoản?
            <span className='register-link' onClick={() => handleToRegister()}>Đăng ký tại đây</span>
          </div>
        </div>
      </div>
    </div >
  )
}

export default Login
