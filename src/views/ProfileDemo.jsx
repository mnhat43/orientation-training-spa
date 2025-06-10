import React, { useState } from 'react'
import { Button, Card, Space, Typography } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import ProfileDrawer from '../components/header/ProfileDrawer'

const { Title, Paragraph } = Typography

const ProfileDemo = () => {
  const [drawerVisible, setDrawerVisible] = useState(false)

  // Mock user data for demo
  const mockUser = {
    user_id: 1,
    fullname: 'John Doe',
    email: 'john.doe@example.com',
    phone: '0123456789',
    bio: 'Software Developer with 5 years of experience',
    avatar: null, // Set to null to test default avatar
    role_id: 1,
  }

  const handleUpdateUser = (updatedUser) => {
    console.log('Updated user data:', updatedUser)
    // In real app, this would update the user context/state
  }

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <Title level={2}>Profile Drawer Demo</Title>

      <Card title="Test Profile Drawer" style={{ marginBottom: '24px' }}>
        <Paragraph>
          This demo allows you to test the ProfileDrawer component with mock
          user data. The drawer includes:
        </Paragraph>
        <ul>
          <li>Avatar upload functionality</li>
          <li>Profile information editing</li>
          <li>Password change form</li>
          <li>Responsive design</li>
          <li>Form validation</li>
        </ul>

        <Space direction="vertical" style={{ width: '100%' }}>
          <Button
            type="primary"
            icon={<UserOutlined />}
            onClick={() => setDrawerVisible(true)}
            size="large"
          >
            Open Profile Settings
          </Button>

          <Paragraph type="secondary">
            <strong>Mock User Data:</strong>
            <br />
            Name: {mockUser.fullname}
            <br />
            Email: {mockUser.email}
            <br />
            Phone: {mockUser.phone}
            <br />
            Bio: {mockUser.bio}
          </Paragraph>
        </Space>
      </Card>

      <Card title="Features Implemented">
        <ul>
          <li>✅ Avatar display with user image or default icon</li>
          <li>✅ Fixed header height to prevent dropdown overflow</li>
          <li>✅ Profile drawer with tabs (Profile Info & Change Password)</li>
          <li>✅ Avatar upload with validation (JPG/PNG, max 2MB)</li>
          <li>✅ Form validation for all fields</li>
          <li>✅ Password strength validation</li>
          <li>✅ Responsive design for mobile</li>
          <li>✅ Integration with useAuth hook</li>
          <li>✅ Consistent styling with app theme</li>
        </ul>
      </Card>

      <ProfileDrawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        currentUser={mockUser}
        onUpdateUser={handleUpdateUser}
      />
    </div>
  )
}

export default ProfileDemo
