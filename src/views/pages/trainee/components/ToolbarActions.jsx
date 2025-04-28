import React from 'react'
import { Input, Button, Tag, Tooltip } from 'antd'
import {
  SearchOutlined,
  UserAddOutlined,
  WarningOutlined,
} from '@ant-design/icons'

const ToolbarActions = ({
  searchQuery,
  onSearch,
  onAddTrainee,
  hasSelection,
  activeTab,
}) => {
  return (
    <div className="toolbar-main">
      <div className="search-wrapper">
        <Input
          placeholder="Search trainees..."
          prefix={<SearchOutlined />}
          value={searchQuery}
          onChange={onSearch}
          className="search-input"
          allowClear
        />

        <Button
          type="primary"
          onClick={onAddTrainee}
          icon={<UserAddOutlined />}
          className="add-trainee-button"
        >
          Add Trainee
        </Button>

        {activeTab === 'pending-review' && (
          <Tag color="warning" className="filter-active-tag">
            <WarningOutlined /> Showing only trainees with pending reviews
          </Tag>
        )}
      </div>
    </div>
  )
}

export default ToolbarActions
