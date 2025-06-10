import React, { useEffect } from 'react'
import { Modal, Form, Input, Typography } from 'antd'
import PropTypes from 'prop-types'

const ModuleForm = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
  title = 'Add New Module',
}) => {
  const [form] = Form.useForm()

  useEffect(() => {
    if (visible) {
      form.resetFields()
      if (initialValues) {
        form.setFieldsValue(initialValues)
      }
    }
  }, [visible, initialValues, form])

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        onSubmit(values)
        form.resetFields()
      })
      .catch((info) => {
        console.log('Validate Failed:', info)
      })
  }

  return (
    <Modal
      title={
        <Typography.Title level={4} style={{ margin: 0 }}>
          {title}
        </Typography.Title>
      }
      open={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      okText="Submit"
      cancelText="Cancel"
      destroyOnClose
      width={window.innerWidth < 576 ? '95%' : 520}
      centered
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        requiredMark={false}
      >
        <Form.Item
          name="title"
          label="Module Title"
          rules={[
            {
              required: true,
              message: 'Please enter the module title',
            },
          ]}
        >
          <Input placeholder="Enter module title" autoFocus />
        </Form.Item>
      </Form>
    </Modal>
  )
}

ModuleForm.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
  title: PropTypes.string,
}

export default ModuleForm
