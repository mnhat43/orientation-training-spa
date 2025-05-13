import React, { useState } from 'react'
import { Drawer, Tabs, Form } from 'antd'
import {
  VideoCameraOutlined,
  FileTextOutlined,
  QuestionCircleOutlined,
  CloseOutlined,
} from '@ant-design/icons'
import ModuleItemForm from './ModuleItemForm'
import QuizForm from './QuizForm'
import PropTypes from 'prop-types'
import './ContentDrawer.scss'

const { TabPane } = Tabs

const ContentDrawer = ({ visible, onClose, onSubmit, moduleId }) => {
  const [form] = Form.useForm()
  const [activeTab, setActiveTab] = useState('video')

  const handleSubmit = (values) => {
    console.log('Form values:', values)
    return
    let formattedValues = {
      ...values,
      item_type: activeTab,
      module_id: moduleId,
    }

    if (activeTab === 'quiz') {
      formattedValues = {
        ...formattedValues,
        quiz_data: values.quiz_data,
      }
    }

    onSubmit(formattedValues)
    form.resetFields()
    onClose()
  }

  const handleTabChange = (key) => {
    setActiveTab(key)
    form.resetFields()
  }

  const getDrawerTitle = () => {
    switch (activeTab) {
      case 'video':
        return 'Add Video Content'
      case 'file':
        return 'Add File Content'
      case 'quiz':
        return 'Add Quiz Content'
      default:
        return 'Add Content'
    }
  }

  return (
    <Drawer
      title={
        <div className="content-drawer__header">
          <div className="content-drawer__header-icon">
            {activeTab === 'video' && <VideoCameraOutlined />}
            {activeTab === 'file' && <FileTextOutlined />}
            {activeTab === 'quiz' && <QuestionCircleOutlined />}
          </div>
          <span>{getDrawerTitle()}</span>
        </div>
      }
      closeIcon={<CloseOutlined className="content-drawer__close-icon" />}
      placement="right"
      size="large"
      onClose={onClose}
      open={visible}
      className="content-drawer"
    >
      <div className="content-drawer__container">
        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          className="content-drawer__tabs"
        >
          <TabPane
            tab={
              <span className="content-drawer__tab">
                <VideoCameraOutlined />
                <span className="content-drawer__tab-text">Video</span>
              </span>
            }
            key="video"
          />
          <TabPane
            tab={
              <span className="content-drawer__tab">
                <FileTextOutlined />
                <span className="content-drawer__tab-text">File</span>
              </span>
            }
            key="file"
          />
          <TabPane
            tab={
              <span className="content-drawer__tab">
                <QuestionCircleOutlined />
                <span className="content-drawer__tab-text">Quiz</span>
              </span>
            }
            key="quiz"
          />
        </Tabs>

        <div className="content-drawer__content">
          {activeTab === 'video' && (
            <ModuleItemForm
              form={form}
              itemType="video"
              onSubmit={handleSubmit}
              isInDrawer={true}
            />
          )}
          {activeTab === 'file' && (
            <ModuleItemForm
              form={form}
              itemType="file"
              onSubmit={handleSubmit}
              isInDrawer={true}
            />
          )}
          {activeTab === 'quiz' && (
            <QuizForm form={form} onSubmit={handleSubmit} isInDrawer={true} />
          )}
        </div>
      </div>
    </Drawer>
  )
}

ContentDrawer.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  moduleId: PropTypes.number,
}

export default ContentDrawer
