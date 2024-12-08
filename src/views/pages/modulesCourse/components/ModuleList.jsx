import {
  Collapse,
  List,
  Space,
  Button,
  Typography,
  Form,
  Modal,
  Input
} from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { useState } from 'react'
import ModuleItem from './ModuleItem'
import ModuleItemForm from './ModuleItemForm'

const ModuleList = (props) => {
  const {
    module,
    // instructorAccess,
    editModule,
    removeModule,
    addModuleItem,
    removeModuleItem
  } = props

  const [editModalActive, setEditModalActive] = useState(false)
  const [form] = Form.useForm()

  // const loadingUpload = module.loadingUpload
  const handleCancel = () => {
    setEditModalActive(false)
  }

  const handleOk = () => {
    form.validateFields()
      .then((values) => {
        editModule(values);
        setEditModalActive(false);
        form.resetFields();
      })
  };


  return (
    <>
      <Modal
        title="Edit Module"
        visible={editModalActive}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            Submit
          </Button>
        ]}
      >
        <Form
          name="edit Module"
          form={form}
          onFinish={editModule}
          requiredMark={false}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          initialValues={{
            title: ''
          }}
        >
          <Form.Item
            name="title"
            label="Course Module"
            rules={[
              {
                required: true,
                message: 'Please enter the module name'
              }
            ]}
          >
            <Input placeholder="New Module Name" />
          </Form.Item>
        </Form>
      </Modal >

      <Collapse
        style={{
          borderRadius: '10px',
          width: '100%',
          fontSize: '16px',
          border: '0px'
        }}
        defaultActiveKey={['1']}
        expandIconPosition={'left'}
      >
        <Collapse.Panel
          header={<Typography.Text strong>{module.module_title}</Typography.Text>}
          bordered={false}
          key="1"
          extra={
            // instructorAccess && (
            <Space
              onClick={(event) => {
                // If you don't want click extra trigger collapse, you can prevent this:
                event.stopPropagation()
              }}
            >
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => {
                  setEditModalActive(true)
                }}
              />
              <Button
                type="text"
                icon={<DeleteOutlined />}
                danger
                onClick={() => removeModule(module.module_id)}
              />
            </Space>
            // )
          }
        >
          <List
            locale={{ emptyText: 'no items' }}
            dataSource={module.module_items}
            renderItem={(item) => (
              <ModuleItem
                removeModuleItem={removeModuleItem}
                item={item}
              // instructorAccess={instructorAccess}
              />
            )}
          />
          <ModuleItemForm
            addModuleItem={addModuleItem}
          // instructorAccess={instructorAccess}
          // loadingUpload={loadingUpload}
          />
        </Collapse.Panel>
      </Collapse>
    </>
  )
}

export default ModuleList
