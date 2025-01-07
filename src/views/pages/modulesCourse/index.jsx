import React, { useState, useEffect } from 'react'
import { Typography, Button, Modal, Form, Input, List, Spin } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useParams } from 'react-router-dom'
import { FlexSectionHeader } from '@views/style'
import ModuleList from './components/ModuleList'
import module from '@api/module'
import moduleItem from '@api/moduleItem'
import { toast } from 'react-toastify'

const Modules = () => {
  const { Title } = Typography
  const { courseId } = useParams()
  const [addModalActive, setAddModalActive] = useState(false)
  const [form] = Form.useForm()
  const [modules, setModules] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchModules()
  }, [courseId])

  const fetchModules = async () => {
    setLoading(true)
    try {
      const response = await module.getListModuleDetail({ course_id: parseInt(courseId) })
      if (response.status == 200) {
        const sortedModules = response.data.data.modules.sort((a, b) => a.module_id - b.module_id)
        setModules(sortedModules)
      }

    } catch (err) {
      setError('Failed to fetch modules')
      toast.error('Failed to fetch modules')
    } finally {
      setLoading(false)
    }
  }

  const handleAddModule = async (value) => {
    setLoading(true)
    try {
      const response = await module.addModule({ course_id: parseInt(courseId), title: value.title })
      if (response.status == 200) {
        fetchModules()
      }

    } catch (err) {
      toast.error('Failed to add module')
    } finally {
      form.resetFields()
      setAddModalActive(false)
      setLoading(false)
    }
  }

  const handleRemoveModule = async (moduleId) => {
    setLoading(true)
    try {
      const response = await module.deleteModule({ module_id: parseInt(moduleId) })
      if (response.status == 200) {
        fetchModules()
      }
    } catch (err) {
      toast.error('Failed to delete module')
    } finally {
      setLoading(false)
    }
  }

  const editModule = (moduleId, module) => {
    console.log(moduleId, module)
    setModules((prevModules) =>
      prevModules.map((item) =>
        item.id === moduleId ? { ...item, ...module } : item
      )
    )
  }

  // const fetchModuleItemList = async (moduleId) => {
  //   try {
  //     const response = await moduleItem.getModuleItemList({ "module_id": moduleId });
  //     if (response.status === 200) {
  //       console.log(response.data);
  //     } else {
  //       toast.error('Error: ' + response.data.message);
  //     }
  //   } catch (error) {
  //     toast.error('Error: ' + error.message);
  //   }
  // }

  const addModuleItem = async (moduleId, formData) => {
    formData.append('module_id', moduleId);
    try {
      const response = await moduleItem.addModuleItem(formData);
      if (response.status === 200) {
        toast.success(`${formData.get('item_type')} added successfully!`);
        // fetchModuleItemList(moduleId);
        fetchModules()
      } else {
        toast.error('Error: ' + response.data.message);
      }
    } catch (error) {
      toast.error('Error: ' + error.message);
    }
  }

  const removeModuleItem = async (id) => {
    try {
      const response = await moduleItem.deleteModuleItem({ "moduleItem_id": id });
      if (response.status === 200) {
        toast.success(`Deleted successfully!`);
        fetchModules()
      } else {
        toast.error('Error: ' + response.data.message);
      }
    } catch (error) {
      toast.error('Error: ' + error.message);
    }
  }

  return (
    <React.Fragment>
      <FlexSectionHeader>
        <Title level={3}>Modules</Title>
        <Button
          onClick={() => setAddModalActive(true)}
          type="dashed"
          shape="round"
          icon={<PlusOutlined />}
        >
          Add Module
        </Button>
      </FlexSectionHeader>

      <Modal
        title="Add New Module"
        visible={addModalActive}
        onOk={form.submit}
        onCancel={() => setAddModalActive(false)}
        footer={[
          <Button key="cancel" onClick={() => setAddModalActive(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={form.submit}>
            Submit
          </Button>
        ]}
      >
        <Form
          name="add Module"
          form={form}
          onFinish={handleAddModule}
          requiredMark={false}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
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
            <Input placeholder="Module Name" />
          </Form.Item>
        </Form>
      </Modal>

      <div style={{ marginTop: '16px' }}>
        {loading ? (
          <Spin size="large" />
        ) : error ? (
          <Typography.Text type="danger">{error}</Typography.Text>
        ) : (
          <List
            dataSource={modules}
            renderItem={(module) => (
              <List.Item>
                <ModuleList
                  module={module}
                  editModule={(updatedModule) => editModule(module.module_id, updatedModule)}
                  removeModule={handleRemoveModule}
                  addModuleItem={(moduleItem) => addModuleItem(module.module_id, moduleItem)}
                  removeModuleItem={(moduleItem) => removeModuleItem(moduleItem.ID)}
                />
              </List.Item>
            )}
          />
        )}
      </div>
    </React.Fragment>
  )
}

export default Modules
