import {
  Button,
  Checkbox,
  Form,
  Input,
  Row,
  Col,
  Select
} from 'antd'
import './register.scss'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
const { Option } = Select
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons'

function Register() {
  const navigate = useNavigate()
  const [form] = Form.useForm()

  // const { setToken } = useAuth()
  const handleSubmit = async () => {
    try {
      // Add your form submission logic here
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }

  const handleToLogin = () => {
    navigate('/login')
  }

  return (
    <div className='register-container'>
      <div className='register-container__sub'>
        <div className='register-container__sub__logo'>
          <img
            loading='lazy'
            src='https://cdn.builder.io/api/v1/image/assets/TEMP/0a7ec8b021aa8f242c74c6fefb029d66b5c28ea7be26ba07593ea659c8fd3147?apiKey=10b1e221f97543f5b056ca1fc29636cb&'
            alt='orientation training'
          />
          <div className='textLogo'>Orientation</div>
          <div className='textLogo2'>Training</div>
        </div>
        <div className='register-container__sub__content'>
          <div className='register-container__sub__content__right'>
            <Form
              layout='vertical'
              // {...formItemLayout}
              form={form}
              name='register'
              onFinish={handleSubmit}
              initialValues={{
                prefix: '84'
              }}
              style={{
                maxWidth: 600
              }}
              scrollToFirstError
            >
              <div className='register-container__sub__content__form__header' style={{ marginBottom: '10px' }}>
                <div className='register-container__sub__content__form__header__title'>
                  Đăng ký
                </div>
                <hr />
              </div>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label='Tên đăng nhập'
                    className='form-item'
                    name='username'
                    rules={[
                      {
                        required: true,
                        message: 'Please input your Username!'
                      }
                    ]}
                  >
                    <Input
                      prefix={<UserOutlined className='site-form-item-icon' />}
                      placeholder='Username'
                      style={{ background: '#F6F8FE' }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name='email'
                    label='Địa chỉ email'
                    rules={[
                      {
                        type: 'email',
                        message: 'Địa chỉ E-mail không hợp lệ!'
                      },
                      {
                        required: true,
                        message: 'Hãy nhập E-mail của bạn'
                      }
                    ]}
                  >
                    <Input
                      prefix={<MailOutlined className='site-form-item-icon' />}
                      style={{ background: '#F6F8FE' }}
                      placeholder='Email'


                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name='password'
                    label='Mật khẩu'
                    rules={[
                      {
                        required: true,
                        message: 'Hãy nhập mật khẩu!'
                      }
                    ]}
                    hasFeedback
                  >
                    <Input.Password
                      prefix={<LockOutlined className='site-form-item-icon' />}
                      style={{ background: '#F6F8FE' }}
                      placeholder='Mật khẩu'
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name='password2'
                    label='Nhập lại mật khẩu'
                    rules={[
                      {
                        required: true,
                        message: 'Hãy nhập lại mật khẩu!'
                      }
                    ]}
                    hasFeedback
                  >
                    <Input.Password
                      prefix={<LockOutlined className='site-form-item-icon' />}
                      style={{ background: '#F6F8FE' }}
                      placeholder='Nhập lại mật khẩu'
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label='Họ và tên'
                    className='form-item'
                    name='username'
                    rules={[
                      {
                        required: true,
                        message: 'Please input your Username!'
                      }
                    ]}
                  >
                    <Input
                      prefix={<UserOutlined className='site-form-item-icon' />}
                      placeholder='Họ tên'
                      style={{ background: '#F6F8FE' }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name='role'
                    label='Vai trò'
                    rules={[{ required: true, message: 'Please select service!' }]}
                  >
                    <Select placeholder='Lựa chọn vai trò'
                      prefix={<UserOutlined className='site-form-item-icon' />}
                      style={{ background: '#F6F8FEF6F8FE' }}
                      className='custom-select'
                    >
                      <Option value='service_01'>Sinh viên</Option>
                      <Option value='service_02'>Giảng viên</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name='agreement'
                valuePropName='checked'
                rules={[
                  {
                    validator: (_, value) =>
                      value
                        ? Promise.resolve()
                        : Promise.reject(new Error('Hãy chấp nhận điều khoản!'))
                  }
                ]}
              >
                <Checkbox className='checkbox-agreement'>
                  Tôi đồng ý với các điều khoản của <a href='' style={{ color: '#09C4AE' }}>eTrackingHI10</a>
                </Checkbox>
              </Form.Item>
              <Form.Item>
                <Button type='primary' htmlType='submit' className='btn-register' style={{ background: '#209EA6' }}>
                  Tạo tài khoản
                </Button>
              </Form.Item>
            </Form>
            <div className='to-login'>
              Bạn đã có tài khoản?{' '}
              <span className='login-link' onClick={() => handleToLogin()}>
                Đăng nhập
              </span>
            </div>
          </div>


        </div>
      </div>
    </div>
  )
}

export default Register
