import React, { useState, useEffect } from 'react'
import { Typography, Button, Space, Spin, Alert, Row, Col } from 'antd'
import {
  PlusOutlined,
  AppstoreOutlined,
  FileAddOutlined,
  BookOutlined,
} from '@ant-design/icons'
import { useParams } from 'react-router-dom'
import ModuleList from './components/ModuleList'
import ModuleForm from './components/ModuleForm'
import Banner from '@components/Banner'
import ConfirmationModal from '@components/ConfirmationModal'
import module from '@api/module'
import moduleItem from '@api/moduleItem'
import { toast } from 'react-toastify'
import './index.scss'

const Modules = () => {
  const { Title } = Typography
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
        description: values.description,
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
      return
    }

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    const reorderedModules = [...modules]
    const [movedModule] = reorderedModules.splice(currentIndex, 1)
    reorderedModules.splice(newIndex, 0, movedModule)

    const updatedModules = reorderedModules.map((item, index) => ({
      ...item,
      position: index + 1,
    }))

    setModules(updatedModules)

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
        fetchModules()
      }
    } catch (error) {
      toast.error('Failed to save the new order')
      fetchModules()
    } finally {
      setLoading(false)
    }
  }

  const renderEmptyState = () => (
    <div className="empty-state">
      <div className="empty-state-icon">
        <AppstoreOutlined />
      </div>
      <h3 className="empty-state-title">No Modules Yet</h3>
      <p className="empty-state-description">
        Get started by creating your first module for this course
      </p>
      <Button
        type="primary"
        icon={<FileAddOutlined />}
        size="large"
        onClick={() => setIsFormModalVisible(true)}
      >
        Create First Module
      </Button>
    </div>
  )

  const renderContent = () => {
    if (loading && modules.length === 0) {
      return (
        <div className="loading-container" style={{ textAlign: 'center' }}>
          <Spin size="large" />
          <div style={{ marginTop: 16 }}>Loading modules...</div>
        </div>
      )
    }

    if (error) {
      return <Alert message={error} type="error" showIcon />
    }

    if (modules.length === 0) {
      return renderEmptyState()
    }

    return (
      <Row gutter={[16, 16]}>
        {modules.map((module, index) => (
          <Col xs={24} key={module.id}>
            <ModuleList
              module={module}
              index={index}
              editModule={(updatedModule) =>
                editModule(module.id, updatedModule)
              }
              removeModule={() => confirmDeleteModule(module.id)}
              addModuleItem={(moduleItem) =>
                addModuleItem(module.id, moduleItem)
              }
              removeModuleItem={(id) => confirmDeleteModuleItem(id)}
              isLoading={loading}
              moveUp={() => moveModule(module.id, 'up')}
              moveDown={() => moveModule(module.id, 'down')}
              isFirst={index === 0}
              isLast={index === modules.length - 1}
            />
          </Col>
        ))}
      </Row>
    )
  }

  const totalItems = modules.reduce(
    (acc, module) => acc + (module.module_items?.length || 0),
    0,
  )

  return (
    <div className="modules-page">
      <Banner
        title={`Course Modules (${modules.length})`}
        description={`Organize your course content into logical sections. This course has ${modules.length} modules with ${totalItems} total items.`}
        icon={BookOutlined}
        closable={false}
      />
      <div className="modules-layout">
        <div className="modules-main">
          <div className="modules-container">{renderContent()}</div>
        </div>
        <aside className="modules-sidebar">
          <div className="modules-actions">
            <div className="action-card">
              <div className="action-card-icon">
                <PlusOutlined />
              </div>
              <div className="action-card-content">
                <h4>Create Module</h4>
                <p>
                  Add a new module to organize your course content into logical
                  sections
                </p>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setIsFormModalVisible(true)}
                  className="action-button"
                >
                  Add New Module
                </Button>
              </div>
            </div>
          </div>
        </aside>
      </div>

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
        <Alert
          message="Warning"
          description="Are you sure you want to delete this module? All module items will be permanently deleted as well."
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
        />
      </ConfirmationModal>

      <ConfirmationModal
        title="Delete Module Item"
        visible={!!deleteModuleItemId}
        onCancel={() => setDeleteModuleItemId(null)}
        onConfirm={removeModuleItem}
        confirmLoading={loading}
      >
        <Alert
          message="Warning"
          description="Are you sure you want to delete this item? This action cannot be undone."
          type="warning"
          showIcon
        />
      </ConfirmationModal>
    </div>
  )
}

export default Modules
