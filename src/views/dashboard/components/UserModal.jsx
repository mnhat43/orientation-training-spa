import React, { useState, useEffect } from 'react'
import {
  Drawer,
  Form,
  Input,
  Select,
  Row,
  Col,
  Space,
  Button,
  Typography,
  message,
  DatePicker,
  Radio,
} from 'antd'
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  TeamOutlined,
  LockOutlined,
  ReloadOutlined,
  CopyOutlined,
  UploadOutlined,
  CalendarOutlined,
  ManOutlined,
  WomanOutlined,
} from '@ant-design/icons'
import { generateRandomPassword } from '@helpers/common'
import './UserModal.scss'
import { DEPARTMENT_NAMES, ROLE_NAMES } from '@constants'
import moment from 'moment'

const { Title } = Typography
const { Option } = Select

const UserModal = ({
  visible,
  onCancel,
  onFinish,
  form,
  title,
  isEdit = false,
  loading = false,
  selectedUser = null,
}) => {
  const [password, setPassword] = useState('')
  const [avatar, setAvatar] = useState(null)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [genderValue, setGenderValue] = useState(1)
  const [originalValues, setOriginalValues] = useState(null)
  const [hasChanges, setHasChanges] = useState(false)

  // Helper function to disable future dates for birthday
  const disabledBirthdayDate = (current) => {
    return current && current > moment().endOf('day')
  }
  // Helper function to disable future dates more than today for joined date
  const disabledJoinedDate = (current) => {
    return current && current > moment().endOf('day')
  }
  useEffect(() => {
    if (visible && !isEdit) {
      // Reset form when creating new user
      form.resetFields()
      setAvatar(null)
      setHasChanges(false)
      setOriginalValues(null)
      const initialPassword = generateRandomPassword()
      setPassword(initialPassword)
      form.setFieldsValue({
        password: initialPassword,
        gender: 1, // Default to Male
        company_joined_date: moment(), // Default to today
      })
    } else if (visible && isEdit && selectedUser) {
      setAvatar(selectedUser.avatar || null)
      setGenderValue(selectedUser.gender || 1)
      setHasChanges(false)

      // Set form values for editing with proper date handling
      const formValues = {
        first_name: selectedUser.first_name,
        last_name: selectedUser.last_name,
        email: selectedUser.email,
        department: selectedUser.department,
        role_id: selectedUser.role_id,
        phone_number: selectedUser.phone_number,
        gender: selectedUser.gender || 1,
      }

      // Handle birthday date conversion
      if (selectedUser.birthday) {
        const birthdayMoment = moment(selectedUser.birthday)
        if (birthdayMoment.isValid()) {
          formValues.birthday = birthdayMoment
        }
      }

      // Handle company_joined_date conversion
      if (selectedUser.company_joined_date) {
        const joinedDateMoment = moment(selectedUser.company_joined_date)
        if (joinedDateMoment.isValid()) {
          formValues.company_joined_date = joinedDateMoment
        }
      }

      // Save original values for comparison
      setOriginalValues({
        ...formValues,
        avatar: selectedUser.avatar || null,
      })

      // Debug log to check gender value
      console.log(
        'Setting form values with gender:',
        formValues.gender,
        'from user:',
        selectedUser.gender,
      )
      // Use setTimeout to ensure form is ready before setting values
      setTimeout(() => {
        form.resetFields() // Reset form first
        form.setFieldsValue(formValues)
        // Force re-render gender field specifically
        form.setFieldValue('gender', selectedUser.gender || 1)
        console.log('Gender field set to:', selectedUser.gender || 1)
      }, 100)
    }
  }, [visible, isEdit, form, selectedUser])

  // Function to check if form values have changed
  const checkForChanges = () => {
    if (!isEdit || !originalValues) return false

    const currentValues = form.getFieldsValue()

    // Compare all fields
    const fieldsToCompare = [
      'first_name',
      'last_name',
      'email',
      'department',
      'role_id',
      'phone_number',
      'gender',
    ]

    for (const field of fieldsToCompare) {
      if (currentValues[field] !== originalValues[field]) {
        return true
      }
    }

    // Compare dates (convert to string for comparison)
    const currentBirthday = currentValues.birthday
      ? moment.isMoment(currentValues.birthday)
        ? currentValues.birthday.format('YYYY-MM-DD')
        : currentValues.birthday
      : null
    const originalBirthday = originalValues.birthday
      ? moment.isMoment(originalValues.birthday)
        ? originalValues.birthday.format('YYYY-MM-DD')
        : originalValues.birthday
      : null

    if (currentBirthday !== originalBirthday) {
      return true
    }

    const currentJoinDate = currentValues.company_joined_date
      ? moment.isMoment(currentValues.company_joined_date)
        ? currentValues.company_joined_date.format('YYYY-MM-DD')
        : currentValues.company_joined_date
      : null
    const originalJoinDate = originalValues.company_joined_date
      ? moment.isMoment(originalValues.company_joined_date)
        ? originalValues.company_joined_date.format('YYYY-MM-DD')
        : originalValues.company_joined_date
      : null

    if (currentJoinDate !== originalJoinDate) {
      return true
    }

    // Check avatar
    if (avatar !== originalValues.avatar) {
      return true
    }

    return false
  }

  // Handle form value changes
  const handleFormChange = () => {
    if (isEdit) {
      const hasChanged = checkForChanges()
      setHasChanges(hasChanged)
    }
  }

  const handleRegeneratePassword = () => {
    const newPassword = generateRandomPassword()
    setPassword(newPassword)
    form.setFieldsValue({ password: newPassword })
  }

  const handleCopyPassword = () => {
    try {
      navigator.clipboard.writeText(password)
      message.success('Password copied to clipboard')
    } catch (error) {
      const textArea = document.createElement('textarea')
      textArea.value = password
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      message.success('Password copied to clipboard')
    }
  }
  const handleSubmit = (values) => {
    const userData = {
      ...values,
      avatar: avatar || '',
      fullname: `${values.first_name} ${values.last_name}`,
    }

    // Handle birthday formatting
    if (values.birthday && moment.isMoment(values.birthday)) {
      userData.birthday = values.birthday.format('YYYY-MM-DD')
    } else if (values.birthday) {
      const birthdayMoment = moment(values.birthday)
      userData.birthday = birthdayMoment.isValid()
        ? birthdayMoment.format('YYYY-MM-DD')
        : null
    } else {
      userData.birthday = null
    }

    // Handle company_joined_date formatting
    if (
      values.company_joined_date &&
      moment.isMoment(values.company_joined_date)
    ) {
      userData.company_joined_date =
        values.company_joined_date.format('YYYY-MM-DD')
    } else if (values.company_joined_date) {
      const joinedDateMoment = moment(values.company_joined_date)
      userData.company_joined_date = joinedDateMoment.isValid()
        ? joinedDateMoment.format('YYYY-MM-DD')
        : null
    } else {
      userData.company_joined_date = null
    }

    onFinish(userData)
    resetForm()
  }

  const resetForm = () => {
    form.resetFields()
    setAvatar(null)
    setPassword('')
  }
  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.match('image.*')) {
        message.error('Please upload an image file')
        return
      }

      setIsUploadingAvatar(true)
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setAvatar(event.target.result)
          // Check for changes when avatar is updated
          setTimeout(() => {
            if (isEdit) {
              const hasChanged = checkForChanges()
              setHasChanges(hasChanged)
            }
          }, 100)
        }
        setIsUploadingAvatar(false)
      }
      reader.onerror = () => {
        message.error('Failed to read image file')
        setIsUploadingAvatar(false)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Drawer
      title={<Title level={4}>{title}</Title>}
      open={visible}
      onClose={loading ? undefined : onCancel}
      width={720}
      className={`user-modal-drawer ${loading ? 'is-loading' : ''}`}
      destroyOnClose={true}
      maskClosable={!loading}
      footer={
        <div style={{ textAlign: 'right' }}>
          <Space>
            <Button onClick={onCancel} disabled={loading}>
              Cancel
            </Button>{' '}
            <Button
              type="primary"
              onClick={() => form.submit()}
              loading={loading}
              disabled={isEdit && !hasChanges}
            >
              {loading
                ? isEdit
                  ? 'Updating...'
                  : 'Creating...'
                : isEdit
                  ? 'Update User'
                  : 'Create User'}
            </Button>
          </Space>
        </div>
      }
    >
      {' '}
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        onValuesChange={handleFormChange}
        disabled={loading}
      >
        <Row gutter={24}>
          {/* Left Column - Avatar */}
          <Col span={8}>
            <div className="profile-picture-container">
              <div
                className={`avatar-container ${avatar ? 'has-avatar' : ''} ${isUploadingAvatar ? 'uploading' : ''}`}
                onClick={() => {
                  if (!loading && !isUploadingAvatar) {
                    document.getElementById('user-avatar-upload-input').click()
                  }
                }}
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  border: '2px dashed #d9d9d9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  margin: '0 auto 16px',
                  transition: 'all 0.3s ease',
                }}
              >
                {avatar ? (
                  <img
                    src={avatar}
                    alt="User Avatar"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <div style={{ textAlign: 'center', color: '#666' }}>
                    <UserOutlined
                      style={{ fontSize: '32px', marginBottom: '8px' }}
                    />
                    <div style={{ fontSize: '12px' }}>Upload Avatar</div>
                  </div>
                )}
                {isUploadingAvatar && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '12px',
                    }}
                  >
                    Uploading...
                  </div>
                )}
              </div>

              <input
                type="file"
                id="user-avatar-upload-input"
                accept="image/*"
                disabled={loading || isUploadingAvatar}
                style={{ display: 'none' }}
                onChange={handleAvatarUpload}
              />

              <div style={{ textAlign: 'center' }}>
                <Space>
                  {!avatar ? (
                    <Button
                      size="small"
                      icon={<UploadOutlined />}
                      onClick={() =>
                        document
                          .getElementById('user-avatar-upload-input')
                          .click()
                      }
                      disabled={loading}
                    >
                      Upload
                    </Button>
                  ) : (
                    <Button
                      size="small"
                      danger
                      onClick={() => {
                        setAvatar(null)
                        setTimeout(() => {
                          if (isEdit) {
                            const hasChanged = checkForChanges()
                            setHasChanges(hasChanged)
                          }
                        }, 100)
                      }}
                      disabled={loading}
                    >
                      Remove
                    </Button>
                  )}
                </Space>
              </div>
            </div>
          </Col>

          {/* Right Column - Form Fields */}
          <Col span={16}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="first_name"
                  label="First Name"
                  rules={[
                    { required: true, message: 'Please enter first name' },
                  ]}
                >
                  <Input prefix={<UserOutlined />} placeholder="First Name" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="last_name"
                  label="Last Name"
                  rules={[
                    { required: true, message: 'Please enter last name' },
                  ]}
                >
                  <Input prefix={<UserOutlined />} placeholder="Last Name" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: 'Please enter email' },
                    { type: 'email', message: 'Please enter a valid email' },
                  ]}
                >
                  <Input prefix={<MailOutlined />} placeholder="Email" />
                </Form.Item>
              </Col>{' '}
              <Col span={12}>
                <Form.Item
                  name="department"
                  label="Department"
                  rules={[
                    { required: true, message: 'Please select department' },
                  ]}
                >
                  <Select
                    placeholder="Select Department"
                    suffixIcon={<TeamOutlined />}
                  >
                    {DEPARTMENT_NAMES.map((dept) => (
                      <Option key={dept} value={dept}>
                        {dept}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>{' '}
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="role_id"
                  label="Role"
                  rules={[{ required: true, message: 'Please select role' }]}
                >
                  <Select placeholder="Select Role">
                    {ROLE_NAMES.filter(
                      (role) => role.role_name !== 'Admin',
                    ).map((role) => (
                      <Option key={role.role_id} value={role.role_id}>
                        {role.role_name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="phone_number" label="Phone Number">
                  <Input
                    prefix={<PhoneOutlined />}
                    placeholder="Phone Number"
                  />
                </Form.Item>
              </Col>
            </Row>{' '}
            {/* Birthday and Company Joined Date */}
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="birthday" label="Birthday">
                  <DatePicker
                    style={{ width: '100%' }}
                    format="YYYY-MM-DD"
                    placeholder="Select Birthday"
                    suffixIcon={<CalendarOutlined />}
                    disabledDate={disabledBirthdayDate}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="company_joined_date"
                  label="Company Joined Date"
                >
                  <DatePicker
                    style={{ width: '100%' }}
                    format="YYYY-MM-DD"
                    placeholder="Select Join Date"
                    suffixIcon={<CalendarOutlined />}
                    disabledDate={disabledJoinedDate}
                  />
                </Form.Item>
              </Col>
            </Row>{' '}
            {/* Gender and Password */}
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="gender"
                  label="Gender"
                  rules={[{ required: true, message: 'Please select gender' }]}
                >
                  {' '}
                  <Radio.Group
                    className="gender-radio-group"
                    value={genderValue}
                    onChange={(e) => {
                      setGenderValue(e.target.value)
                      form.setFieldValue('gender', e.target.value)
                      handleFormChange()
                    }}
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      gap: '16px',
                    }}
                  >
                    <Radio value={1}>
                      <Space>
                        <ManOutlined />
                        Male
                      </Space>
                    </Radio>
                    <Radio value={2}>
                      <Space>
                        <WomanOutlined />
                        Female
                      </Space>
                    </Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              {!isEdit && (
                <Col span={12}>
                  <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                      { required: true, message: 'Password is required' },
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined />}
                      value={password}
                      readOnly
                      addonAfter={
                        <Space>
                          <Button
                            type="text"
                            icon={<ReloadOutlined />}
                            onClick={handleRegeneratePassword}
                            style={{ border: 'none' }}
                            title="Generate new password"
                            disabled={loading}
                          />
                          <Button
                            type="text"
                            icon={<CopyOutlined />}
                            onClick={handleCopyPassword}
                            style={{ border: 'none' }}
                            title="Copy password"
                            disabled={loading}
                          />
                        </Space>
                      }
                    />
                  </Form.Item>
                </Col>
              )}
            </Row>
          </Col>
        </Row>
      </Form>
    </Drawer>
  )
}

export default UserModal
