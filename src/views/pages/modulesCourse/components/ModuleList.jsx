import React, { useState } from 'react'
import {
  Card,
  Typography,
  Button,
  Space,
  Dropdown,
  Tooltip,
  Tag,
  Divider,
  Empty,
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
  MoreOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons'
import ModuleForm from './ModuleForm'
import ModuleItemForm from './ModuleItemForm'
import PropTypes from 'prop-types'
import './moduleList.scss'

const { Text, Title } = Typography

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

  const getItemTagColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'video':
        return '#1890ff'
      case 'file':
      case 'document':
        return '#52c41a'
      case 'link':
        return '#722ed1'
      case 'quiz':
        return '#fa8c16'
      default:
        return '#d9d9d9'
    }
  }

  const showAddItemModal = (type) => {
    setItemType(type)
    setAddItemModalVisible(true)
  }

  const moduleItemsMenu = {
    items: [
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
    ],
  }

  const moreMenu = {
    items: [
      {
        key: 'edit',
        icon: <EditOutlined />,
        label: 'Edit Module',
        onClick: () => setEditModalVisible(true),
      },
      !isFirst && {
        key: 'moveUp',
        icon: <ArrowUpOutlined />,
        label: 'Move Up',
        onClick: moveUp,
      },
      !isLast && {
        key: 'moveDown',
        icon: <ArrowDownOutlined />,
        label: 'Move Down',
        onClick: moveDown,
      },
      {
        key: 'divider',
        type: 'divider',
      },
      {
        key: 'delete',
        icon: <DeleteOutlined />,
        label: 'Delete Module',
        danger: true,
        onClick: removeModule,
      },
    ].filter(Boolean),
  }

  const ItemTypeIcon = ({ type }) => {
    const lowerType = type?.toLowerCase()
    let iconComponent
    let className = ''

    switch (lowerType) {
      case 'video':
        iconComponent = <VideoCameraOutlined />
        className = 'module-item__icon--video'
        break
      case 'file':
      case 'document':
        iconComponent = <FileTextOutlined />
        className = 'module-item__icon--file'
        break
      case 'link':
        iconComponent = <LinkOutlined />
        className = 'module-item__icon--link'
        break
      case 'quiz':
        iconComponent = <QuestionCircleOutlined />
        className = 'module-item__icon--quiz'
        break
      default:
        iconComponent = <FileTextOutlined />
        break
    }

    return (
      <div className={`module-item__icon ${className}`}>{iconComponent}</div>
    )
  }

  return (
    <Card className="module-card" bordered={false}>
      <div className="module-card__header">
        <div className="module-card__title-section">
          <Title level={4} className="module-card__title">
            {module.title}
          </Title>
          <div className="module-card__badge">
            {module.module_items?.length || 0} items
          </div>
        </div>

        <div className="module-card__actions">
          <Dropdown
            menu={moduleItemsMenu}
            placement="bottomLeft"
            disabled={isLoading}
            trigger={['click']}
          >
            <Button type="primary" icon={<PlusOutlined />} disabled={isLoading}>
              Add Content
            </Button>
          </Dropdown>

          <Dropdown
            menu={moreMenu}
            placement="bottomRight"
            disabled={isLoading}
            trigger={['click']}
          >
            <Button icon={<MoreOutlined />} disabled={isLoading}>
              Actions
            </Button>
          </Dropdown>
        </div>
      </div>

      <Divider className="module-card__divider" />

      <div className="module-card__body">
        {module.description && (
          <Text className="module-card__description">{module.description}</Text>
        )}

        {module.module_items && module.module_items.length > 0 ? (
          <div>
            {module.module_items.map((item) => {
              const itemType = item.item_type?.toLowerCase()
              return (
                <div
                  key={item.id}
                  className={`module-item module-item--${itemType}`}
                >
                  <div className="module-item__content">
                    <ItemTypeIcon type={itemType} />

                    <div className="module-item__details">
                      <h4 className="module-item__title">{item.title}</h4>
                      {item.description && (
                        <p className="module-item__description">
                          {item.description}
                        </p>
                      )}
                    </div>

                    <Space className="module-item__actions">
                      <Tag
                        color={getItemTagColor(itemType)}
                        className="module-item__tag"
                      >
                        {getItemLabel(itemType)}
                      </Tag>
                      <Tooltip title="Delete item">
                        <Button
                          icon={<DeleteOutlined />}
                          size="small"
                          type="text"
                          className="module-item__delete-btn"
                          onClick={() => removeModuleItem(item.id)}
                          disabled={isLoading}
                        />
                      </Tooltip>
                    </Space>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="module-empty-state">
            <div className="module-empty-state__icon">
              <InfoCircleOutlined />
            </div>
            <h4 className="module-empty-state__title">No content yet</h4>
            <p className="module-empty-state__description">
              Add videos, files, or quizzes to this module to get started
            </p>
            <Dropdown
              menu={moduleItemsMenu}
              placement="bottom"
              trigger={['click']}
            >
              <Button type="primary" icon={<PlusOutlined />}>
                Add Content
              </Button>
            </Dropdown>
          </div>
        )}
      </div>

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
    </Card>
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
