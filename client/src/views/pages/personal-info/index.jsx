import { Button, Avatar, Form, Input } from 'antd'
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons'
import './personal-info.scss'
import useAuth from 'hooks/useAuth'
import { useState } from 'react'
import { LoadingOutlined, PhoneOutlined, ScheduleOutlined, DeploymentUnitOutlined } from '@ant-design/icons'
import { toast } from 'react-toastify'
import auth from 'api/auth'
import {
  AutoComplete,
  Cascader,
  Checkbox,
  InputNumber,
  Row,
  Col,
  Select,
} from 'antd'

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 6,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 14,
    },
  },
}

const PersonalInfo = () => {
  const { userData, updateUserData } = useAuth()
  const [isSending, setIsSending] = useState(false);

  const handleChangePassword = async () => {

  };

  const handleSubmit = (values) => {
    updateUserData(values)
    toast.success("Cập nhật thành công")
  }


  return (
    <div className="personal-info-wrapper">
      <div className='title'>Thông tin cá nhân</div>
      <div className="personal-info__avatar">
        <Avatar size={100} icon={<UserOutlined />} />
        <Button
          htmlType="avarta"
          style={{
            backgroundColor: 'rgb(32, 158, 166)',
            color: 'white',
          }}
        >
          Thay ảnh đại diện
        </Button>
      </div>
      <Form
        onFinish={handleSubmit}
        style={{
          width: 700,
        }}
      >
        <Row gutter={16} style={{ marginBottom: "10px" }}>
          <Col span={12}>
            <Form.Item
              label="Tên đăng nhập"
              className="form-item"
              name="username"
              wrapperCol={{
                offset: 0,
                span: 16,
              }}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                style={{ background: "#F6F8FE" }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="email"
              label="Địa chỉ email"
              wrapperCol={{
                offset: 0,
                span: 16,
              }}
            >
              <Input
                prefix={<MailOutlined className="site-form-item-icon" />}
                style={{ background: "#F6F8FE" }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16} style={{ marginBottom: "10px" }}>
          <Col span={12}>
            <Form.Item
              label="Họ và tên"
              className="form-item"
              name="fullname"
              wrapperCol={{
                offset: 0,
                span: 16,
              }}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                style={{ background: "#F6F8FE", marginLeft: "35px" }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="phone"
              label="Số điện thoại"
              wrapperCol={{
                offset: 0,
                span: 16,
              }}
            >
              <Input
                prefix={<PhoneOutlined className="site-form-item-icon" />}
                style={{ background: "#F6F8FE" }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16} style={{ marginBottom: "10px" }}>
          <Col span={12}>
            <Form.Item
              label="Ngày sinh"
              className="form-item"
              name="birth"
              wrapperCol={{
                offset: 0,
                span: 16,
              }}
            >
              <Input
                prefix={<ScheduleOutlined className="site-form-item-icon" />}
                style={{ background: "#F6F8FE", marginLeft: "35px" }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="role"
              label="Vai trò"
              wrapperCol={{
                offset: 0,
                span: 16,
              }}
            >
              <Input
                prefix={<DeploymentUnitOutlined className="site-form-item-icon" />}
                style={{ background: "#F6F8FE", marginLeft: "43px" }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          wrapperCol={{
            offset: 10,
            span: 16,
          }}
        >
          <Button
            htmlType="submit"
            style={{
              backgroundColor: 'rgb(32, 158, 166)',
              color: 'white',
            }}
          >
            Chỉnh sửa
          </Button>
        </Form.Item>
      </Form>
    </div >
  )
}

export default PersonalInfo
