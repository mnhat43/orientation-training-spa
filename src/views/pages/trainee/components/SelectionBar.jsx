import React from 'react'
import { Button, Badge, Avatar, Dropdown, Menu } from 'antd'
import {
  TeamOutlined,
  UserOutlined,
  BookOutlined,
  DeleteOutlined,
  CloseOutlined,
  MoreOutlined,
  DownOutlined,
} from '@ant-design/icons'

const SelectionBar = ({
  selectedRowKeys,
  trainees,
  onBulkAssign,
  onBulkDelete,
  onClearSelection,
  onRemoveFromSelection,
}) => {
  // Add a dropdown menu for additional actions (for future expansion)
  const actionsMenu = (
    <Menu>
      <Menu.Item key="delete" icon={<DeleteOutlined />} onClick={onBulkDelete}>
        Delete Selected
      </Menu.Item>
      <Menu.Item
        key="clear"
        icon={<CloseOutlined />}
        onClick={onClearSelection}
      >
        Clear Selection
      </Menu.Item>
    </Menu>
  )

  return (
    <div className="selection-bar">
      <div className="selection-header">
        <div className="selection-info">
          <Badge count={selectedRowKeys.length} className="selection-badge">
            <TeamOutlined className="selection-icon" />
          </Badge>
          <span className="selection-title">Selected Trainees</span>
        </div>

        <div className="selection-actions">
          <Button
            type="primary"
            onClick={onBulkAssign}
            icon={<BookOutlined />}
            className="primary-action-button"
          >
            Assign Courses
          </Button>
        </div>
      </div>

      <div className="selection-list">
        {selectedRowKeys.map((id) => {
          const trainee = trainees.find((t) => t.id === id)
          return trainee ? (
            <div key={id} className="selected-trainee-card">
              <div className="selected-trainee-info">
                <div className="selected-trainee-name">{trainee.name}</div>
                <div className="selected-trainee-dept">
                  {trainee.department}
                </div>
              </div>
              <Button
                type="text"
                className="remove-trainee-btn"
                icon={<CloseOutlined />}
                onClick={() => onRemoveFromSelection(id)}
              />
            </div>
          ) : null
        })}
      </div>
    </div>
  )
}

export default SelectionBar
