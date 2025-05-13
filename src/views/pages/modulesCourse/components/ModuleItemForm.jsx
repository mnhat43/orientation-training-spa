import React, { useState } from 'react'
import {
  Form,
  Input,
  Modal,
  Button,
  Upload,
  Typography,
  Alert,
  InputNumber,
} from 'antd'
import {
  UploadOutlined,
  LinkOutlined,
  ClockCircleOutlined,
  InfoCircleOutlined,
  InboxOutlined,
} from '@ant-design/icons'
import PropTypes from 'prop-types'

const { Title, Text } = Typography
const { Dragger } = Upload

const ModuleItemForm = ({
  visible,
  onCancel,
  onSubmit,
  itemType,
  form: propForm,
  isInDrawer = false,
}) => {
  const [form] = isInDrawer ? [propForm] : Form.useForm()
  const [fileToBase64Loading, setFileToBase64Loading] = useState(false)

  const handleSubmit = (values) => {
    onSubmit(values)
    if (!isInDrawer) {
      form.resetFields()
    }
  }

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      setFileToBase64Loading(true)
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        setFileToBase64Loading(false)
        resolve(reader.result)
      }
      reader.onerror = (error) => {
        setFileToBase64Loading(false)
        reject(error)
      }
    })
  }

  const normFile = async (e) => {
    try {
      if (Array.isArray(e)) {
        return e
      }

      if (e?.file?.originFileObj) {
        const base64 = await getBase64(e.file.originFileObj)
        return base64
      }

      if (e?.fileList && e.fileList.length > 0) {
        const lastFile = e.fileList[e.fileList.length - 1]
        if (lastFile.originFileObj) {
          const base64 = await getBase64(lastFile.originFileObj)
          return base64
        }
      }

      return undefined
    } catch (error) {
      console.error('Error converting file to base64:', error)
      return undefined
    }
  }

  const renderFormContent = () => (
    <>
      <div className="form-content__compact-section">
        <div className="form-content__section-header">
          <div className="form-content__section-icon">
            <InfoCircleOutlined />
          </div>
          <div className="form-content__section-title">
            {itemType === 'video' ? 'Video Information' : 'File Information'}
          </div>
        </div>

        {itemType === 'file' ? (
          <div className="form-content__grid form-content__grid--2">
            <Form.Item
              name="title"
              label="Title"
              rules={[{ required: true, message: 'Please enter a title' }]}
              className="form-content__form-item"
            >
              <Input
                placeholder="Enter title"
                className="form-content__input"
              />
            </Form.Item>

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
              className="form-content__form-item"
            >
              <InputNumber
                min={1}
                className="form-content__input-number"
                placeholder="e.g. 30"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </div>
        ) : (
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Please enter a title' }]}
            className="form-content__form-item"
          >
            <Input placeholder="Enter title" className="form-content__input" />
          </Form.Item>
        )}
      </div>

      {itemType === 'video' && (
        <div className="form-content__compact-section">
          <div className="form-content__section-header">
            <div className="form-content__section-icon">
              <LinkOutlined />
            </div>
            <div className="form-content__section-title">Video Source</div>
          </div>

          <Alert
            message="Supported: YouTube, Vimeo, and other streaming services"
            type="info"
            showIcon
            className="form-content__alert"
          />

          <Form.Item
            name="resource"
            label="Video URL"
            rules={[
              { required: true, message: 'Please enter video URL' },
              { type: 'url', message: 'Please enter a valid URL' },
            ]}
            className="form-content__form-item"
          >
            <Input
              prefix={<LinkOutlined />}
              placeholder="Enter video URL (YouTube, Vimeo, etc.)"
              className="form-content__input"
            />
          </Form.Item>
        </div>
      )}

      {itemType === 'file' && (
        <div className="form-content__compact-section">
          <div className="form-content__section-header">
            <div className="form-content__section-icon">
              <UploadOutlined />
            </div>
            <div className="form-content__section-title">File Upload</div>
          </div>

          <Form.Item
            name="resource"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[{ required: true, message: 'Please upload a file' }]}
            className="form-content__upload-item form-content__upload-item--compact"
          >
            <Dragger
              maxCount={1}
              beforeUpload={() => false}
              listType="picture"
              className="file-upload-dragger file-upload-dragger--compact file-upload-dragger--extra-compact"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png"
              multiple={false}
              customRequest={({ onSuccess }) => {
                setTimeout(() => {
                  onSuccess('ok')
                }, 0)
              }}
            >
              <div className="file-upload-dragger__content">
                <div className="file-upload-dragger__icon">
                  <InboxOutlined />
                </div>
                <div className="file-upload-dragger__text">
                  <Text strong>Click or drag file</Text>
                </div>
              </div>
            </Dragger>
          </Form.Item>
        </div>
      )}

      {!isInDrawer && (
        <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
          <Button
            type="primary"
            htmlType="submit"
            loading={fileToBase64Loading}
          >
            Save
          </Button>
        </Form.Item>
      )}
    </>
  )

  if (isInDrawer) {
    return (
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="form-content"
      >
        {renderFormContent()}
        <Form.Item className="form-content__submit">
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={fileToBase64Loading}
          >
            Add {itemType === 'video' ? 'Video' : 'File'}
          </Button>
        </Form.Item>
      </Form>
    )
  }

  return (
    <Modal
      title={`Add ${itemType === 'video' ? 'Video' : 'File'}`}
      open={visible}
      onCancel={onCancel}
      footer={null}
      className="module-item-modal"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="form-content"
      >
        {renderFormContent()}
      </Form>
    </Modal>
  )
}

ModuleItemForm.propTypes = {
  visible: PropTypes.bool,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  itemType: PropTypes.string.isRequired,
  form: PropTypes.object,
  isInDrawer: PropTypes.bool,
}

export default ModuleItemForm
