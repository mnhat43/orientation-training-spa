import React, { useState } from 'react'
import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Divider,
  Typography,
  message,
  Space,
} from 'antd'
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  BankOutlined,
  CalendarOutlined,
  SaveOutlined,
  CloseOutlined,
} from '@ant-design/icons'
import dayjs from 'dayjs'

const { Title, Text } = Typography
const { Option } = Select

const AddTraineeModal = ({ visible, onClose, onSuccess }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const departments = [
    'Information Technology',
    'Design',
    'Marketing',
    'Human Resources',
    'Finance',
    'Operations',
    'Customer Service',
    'Sales',
  ]

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)

      // Format date to string
      const formattedValues = {
        ...values,
        startDate: values.startDate.format('YYYY-MM-DD'),
        status: 'Active', // Default status for new trainees
      }

      //   await createTrainee(formattedValues)

      message.success('Trainee added successfully')
      form.resetFields()
      onSuccess && onSuccess()
      onClose()
    } catch (error) {
      // Don't show error for validation failures (handled by form)
      if (error.errorFields) {
        return
      }

      message.error(error.message || 'Failed to add trainee')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    form.resetFields()
    onClose()
  }

  return (
    <Modal
      title={
        <Space>
          <UserOutlined />
          <span>Add New Trainee</span>
        </Space>
      }
      visible={visible}
      onCancel={handleCancel}
      width={600}
      footer={[
        <Button key="cancel" onClick={handleCancel} icon={<CloseOutlined />}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleSubmit}
          icon={<SaveOutlined />}
        >
          Add Trainee
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          startDate: dayjs(), // Use dayjs instead of moment
        }}
      >
        <Text type="secondary" strong style={{ fontSize: '16px' }}>
          Personal Information
        </Text>
        <Divider style={{ margin: '12px 0 20px' }} />

        <Form.Item
          name="name"
          label="Full Name"
          rules={[
            { required: true, message: 'Please enter full name' },
            { min: 2, message: 'Name must be at least 2 characters' },
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder="Enter full name" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please enter email' },
            { type: 'email', message: 'Please enter a valid email' },
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="Enter email address" />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Phone Number"
          rules={[
            { required: true, message: 'Please enter phone number' },
            {
              pattern: /^[0-9]{10}$/,
              message: 'Phone number must be 10 digits',
            },
          ]}
        >
          <Input prefix={<PhoneOutlined />} placeholder="Enter phone number" />
        </Form.Item>

        <Text type="secondary" strong style={{ fontSize: '16px' }}>
          Professional Information
        </Text>
        <Divider style={{ margin: '12px 0 20px' }} />

        <Form.Item
          name="department"
          label="Department"
          rules={[{ required: true, message: 'Please select department' }]}
        >
          <Select placeholder="Select department">
            {departments.map((dept) => (
              <Option key={dept} value={dept}>
                {dept}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="position"
          label="Position"
          rules={[{ required: true, message: 'Please enter position' }]}
        >
          <Input prefix={<BankOutlined />} placeholder="Enter job position" />
        </Form.Item>

        <Form.Item
          name="startDate"
          label="Start Date"
          rules={[{ required: true, message: 'Please select start date' }]}
        >
          <DatePicker
            style={{ width: '100%' }}
            format="YYYY-MM-DD"
            placeholder="Select start date"
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AddTraineeModal
