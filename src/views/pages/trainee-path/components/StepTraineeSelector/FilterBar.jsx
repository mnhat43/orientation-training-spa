import React from 'react'
import { Input, Select, Row, Col } from 'antd'
import { SearchOutlined, FilterOutlined } from '@ant-design/icons'

import { DEPARTMENTS } from '@constants'

const { Option } = Select

const FilterBar = ({
  searchText,
  departmentFilter,
  setDepartmentFilter,
  onSearch,
}) => {
  return (
    <Row gutter={16} style={{ marginBottom: '16px' }}>
      <Col xs={24} sm={24} md={16} lg={16} xl={16}>
        <Input
          placeholder="Search by name or email..."
          prefix={<SearchOutlined className="search-icon" />}
          value={searchText}
          onChange={(e) => onSearch(e.target.value)}
          allowClear
          style={{ height: '42px' }}
        />
      </Col>
      <Col xs={24} sm={24} md={8} lg={8} xl={8}>
        <Select
          placeholder="All Departments"
          onChange={(value) => setDepartmentFilter(value)}
          value={departmentFilter}
          allowClear
          suffixIcon={<FilterOutlined />}
          popupMatchSelectWidth={false}
          style={{ height: '42px' }}
          defaultValue=""
        >
          <Option key="all" value="">
            All Departments
          </Option>
          {Object.values(DEPARTMENTS).map((dept) => (
            <Option key={dept} value={dept}>
              {dept}
            </Option>
          ))}
        </Select>
      </Col>
    </Row>
  )
}

export default FilterBar
