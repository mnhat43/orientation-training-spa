import React from 'react'
import {
  Row,
  Col,
  Card,
  Statistic,
  Button,
  List,
  Badge,
  Progress,
  Typography,
  Space,
  Divider,
} from 'antd'
import {
  UserOutlined,
  PlusOutlined,
  SettingOutlined,
  TeamOutlined,
  DatabaseOutlined,
  ApiOutlined,
  FileTextOutlined,
  BellOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons'

const { Title, Text } = Typography

const AdminDashboard = () => {
  const recentActivities = [
    'Sarah Johnson updated the HR policy',
    'New employee John Smith onboarded',
    'System maintenance scheduled for Sunday',
    'Budget reports have been published',
    'New office location announcement shared',
  ]

  return (
    <div className="role-dashboard admin-dashboard">
      <Title level={2}>Admin Dashboard</Title>
      <Divider />

      <Row gutter={[16, 16]} className="stats-row">
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="Total Users"
              value={248}
              prefix={<UserOutlined />}
              suffix={<Text type="success">+12%</Text>}
            />
            <Text type="secondary">Compared to last month</Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="New Employees"
              value={18}
              prefix={<TeamOutlined />}
              suffix={<Text type="success">+5</Text>}
            />
            <Text type="secondary">Added this week</Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="Departments"
              value={12}
              prefix={<TeamOutlined />}
            />
            <Text type="secondary">No change from last month</Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="System Health"
              value={99.8}
              suffix="%"
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
            />
            <Text type="secondary">All systems operational</Text>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="User Management" className="action-card">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button type="primary" icon={<PlusOutlined />} block>
                Add User
              </Button>
              <Button icon={<SettingOutlined />} block>
                Manage Roles
              </Button>
              <Button icon={<TeamOutlined />} block>
                View All Users
              </Button>
            </Space>
          </Card>

          <Card
            title="Recent Activity"
            className="recent-activity-card"
            style={{ marginTop: '16px' }}
          >
            <List
              itemLayout="horizontal"
              dataSource={recentActivities}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<BellOutlined />}
                    title={item}
                    description="Just now"
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="System Overview" className="system-overview-card">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={8}>
                <Card className="system-status-card">
                  <Statistic
                    title="Database Status"
                    value="Operational"
                    valueStyle={{ color: '#52c41a' }}
                    prefix={<DatabaseOutlined />}
                  />
                </Card>
              </Col>

              <Col xs={24} sm={8}>
                <Card className="system-status-card">
                  <Statistic
                    title="API Status"
                    value="Operational"
                    valueStyle={{ color: '#52c41a' }}
                    prefix={<ApiOutlined />}
                  />
                </Card>
              </Col>

              <Col xs={24} sm={8}>
                <Card className="system-status-card">
                  <Statistic
                    title="Reports Status"
                    value="Processing"
                    valueStyle={{ color: '#1890ff' }}
                    prefix={<FileTextOutlined />}
                  />
                </Card>
              </Col>
            </Row>

            <Divider />

            <div className="storage-usage">
              <Space direction="vertical" style={{ width: '100%' }}>
                <div className="usage-label">
                  <Text>Storage Usage</Text>
                  <Text strong>65%</Text>
                </div>
                <Progress percent={65} status="active" />

                <div className="usage-label" style={{ marginTop: '10px' }}>
                  <Text>Memory Usage</Text>
                  <Text strong>42%</Text>
                </div>
                <Progress percent={42} status="active" />

                <div className="usage-label" style={{ marginTop: '10px' }}>
                  <Text>CPU Usage</Text>
                  <Text strong>28%</Text>
                </div>
                <Progress percent={28} status="active" />
              </Space>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default AdminDashboard
