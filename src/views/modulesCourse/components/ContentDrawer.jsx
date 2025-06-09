import React, { useState, useEffect } from 'react'
import { Drawer, Tabs, Form } from 'antd'
import {
  VideoCameraOutlined,
  FileTextOutlined,
  QuestionCircleOutlined,
  FileImageOutlined,
  CloseOutlined,
} from '@ant-design/icons'
import VideoForm from './VideoForm'
import FileForm from './FileForm'
import QuizForm from './QuizForm'
import SlideForm from './SlideForm'
import './ContentDrawer.scss'

const ContentDrawer = ({ visible, onClose, onSubmit, moduleId }) => {
  const [videoForm] = Form.useForm()
  const [fileForm] = Form.useForm()
  const [quizForm] = Form.useForm()
  const [slideForm] = Form.useForm()
  const [activeTab, setActiveTab] = useState('video') //video, file, quiz, slide
  useEffect(() => {
    if (visible) {
      videoForm.resetFields()
      fileForm.resetFields()
      quizForm.resetFields()
      slideForm.resetFields()
    }
  }, [visible, videoForm, fileForm, quizForm, slideForm])
  const getCurrentForm = () => {
    switch (activeTab) {
      case 'video':
        return videoForm
      case 'file':
        return fileForm
      case 'quiz':
        return quizForm
      case 'slide':
        return slideForm
      default:
        return videoForm
    }
  }

  const handleSubmit = (values, callbacks) => {
    console.log(`Form values from ${activeTab}:`, values)

    let formattedValues = {
      ...values,
      module_id: moduleId,
      item_type: activeTab,
    }

    try {
      const result = onSubmit(formattedValues)

      if (result && typeof result.then === 'function') {
        result
          .then(() => {
            getCurrentForm().resetFields()
            onClose()
            if (callbacks && callbacks.onSuccess) callbacks.onSuccess()
          })
          .catch((error) => {
            console.error('Error submitting form:', error)
            if (callbacks && callbacks.onError) callbacks.onError(error)
          })
      } else {
        getCurrentForm().resetFields()
        onClose()
        if (callbacks && callbacks.onSuccess) callbacks.onSuccess()
      }
    } catch (error) {
      console.error('Error in form submission:', error)
      if (callbacks && callbacks.onError) callbacks.onError(error)
    }
  }

  const handleTabChange = (key) => {
    setActiveTab(key)
  }
  const getDrawerTitle = () => {
    switch (activeTab) {
      case 'video':
        return 'Add Video Content'
      case 'file':
        return 'Add File Content'
      case 'quiz':
        return 'Add Quiz Content'
      case 'slide':
        return 'Add Slide Content'
      default:
        return 'Add Content'
    }
  }
  const tabItems = [
    {
      key: 'video',
      label: (
        <span className="content-drawer__tab">
          <VideoCameraOutlined />
          <span className="content-drawer__tab-text">Video</span>
        </span>
      ),
      children: <VideoForm form={videoForm} onSubmit={handleSubmit} />,
    },
    {
      key: 'file',
      label: (
        <span className="content-drawer__tab">
          <FileTextOutlined />
          <span className="content-drawer__tab-text">File</span>
        </span>
      ),
      children: <FileForm form={fileForm} onSubmit={handleSubmit} />,
    },
    {
      key: 'quiz',
      label: (
        <span className="content-drawer__tab">
          <QuestionCircleOutlined />
          <span className="content-drawer__tab-text">Quiz</span>
        </span>
      ),
      children: <QuizForm form={quizForm} onSubmit={handleSubmit} />,
    },
    {
      key: 'slide',
      label: (
        <span className="content-drawer__tab">
          <FileImageOutlined />
          <span className="content-drawer__tab-text">Slide</span>
        </span>
      ),
      children: <SlideForm form={slideForm} onSubmit={handleSubmit} />,
    },
  ]

  return (
    <Drawer
      title={
        <div className="content-drawer__header">
          <div className="content-drawer__header-icon">
            {activeTab === 'video' && <VideoCameraOutlined />}
            {activeTab === 'file' && <FileTextOutlined />}
            {activeTab === 'quiz' && <QuestionCircleOutlined />}
            {activeTab === 'slide' && <FileImageOutlined />}
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
          items={tabItems}
        />
      </div>
    </Drawer>
  )
}

export default ContentDrawer
