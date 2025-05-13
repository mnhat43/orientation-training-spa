import React, { useEffect, useState, useRef } from 'react'
import { Modal, Form, Input, Typography, Button, Alert } from 'antd'
import {
  LinkOutlined,
  VideoCameraOutlined,
  FileTextOutlined,
  QuestionCircleOutlined,
  DeleteOutlined,
  UploadOutlined,
} from '@ant-design/icons'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const FileUploadContainer = styled.div`
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  padding: 16px;
  text-align: center;
  background-color: #fafafa;
  cursor: pointer;
  transition: border-color 0.3s;

  &:hover {
    border-color: #1890ff;
  }

  &.has-file {
    border-color: #52c41a;
    background-color: #f6ffed;
  }
`

const FileInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
  padding: 8px 12px;
  border-radius: 4px;
  background-color: #f6ffed;
  border: 1px solid #b7eb8f;

  .file-name {
    display: flex;
    align-items: center;
    gap: 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`

const ModuleItemForm = ({
  visible,
  onCancel,
  onSubmit,
  itemType,
  initialValues,
}) => {
  const [form] = Form.useForm()
  const [fileBase64, setFileBase64] = useState(null)
  const [fileName, setFileName] = useState('')
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (visible) {
      form.resetFields()
      setFileBase64(null)
      setFileName('')
      if (initialValues) {
        form.setFieldsValue(initialValues)
      }
    }
  }, [visible, initialValues, form])

  const getFormTitle = () => {
    switch (itemType?.toLowerCase()) {
      case 'video':
        return 'Add Video'
      case 'file':
        return 'Add File'
      case 'quiz':
        return 'Add Quiz'
      default:
        return 'Add Item'
    }
  }

  const getIcon = () => {
    switch (itemType?.toLowerCase()) {
      case 'video':
        return <VideoCameraOutlined />
      case 'file':
        return <FileTextOutlined />
      case 'quiz':
        return <QuestionCircleOutlined />
      default:
        return null
    }
  }

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        // Convert required_time from minutes to seconds for file type
        if (itemType?.toLowerCase() === 'file' && values.required_time) {
          // Convert minutes to seconds and ensure it's an integer
          values.required_time = parseInt(values.required_time) * 60
        }

        // Set the item_type to "file" instead of "document"
        const payload = { ...values, item_type: itemType }

        onSubmit(payload)
        form.resetFields()
        setFileBase64(null)
        setFileName('')
      })
      .catch((info) => {
        console.log('Validate Failed:', info)
      })
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    try {
      const reader = new FileReader()
      reader.onload = (event) => {
        const base64 = event.target.result
        setFileBase64(base64)
        setFileName(file.name)
        form.setFieldsValue({ resource: base64 })
      }
      reader.onerror = (error) => {
        console.error('FileReader error:', error)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('File reading error:', error)
    }
  }

  const clearFileSelection = () => {
    setFileBase64(null)
    setFileName('')
    form.setFieldsValue({ resource: null })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleFileUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  // File upload with better UI
  const renderFileUpload = () => {
    return (
      <>
        <Form.Item
          name="title"
          label="File Title"
          rules={[{ required: true, message: 'Please enter a title' }]}
        >
          <Input placeholder="Enter file title" />
        </Form.Item>

        <Form.Item
          label="Upload File"
          required
          tooltip="File will be converted to base64"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />

          <FileUploadContainer
            onClick={handleFileUploadClick}
            className={fileName ? 'has-file' : ''}
          >
            {!fileName ? (
              <>
                <p>
                  <UploadOutlined style={{ fontSize: 24, marginBottom: 8 }} />
                </p>
                <p>Click to select a file</p>
                <p style={{ color: '#8c8c8c', fontSize: 12 }}>
                  Allowed file types: PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, TXT
                </p>
              </>
            ) : (
              <p style={{ color: '#52c41a' }}>
                File selected (click to change)
              </p>
            )}
          </FileUploadContainer>

          {fileName && (
            <FileInfo>
              <div className="file-name">
                <FileTextOutlined style={{ color: '#52c41a' }} />
                <span>{fileName}</span>
              </div>
              <Button
                type="text"
                icon={<DeleteOutlined />}
                danger
                onClick={(e) => {
                  e.stopPropagation()
                  clearFileSelection()
                }}
              />
            </FileInfo>
          )}
        </Form.Item>

        <Form.Item
          name="resource"
          hidden
          rules={[{ required: true, message: 'Please upload a file' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="required_time"
          label="Required Time (minutes)"
          rules={[
            { required: true, message: 'Please enter the required time' },
            {
              type: 'integer',
              transform: (value) => parseInt(value),
              message: 'Please enter a valid number',
            },
          ]}
          tooltip="Time needed to view/read file (will be stored as seconds)"
        >
          <Input
            type="number"
            min="1"
            step="1"
            placeholder="Enter time in minutes"
            suffix="minutes"
            onChange={(e) => {
              // Remove decimal points and ensure it's a positive integer
              const value = e.target.value
              if (value) {
                const intValue = Math.max(1, Math.floor(parseFloat(value)))
                if (intValue.toString() !== value) {
                  form.setFieldsValue({ required_time: intValue })
                }
              }
            }}
          />
        </Form.Item>
      </>
    )
  }

  const renderFormItems = () => {
    switch (itemType?.toLowerCase()) {
      case 'video':
        return (
          <>
            <Form.Item
              name="title"
              label="Video Title"
              rules={[{ required: true, message: 'Please enter a title' }]}
            >
              <Input placeholder="Enter video title" />
            </Form.Item>
            <Form.Item
              name="resource"
              label="YouTube Video URL"
              rules={[
                { required: true, message: 'Please enter the YouTube URL' },
                { type: 'url', message: 'Please enter a valid URL' },
              ]}
              extra="Enter a valid YouTube video URL"
            >
              <Input
                prefix={<LinkOutlined />}
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </Form.Item>
            <Form.Item name="description" label="Description">
              <Input.TextArea
                placeholder="Brief description of the video (optional)"
                autoSize={{ minRows: 2, maxRows: 4 }}
              />
            </Form.Item>
          </>
        )

      case 'file':
      case 'document': // For backward compatibility
        return renderFileUpload()

      case 'quiz':
        return (
          <>
            <Form.Item
              name="title"
              label="Quiz Title"
              rules={[{ required: true, message: 'Please enter a title' }]}
            >
              <Input placeholder="Enter quiz title" />
            </Form.Item>
            <Form.Item name="description" label="Description">
              <Input.TextArea
                placeholder="Brief description of the quiz"
                autoSize={{ minRows: 3, maxRows: 5 }}
              />
            </Form.Item>
            <Alert
              message="Note"
              description="You will be able to add questions to this quiz after creating it."
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />
            <Form.Item name="time_limit" label="Time Limit (minutes)">
              <Input
                type="number"
                placeholder="Time limit for completion (optional)"
              />
            </Form.Item>
            <Form.Item
              name="passing_score"
              label="Passing Score (%)"
              initialValue={70}
            >
              <Input type="number" placeholder="Required score to pass" />
            </Form.Item>
          </>
        )

      default:
        return (
          <Alert
            message="Select item type"
            description="Please select an item type from the options."
            type="warning"
            showIcon
          />
        )
    }
  }

  return (
    <Modal
      title={
        <Typography.Title level={4} style={{ margin: 0 }}>
          {getIcon()} {getFormTitle()}
        </Typography.Title>
      }
      open={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      okText="Add Item"
      cancelText="Cancel"
      destroyOnClose
      width={window.innerWidth < 576 ? '95%' : 600}
      centered
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        requiredMark={false}
      >
        {renderFormItems()}
      </Form>
    </Modal>
  )
}

ModuleItemForm.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  itemType: PropTypes.string,
  initialValues: PropTypes.object,
}

export default ModuleItemForm
