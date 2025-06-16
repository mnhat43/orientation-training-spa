import React from 'react'
import { Card, Row, Col, Input, Select, Button } from 'antd'
import { SearchOutlined, FilterOutlined, PlusOutlined } from '@ant-design/icons'
import { DEPARTMENT_NAMES, ROLE_NAMES } from '@constants'
import useWindowSize from '@hooks/useWindowSize'
const { Option } = Select

const UserFilters = ({
  searchText,
  setSearchText,
  departmentFilter,
  setDepartmentFilter,
  roleFilter,
  setRoleFilter,
  onAddUser,
}) => {
  const { width } = useWindowSize()
  const isMobile = width < 768
  return (
    <Card style={{ marginBottom: 16 }}>
      <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
        <Col xs={24} sm={24} md={10} lg={8} xl={7}>
          <Input
            placeholder="Search user..."
            prefix={<SearchOutlined />}
            onChange={(e) => setSearchText(e.target.value)}
            value={searchText}
            allowClear
            style={{ height: '42px' }}
          />
        </Col>
        <Col xs={9} sm={7} md={6} lg={5} xl={4}>
          <Select
            value={roleFilter}
            onChange={(value) => setRoleFilter(value)}
            placeholder="All role"
            suffixIcon={<FilterOutlined />}
            style={{ height: '42px', width: '100%' }}
            allowClear
          >
            {' '}
            {ROLE_NAMES.filter((role) => role.role_name !== 'Admin').map(
              (role) => (
                <Option key={role.role_id} value={role.role_name}>
                  {role.role_name}
                </Option>
              ),
            )}
          </Select>
        </Col>{' '}
        <Col xs={9} sm={7} md={6} lg={5} xl={4}>
          <Select
            value={departmentFilter}
            onChange={(value) => setDepartmentFilter(value)}
            placeholder="All department"
            suffixIcon={<FilterOutlined />}
            style={{ height: '42px', width: '100%' }}
            allowClear
          >
            {DEPARTMENT_NAMES.map((dept) => (
              <Option key={dept} value={dept}>
                {dept}
              </Option>
            ))}
          </Select>
        </Col>
        <Col xs={6} sm={6} md={3} lg={4} xl={4}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => onAddUser(true)}
            style={{ height: '42px' }}
          >
            {isMobile ? '+' : 'Create user'}
          </Button>
        </Col>
      </Row>
    </Card>
  )
}

export default UserFilters
