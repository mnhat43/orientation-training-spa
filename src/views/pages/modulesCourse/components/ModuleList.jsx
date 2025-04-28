import React, { useState } from 'react'
import {
  Card,
  Typography,
  Button,
  Space,
  Dropdown,
  Menu,
  Tooltip,
  Badge,
  Tag,
} from 'antd'
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  FileTextOutlined,
  VideoCameraOutlined,
  LinkOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons'
import styled from 'styled-components'
import ModuleForm from './ModuleForm'
import ModuleItemForm from './ModuleItemForm'
import PropTypes from 'prop-types'

const { Text } = Typography

const ModuleCard = styled(Card)`
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-bottom: 16px;
  border: 1px solid #f0f0f0;

  .ant-card-head {
    border-bottom: 1px solid #f0f0f0;
    min-height: 48px;
    padding: 0 16px;
  }

  .ant-card-body {
    padding: 16px;
  }

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  }
`

const ModuleItemWrapper = styled.div`
  padding: 12px;
  margin-bottom: 8px;
  border-radius: 6px;
  background-color: #fafafa;
  border: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    background-color: #f5f5f5;
  }

  .module-item-title {
    display: flex;
    align-items: center;
  }

  .module-item-type-icon {
    margin-right: 8px;
    font-size: 16px;
  }
`

const ItemTypeIcon = ({ type }) => {
  switch (type?.toLowerCase()) {
    case 'video':
      return <VideoCameraOutlined style={{ color: '#1890ff' }} />
    case 'file':
      return <FileTextOutlined style={{ color: '#52c41a' }} />
    case 'link':
      return <LinkOutlined style={{ color: '#722ed1' }} />
    case 'quiz':
      return <QuestionCircleOutlined style={{ color: '#fa8c16' }} />
    default:
      return <FileTextOutlined style={{ color: '#d9d9d9' }} />
  }
}

const ModuleList = ({
  module,
  editModule,
  removeModule,
  addModuleItem,
  removeModuleItem,
  index,
  isLoading,
  moveUp,
  moveDown,
  isFirst,
  isLast,
}) => {
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [addItemModalVisible, setAddItemModalVisible] = useState(false)
  const [itemType, setItemType] = useState(null)

  const handleEditModule = (values) => {
    editModule(values)
    setEditModalVisible(false)
  }

  const handleAddItem = (values) => {
    addModuleItem({
      ...values,
      item_type: itemType,
      position: (module.module_items?.length || 0) + 1,
    })
    setAddItemModalVisible(false)
  }

  const getItemLabel = (type) => {
    switch (type?.toLowerCase()) {
      case 'video':
        return 'Video'
      case 'file':
        return 'File'
      case 'document': // Include this for backward compatibility
        return 'File'
      case 'link':
        return 'Link'
      case 'quiz':
        return 'Quiz'
      default:
        return 'Content'
    }
  }

  const showAddItemModal = (type) => {
    setItemType(type)
    setAddItemModalVisible(true)
  }

  const moduleItemsMenuItems = [
    {
      key: 'video',
      icon: <VideoCameraOutlined />,
      label: 'Add Video',
      onClick: () => showAddItemModal('video'),
    },
    {
      key: 'file',
      icon: <FileTextOutlined />,
      label: 'Add File',
      onClick: () => showAddItemModal('file'),
    },
    {
      key: 'quiz',
      icon: <QuestionCircleOutlined />,
      label: 'Add Quiz',
      onClick: () => showAddItemModal('quiz'),
    },
  ]

  return (
    <div>
      <ModuleCard
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Text strong>{module.title}</Text>
            <Badge
              count={module.module_items?.length || 0}
              style={{ marginLeft: 8, backgroundColor: '#52c41a' }}
              showZero
            />
          </div>
        }
        extra={
          <Space>
            {!isFirst && (
              <Tooltip title="Move Up">
                <Button
                  icon={<ArrowUpOutlined />}
                  type="text"
                  onClick={moveUp}
                  disabled={isLoading}
                />
              </Tooltip>
            )}
            {!isLast && (
              <Tooltip title="Move Down">
                <Button
                  icon={<ArrowDownOutlined />}
                  type="text"
                  onClick={moveDown}
                  disabled={isLoading}
                />
              </Tooltip>
            )}
            <Tooltip title="Edit Module">
              <Button
                icon={<EditOutlined />}
                type="text"
                onClick={() => setEditModalVisible(true)}
                disabled={isLoading}
              />
            </Tooltip>
            <Dropdown
              menu={{ items: moduleItemsMenuItems }}
              placement="bottomRight"
              disabled={isLoading}
            >
              <Button
                icon={<PlusOutlined />}
                type="text"
                disabled={isLoading}
              />
            </Dropdown>
            <Tooltip title="Delete Module">
              <Button
                icon={<DeleteOutlined />}
                type="text"
                danger
                onClick={removeModule}
                disabled={isLoading}
              />
            </Tooltip>
          </Space>
        }
      >
        {module.description && (
          <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
            {module.description}
          </Text>
        )}

        {module.module_items && module.module_items.length > 0 ? (
          <div>
            {module.module_items.map((item) => (
              <ModuleItemWrapper key={item.id}>
                <div className="module-item-title">
                  <span className="module-item-type-icon">
                    <ItemTypeIcon type={item.item_type} />
                  </span>
                  <Space direction="vertical" size={0}>
                    <Text strong>{item.title}</Text>
                    {item.description && (
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {item.description.length > 80
                          ? `${item.description.substring(0, 80)}...`
                          : item.description}
                      </Text>
                    )}
                  </Space>
                </div>
                <Space>
                  <Tag color="blue">{getItemLabel(item.item_type)}</Tag>
                  <Button
                    icon={<DeleteOutlined />}
                    size="small"
                    type="text"
                    danger
                    onClick={() => removeModuleItem(item.id)}
                    disabled={isLoading}
                  />
                </Space>
              </ModuleItemWrapper>
            ))}
          </div>
        ) : (
          <Text type="secondary">
            No items in this module. Click the "+" button to add content.
          </Text>
        )}
      </ModuleCard>

      <ModuleForm
        visible={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onSubmit={handleEditModule}
        initialValues={module}
        title="Edit Module"
      />

      <ModuleItemForm
        visible={addItemModalVisible}
        onCancel={() => setAddItemModalVisible(false)}
        onSubmit={handleAddItem}
        itemType={itemType}
      />
    </div>
  )
}

ModuleList.propTypes = {
  module: PropTypes.object.isRequired,
  editModule: PropTypes.func.isRequired,
  removeModule: PropTypes.func.isRequired,
  addModuleItem: PropTypes.func.isRequired,
  removeModuleItem: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  isLoading: PropTypes.bool,
  moveUp: PropTypes.func,
  moveDown: PropTypes.func,
  isFirst: PropTypes.bool,
  isLast: PropTypes.bool,
}

export default ModuleList
