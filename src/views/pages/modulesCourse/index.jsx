import React, { useState, useEffect } from 'react'
import {
  Typography,
  Button,
  Empty,
  Card,
  Space,
  Spin,
  Alert,
  Divider,
  Badge,
} from 'antd'
import { PlusOutlined, BookOutlined, RightOutlined } from '@ant-design/icons'
import { useParams } from 'react-router-dom'
import ModuleList from './components/ModuleList'
import ModuleForm from './components/ModuleForm'
import ConfirmationModal from '@components/ConfirmationModal'
import module from '@api/module'
import moduleItem from '@api/moduleItem'
import { toast } from 'react-toastify'
import './modulesCourse.scss'

const Modules = () => {
  const { Title, Text } = Typography
  const { courseId } = useParams()
  const [isFormModalVisible, setIsFormModalVisible] = useState(false)
  const [modules, setModules] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [deleteModuleId, setDeleteModuleId] = useState(null)
  const [deleteModuleItemId, setDeleteModuleItemId] = useState(null)

  useEffect(() => {
    fetchModules()
  }, [courseId])

  const fetchModules = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await module.getListModuleDetail({
        course_id: parseInt(courseId),
      })
      if (response.status === 1) {
        setModules(response.data?.modules || [])
      } else {
        setError(response.message || 'Failed to fetch modules')
        toast.error(response.message || 'Failed to fetch modules')
      }
    } catch (err) {
      setError('Failed to fetch modules. Please try again later.')
      toast.error('Failed to fetch modules')
    } finally {
      setLoading(false)
    }
  }

  const handleAddModule = async (values) => {
    setLoading(true)
    try {
      const response = await module.addModule({
        course_id: parseInt(courseId),
        title: values.title,
        position: modules.length + 1,
      })
      if (response.status === 1) {
        toast.success('Module added successfully!')
        fetchModules()
      } else {
        toast.error(response.message || 'Failed to add module')
      }
    } catch (err) {
      toast.error('Failed to add module')
    } finally {
      setIsFormModalVisible(false)
      setLoading(false)
    }
  }

  const handleRemoveModule = async () => {
    if (!deleteModuleId) return

    setLoading(true)
    try {
      const response = await module.deleteModule({
        id: parseInt(deleteModuleId),
      })
      if (response.status === 1) {
        toast.success('Module deleted successfully!')
        fetchModules()
      } else {
        toast.error(response.message || 'Failed to delete module')
      }
    } catch (err) {
      toast.error('Failed to delete module')
    } finally {
      setDeleteModuleId(null)
      setLoading(false)
    }
  }

  const confirmDeleteModule = (moduleId) => {
    setDeleteModuleId(moduleId)
  }

  const editModule = async (moduleId, updatedModule) => {
    setLoading(true)
    try {
      const response = await module.updateModule({
        id: parseInt(moduleId),
        ...updatedModule,
      })
      if (response.status === 1) {
        toast.success('Module updated successfully!')
        fetchModules()
      } else {
        toast.error(response.message || 'Failed to update module')
      }
    } catch (err) {
      toast.error('Failed to update module')
    } finally {
      setLoading(false)
    }
  }

  const addModuleItem = async (moduleId, payload) => {
    setLoading(true)
    try {
      const response = await moduleItem.addModuleItem({
        ...payload,
        module_id: moduleId,
      })
      if (response.status === 1) {
        toast.success(`${payload.item_type} added successfully!`)
        fetchModules()
      } else {
        toast.error('Error: ' + response.message)
      }
    } catch (error) {
      toast.error('Error: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const removeModuleItem = async () => {
    if (!deleteModuleItemId) return

    setLoading(true)
    try {
      const response = await moduleItem.deleteModuleItem({
        moduleItem_id: deleteModuleItemId,
      })
      if (response.status === 1) {
        toast.success(`Item deleted successfully!`)
        fetchModules()
      } else {
        toast.error('Error: ' + response.message)
      }
    } catch (error) {
      toast.error('Error: ' + error.message)
    } finally {
      setDeleteModuleItemId(null)
      setLoading(false)
    }
  }

  const confirmDeleteModuleItem = (id) => {
    setDeleteModuleItemId(id)
  }

  const moveModule = async (moduleId, direction) => {
    const currentIndex = modules.findIndex((m) => m.id === moduleId)
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === modules.length - 1)
    ) {
      return // Can't move further
    }

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    const reorderedModules = [...modules]
    const [movedModule] = reorderedModules.splice(currentIndex, 1)
    reorderedModules.splice(newIndex, 0, movedModule)

    // Update positions
    const updatedModules = reorderedModules.map((item, index) => ({
      ...item,
      position: index + 1,
    }))

    setModules(updatedModules)

    // Update in the backend
    try {
      setLoading(true)
      const response = await module.updateModulePositions({
        modules: updatedModules.map((m) => ({
          id: m.id,
          position: m.position,
        })),
      })

      if (response.status !== 1) {
        toast.error('Failed to update module positions')
        fetchModules() // Refresh to get the original order
      }
    } catch (error) {
      toast.error('Failed to save the new order')
      fetchModules()
    } finally {
      setLoading(false)
    }
  }

  const renderContent = () => {
    if (loading && modules.length === 0) {
      return (
        <div className="loading-container">
          <Spin size="large" tip="Loading modules..." />
        </div>
      )
    }

    if (error) {
      return <Alert message={error} type="error" showIcon />
    }

    if (modules.length === 0) {
      return (
        <Card>
          <Empty
            description="No modules found"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsFormModalVisible(true)}
            >
              Create First Module
            </Button>
          </Empty>
        </Card>
      )
    }

    return (
      <Space direction="vertical" style={{ width: '100%' }}>
        {modules.map((module, index) => (
          <ModuleList
            key={module.id}
            module={module}
            index={index}
            editModule={(updatedModule) => editModule(module.id, updatedModule)}
            removeModule={() => confirmDeleteModule(module.id)}
            addModuleItem={(moduleItem) => addModuleItem(module.id, moduleItem)}
            removeModuleItem={(id) => confirmDeleteModuleItem(id)}
            isLoading={loading}
            moveUp={() => moveModule(module.id, 'up')}
            moveDown={() => moveModule(module.id, 'down')}
            isFirst={index === 0}
            isLast={index === modules.length - 1}
          />
        ))}
      </Space>
    )
  }

  // Add a computed property to get the count of all items
  const totalItems = modules.reduce(
    (acc, module) => acc + (module.module_items?.length || 0),
    0,
  )

  return (
    <>
      <div className="header-container">
        <div className="header-content">
          <div className="title-section">
            <div className="icon-wrapper">
              <BookOutlined style={{ fontSize: 24, color: 'white' }} />
            </div>
            <div className="text-content">
              <Title level={3}>
                Course Modules
                <Badge
                  count={modules.length}
                  className="badge"
                  style={{
                    backgroundColor: '#1890ff',
                    fontSize: '14px',
                    marginTop: '-4px',
                  }}
                />
              </Title>
              <Text className="description">
                Organize your course content into logical sections with
                materials, quizzes, and assignments
              </Text>
            </div>
          </div>
          <Button
            onClick={() => setIsFormModalVisible(true)}
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            className="add-module-btn"
          >
            Add Module
            <RightOutlined />
          </Button>
        </div>
        <Divider className="styled-divider" />
        <Space>
          <Badge
            status="processing"
            text={`${modules.length} Modules`}
            className="stats-badge"
          />
          <Badge
            status="success"
            text={`${totalItems} Total Items`}
            className="stats-badge"
          />
        </Space>
      </div>

      <div className="modules-container">{renderContent()}</div>

      <ModuleForm
        visible={isFormModalVisible}
        onCancel={() => setIsFormModalVisible(false)}
        onSubmit={handleAddModule}
      />

      <ConfirmationModal
        title="Delete Module"
        visible={!!deleteModuleId}
        onCancel={() => setDeleteModuleId(null)}
        onConfirm={handleRemoveModule}
        confirmLoading={loading}
      >
        Are you sure you want to delete this module? All module items will be
        deleted as well.
      </ConfirmationModal>

      <ConfirmationModal
        title="Delete Module Item"
        visible={!!deleteModuleItemId}
        onCancel={() => setDeleteModuleItemId(null)}
        onConfirm={removeModuleItem}
        confirmLoading={loading}
      >
        Are you sure you want to delete this item?
      </ConfirmationModal>
    </>
  )
}

export default Modules
