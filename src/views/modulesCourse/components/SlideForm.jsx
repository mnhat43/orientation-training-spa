import React, { useState, useEffect } from 'react'
import {
  Form,
  Input,
  Button,
  Upload,
  Typography,
  InputNumber,
  message,
  Row,
  Col,
  Progress,
  Tooltip,
} from 'antd'
import {
  UploadOutlined,
  ClockCircleOutlined,
  InfoCircleOutlined,
  InboxOutlined,
  FileOutlined,
  DeleteOutlined,
  FileImageOutlined,
} from '@ant-design/icons'
import Spinner from '@components/Spinner'
import './SlideForm.scss'

const { Text } = Typography
const { Dragger } = Upload

const SlideForm = ({ form, onSubmit }) => {
  const [fileList, setFileList] = useState([])
  const [fileToBase64Loading, setFileToBase64Loading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [fileBase64, setFileBase64] = useState(null)
  const [formSubmitting, setFormSubmitting] = useState(false)

  useEffect(() => {
    form.setFieldsValue({
      title: '',
      required_time: undefined,
      fileResource: undefined,
    })
  }, [form])

  useEffect(() => {
    if (fileList.length > 0) {
      convertFileToBase64(fileList[0])
    } else {
      setFileBase64(null)
      form.setFieldsValue({ fileResource: undefined })
    }
  }, [fileList, form])

  const convertFileToBase64 = (file) => {
    setFileToBase64Loading(true)
    setUploadProgress(0)

    const reader = new FileReader()
    reader.addEventListener('load', () => {
      const base64Result = reader.result
      setFileBase64(base64Result)
      setFileToBase64Loading(false)
      setUploadProgress(100)

      form.setFieldsValue({
        fileResource: base64Result,
      })
    })

    reader.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        setUploadProgress(Math.round((event.loaded / event.total) * 100))
      }
    })

    reader.addEventListener('error', (error) => {
      setFileToBase64Loading(false)
      setUploadProgress(0)
    })

    reader.readAsDataURL(file)
  }

  const handleSubmit = (values) => {
    if (fileList.length === 0 || !fileBase64) {
      message.error('Please upload a slide file')
      return
    }

    if (!values.title || !values.title.trim()) {
      message.error('Please enter a title')
      return
    }

    if (!values.required_time) {
      message.error('Please specify required time')
      return
    }

    const formData = {
      title: values.title.trim(),
      required_time: values.required_time,
      resource: fileBase64,
    }

    onSubmit(formData)
  }

  const beforeUpload = (file) => {
    const acceptedTypes = [
      'application/pdf',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'image/jpeg',
      'image/png',
    ]

    const isValidType = acceptedTypes.includes(file.type)
    const isLt50M = file.size / 1024 / 1024 < 50

    if (!isValidType) {
      message.error(
        'You can only upload PDF, PowerPoint, or image files for slides!',
      )
      return Upload.LIST_IGNORE
    }

    if (!isLt50M) {
      message.error('File must be smaller than 50MB!')
      return Upload.LIST_IGNORE
    }

    setFileList([file])
    return false
  }

  const onRemove = () => {
    setFileList([])
    setFileBase64(null)
    setUploadProgress(0)
    form.setFieldsValue({ fileResource: undefined })
  }

  const uploadProps = {
    fileList,
    beforeUpload,
    onRemove,
    multiple: false,
    accept: '.pdf,.ppt,.pptx,.jpg,.jpeg,.png',
    customRequest: ({ onSuccess }) => {
      setTimeout(() => {
        onSuccess('ok', null)
      }, 0)
    },
  }

  const getFileIcon = (file) => {
    if (!file) return <FileOutlined />

    const fileType = file.type || ''

    if (fileType.includes('pdf'))
      return <FileImageOutlined style={{ color: '#ff4d4f' }} />
    if (fileType.includes('powerpoint') || fileType.includes('presentation'))
      return <FileImageOutlined style={{ color: '#fa8c16' }} />
    if (fileType.includes('image'))
      return <FileImageOutlined style={{ color: '#722ed1' }} />

    return <FileImageOutlined />
  }

  const getFileSize = (size) => {
    if (size < 1024) {
      return `${size} B`
    } else if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(2)} KB`
    } else {
      return `${(size / 1024 / 1024).toFixed(2)} MB`
    }
  }

  const validateAndSubmit = () => {
    const values = form.getFieldsValue()

    if (!values.title || !values.title.trim()) {
      message.error('Please enter a title')
      return
    }

    if (!values.required_time) {
      message.error('Please specify required time')
      return
    }

    if (!fileBase64) {
      message.error('Please upload a slide file')
      return
    }

    setFormSubmitting(true)

    const formData = {
      title: values.title.trim(),
      required_time: values.required_time * 60,
      resource: fileBase64,
    }

    try {
      onSubmit({ ...formData })
    } catch (error) {
      console.error('Error in form submission:', error)
      message.error('Error submitting form')
      setFormSubmitting(false)
    }
  }

  return (
    <div className="slide-form-container">
      {formSubmitting && (
        <Spinner
          overlay={true}
          message="Creating slide content..."
          borderRadius="8px"
        />
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        requiredMark={false}
        className="form-content slide-form"
        onFinishFailed={(errorInfo) => {
          console.log('Form validation failed:', errorInfo)
        }}
      >
        <Form.Item name="fileResource" hidden>
          <Input />
        </Form.Item>

        <div className="form-content__section form-content__compact-section">
          <div className="form-content__section-header">
            <div className="form-content__section-icon">
              <InfoCircleOutlined />
            </div>
            <div className="form-content__section-title">Slide Details</div>
          </div>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="title"
                label="Title"
                rules={[{ required: true, message: 'Please enter a title' }]}
                className="form-content__form-item form-content__form-item--compact"
              >
                <Input
                  placeholder="Enter slide title"
                  className="form-content__input"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="required_time"
                label={
                  <span className="form-content__label">
                    <ClockCircleOutlined /> Required Time (minutes)
                  </span>
                }
                rules={[
                  { required: true, message: 'Please specify required time' },
                ]}
                className="form-content__form-item form-content__form-item--compact"
              >
                <InputNumber
                  min={1}
                  className="form-content__input-number"
                  placeholder="e.g. 15"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>
        </div>

        <div className="form-content__section">
          <div className="form-content__section-header">
            <div className="form-content__section-icon">
              <UploadOutlined />
            </div>
            <div className="form-content__section-title">Slide Upload</div>
          </div>

          <div className="form-content__upload-container">
            {fileList.length === 0 ? (
              <Form.Item
                name="file_upload"
                rules={[
                  { required: true, message: 'Please upload a slide file' },
                ]}
                className="form-content__form-item"
              >
                <Dragger {...uploadProps} className="slide-form__dragger">
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">
                    Click or drag slide file to this area to upload
                  </p>
                  <p className="ant-upload-hint">
                    Support for PDF, PowerPoint and image files for slides. Max
                    50MB.
                  </p>
                </Dragger>
              </Form.Item>
            ) : (
              <div className="slide-form__file-preview">
                <div className="slide-form__file-info">
                  <div className="slide-form__file-icon">
                    {getFileIcon(fileList[0])}
                  </div>
                  <div className="slide-form__file-details">
                    <Text strong ellipsis={{ tooltip: fileList[0].name }}>
                      {fileList[0].name}
                    </Text>
                    <Text type="secondary">
                      {getFileSize(fileList[0].size)}
                    </Text>
                  </div>
                  <Tooltip title="Remove file">
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={onRemove}
                      className="slide-form__remove-btn"
                    />
                  </Tooltip>
                </div>
                {fileToBase64Loading && (
                  <Progress
                    percent={uploadProgress}
                    size="small"
                    status="active"
                    className="slide-form__progress"
                  />
                )}
              </div>
            )}
          </div>
        </div>

        <Form.Item className="form-content__submit">
          <Button
            type="primary"
            onClick={validateAndSubmit}
            block
            loading={fileToBase64Loading || formSubmitting}
            disabled={
              fileList.length === 0 || fileToBase64Loading || formSubmitting
            }
          >
            Add Slide
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default SlideForm
