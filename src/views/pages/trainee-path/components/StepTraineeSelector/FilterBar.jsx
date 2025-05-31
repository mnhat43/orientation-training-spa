import React from 'react'
import { Input, Select, Button, Space, Divider } from 'antd'
import {
  SearchOutlined,
  FilterOutlined,
  ClearOutlined,
} from '@ant-design/icons'

import { DEPARTMENTS } from '@constants'

const { Option } = Select

const FilterBar = ({
  searchText,
  departmentFilter,
  setDepartmentFilter,
  onSearch,
  onResetFilters,
  hasActiveFilters,
}) => {
  return (
    <div className="advanced-filter-bar">
      <div className="filter-content">
        <div className="search-box">
          <Input
            placeholder="Search by name or email..."
            prefix={<SearchOutlined className="search-icon" />}
            value={searchText}
            onChange={(e) => onSearch(e.target.value)}
            allowClear
            size="middle"
          />
        </div>

        <Divider type="vertical" className="divider" />

        <div className="filter-box">
          <Space align="center" className="department-filter">
            <span className="filter-label">Department:</span>
            <Select
              placeholder="All Departments"
              onChange={(value) => setDepartmentFilter(value)}
              value={departmentFilter}
              style={{ width: 200 }}
              allowClear
              size="middle"
              suffixIcon={<FilterOutlined />}
              popupMatchSelectWidth={false}
            >
              {Object.values(DEPARTMENTS).map((dept) => (
                <Option key={dept} value={dept}>
                  {dept}
                </Option>
              ))}
            </Select>
          </Space>
        </div>

        <Divider type="vertical" className="divider" />

        <div className="reset-box">
          <Button
            onClick={onResetFilters}
            disabled={!hasActiveFilters}
            icon={<ClearOutlined />}
            type={hasActiveFilters ? 'primary' : 'default'}
            size="middle"
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  )
}

export default FilterBar
