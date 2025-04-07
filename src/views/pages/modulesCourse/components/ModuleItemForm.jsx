import { Button, Input, Radio, Space, Form, Upload, TimePicker } from 'antd'
import { useState } from 'react'

import { PlusOutlined, InboxOutlined } from '@ant-design/icons'
import { convertFileToBase64 } from '@helpers/common'

const { Dragger } = Upload

const FileForm = ({
  handleCancel,
  addModuleItem,
  loadingUpload,
  setFormActive,
}) => {
  const [form] = Form.useForm()

  const handleSubmit = async (values) => {
    const { title, file, requiredTime } = values
    try {
      const base64File = await convertFileToBase64(file[0].originFileObj)

      const requiredTimeInSeconds = requiredTime
        ? requiredTime.hour() * 3600 +
          requiredTime.minute() * 60 +
          requiredTime.second()
        : 0

      const body = {
        item_type: 'file',
        title,
        resource: base64File,
        required_time: requiredTimeInSeconds,
      }

      addModuleItem(body).then(() => setFormActive(false))
    } catch (error) {
      console.error('Error converting file to Base64:', error)
    }
  }

  const getFileList = (files) => {
    return files.fileList
  }

  const handleAutoFillName = (value) => {
    form.setFieldsValue({ ...form.getFieldValue(), title: value.file.name })
  }

  return (
    <>
      <Form
        form={form}
        onFinish={handleSubmit}
        style={{ marginTop: '8px', width: '100%' }}
        requiredMark="optional"
      >
        <Space>
          <Form.Item
            name="title"
            label="File Name"
            rules={[{ required: true, message: 'Please enter file name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="requiredTime"
            label="Required Time"
            tooltip="Set the expected time to complete this file (HH:MM:SS)"
            rules={[
              { required: true, message: 'Please specify the required time' },
            ]}
          >
            <TimePicker format="HH:mm:ss" showNow={false} />
          </Form.Item>
          <Form.Item>
            <Button onClick={handleCancel}>Cancel</Button>
          </Form.Item>
          <Form.Item>
            <Button
              loading={loadingUpload}
              type="primary"
              onClick={() => form.submit()}
            >
              Submit
            </Button>
          </Form.Item>
        </Space>
        <Form.Item
          name="file"
          valuePropName="fileList"
          getValueFromEvent={getFileList}
          rules={[
            { type: 'array', max: 1, required: true, message: 'only one file' },
          ]}
        >
          <Dragger
            onChange={handleAutoFillName}
            beforeUpload={() => {
              return false
            }}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag file to this area to upload
            </p>
            <p className="ant-upload-hint">
              Support for a single file upload only.
            </p>
          </Dragger>
        </Form.Item>
      </Form>
    </>
  )
}

const VideoForm = ({ handleCancel, addModuleItem, setFormActive }) => {
  const [form] = Form.useForm()

  const handleSubmit = (values) => {
    const { url, title } = values
    const body = {
      item_type: 'video',
      title,
      resource: url,
    }
    addModuleItem(body).then(() => setFormActive(false))
  }

  return (
    <Form
      form={form}
      onFinish={handleSubmit}
      style={{ marginTop: '8px' }}
      requiredMark="optional"
    >
      <Space size={'middle'}>
        <Form.Item
          name="title"
          label="Video Title"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          rules={[
            {
              required: true,
              message: 'Please valid url',
              type: 'url',
            },
          ]}
          name="url"
          label="Video url"
        >
          <Input />
        </Form.Item>
        <Form.Item>
          <Button onClick={handleCancel}>Cancel</Button>
        </Form.Item>
        <Form.Item>
          <Button onClick={form.submit} type="primary">
            Submit
          </Button>
        </Form.Item>
      </Space>
    </Form>
  )
}

const ModuleItemForm = ({ instructorAccess, addModuleItem, loadingUpload }) => {
  const [formActive, setFormActive] = useState(false)
  const [moduleItemType, setModuleItemType] = useState('video')

  const handleCancel = () => setFormActive(false)

  // if (!instructorAccess) return null

  return (
    <>
      {!formActive && (
        <div style={{ marginTop: '16px' }}>
          <Button icon={<PlusOutlined />} onClick={() => setFormActive(true)}>
            Add Item
          </Button>
        </div>
      )}
      {formActive && (
        <>
          <div
            style={{
              paddingBottom: '16px',
              borderBottom: '0px',
              marginTop: '16px',
            }}
          >
            <Radio.Group
              defaultValue="video"
              buttonStyle="solid"
              value={moduleItemType}
              onChange={(e) => setModuleItemType(e.target.value)}
            >
              <Radio.Button value="video">Video</Radio.Button>
              <Radio.Button value="file">File</Radio.Button>
            </Radio.Group>
          </div>
          {moduleItemType === 'video' && (
            <VideoForm
              addModuleItem={addModuleItem}
              handleCancel={handleCancel}
              setFormActive={setFormActive}
            />
          )}
          {moduleItemType === 'file' && (
            <FileForm
              addModuleItem={addModuleItem}
              handleCancel={handleCancel}
              loadingUpload={loadingUpload}
              setFormActive={setFormActive}
            />
          )}
        </>
      )}
    </>
  )
}

export default ModuleItemForm
