import React, { useState, useEffect } from 'react'
// import { useSelector, useDispatch } from 'react-redux'

import { Typography, Button, Modal, Form, Input, List } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { FlexSectionHeader } from 'views/style'

// import { STUDENT } from '../../constants/userRoles'
import ModuleList from './components/ModuleList'

// import {
//   getAllModules,
//   createModule,
//   updateModule,
//   deleteModule,
//   createModuleItem,
//   deleteModuleItem,
//   clearModules
// } from '../../reducers/moduleReducer'

// import useCoursePrivilege from '../../hooks/useCourseprivilege'
const randomHex = () => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16)
}
const Modules = (props) => {
  const { Title } = Typography

  // const modules = useSelector((state) => state.modules)
  // const { enrolled, privilege } = useCoursePrivilege()
  const [modules, setModules] = useState([
    {
      id: 1,
      title: 'Tuần 1',
      moduleItems: [
        {
          id: 1,
          title: 'video 1',
          type: 'video',
          url: 'https://www.youtube.com/',
        },
        {
          id: 2,
          title: 'file 1',
          type: 'file',
          url: 'http:/123',
        },
        {
          id: 3,
          title: 'video 3',
          type: 'video',
          url: 'https://www.youtube.com/',
        },
      ],
    },
  ]);


  const addModule = (module) => {
    setModules((prevModules) => [...prevModules, { ...module, id: modules.length + 1 }]);
    setAddModalActive(false)
    form.resetFields()
  };

  const editModule = (moduleId, module) => {
    console.log(moduleId, module);
    setModules((prevModules) =>
      prevModules.map((item) =>
        item.id === moduleId ? { ...item, ...module } : item
      )
    )
  }

  const removeModule = (moduleId) => {
    setModules((prevModules) =>
      prevModules.filter((item) => item.id !== moduleId)
    );
  }

  // const { courseId } = props.match.params
  const courseId = 1

  // const dispatch = useDispatch()

  // useEffect(() => {
  //   dispatch(getAllModules(courseId))

  //   return () => dispatch(clearModules())
  // }, [courseId, dispatch])


  const addModuleItem = (moduleId, moduleItem) => {
    setModules((prevModules) =>
      prevModules.map((module) => {
        if (module.id === moduleId) {
          return {
            ...module,
            moduleItems: Array.isArray(module.moduleItems)
              ? [...module.moduleItems, moduleItem]
              : [moduleItem],
          };
        }
        return module;
      })
    );
  };

  const removeModuleItem = (moduleId, moduleItem) => {
    setModules((prevModules) =>
      prevModules.map((module) =>
        module.id === moduleId
          ? {
            ...module,
            moduleItems: module.moduleItems.filter(
              (item) => item !== moduleItem
            ),
          }
          : module
      )
    );
  }

  const [addModalActive, setAddModalActive] = useState(false)
  const [form] = Form.useForm()

  const handleCancel = () => {
    setAddModalActive(false)
  }

  return (
    <React.Fragment>
      <FlexSectionHeader>
        <Title level={3}>Modules</Title>
        {/* {enrolled && privilege !== STUDENT && ( */}
        <Button
          onClick={() => setAddModalActive(true)}
          type="dashed"
          shape="round"
          icon={<PlusOutlined />}
        >
          Add Module
        </Button>
        {/* )} */}
      </FlexSectionHeader>

      <Modal
        title="Add New Module"
        visible={addModalActive}
        onOk={form.submit}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
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
          onFinish={addModule}
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
        <List
          dataSource={modules}
          renderItem={(module) => (
            <List.Item>
              <ModuleList
                module={module}
                // instructorAccess={privilege !== STUDENT}
                editModule={(updatedModule) =>
                  editModule(module.id, updatedModule)
                }
                removeModule={removeModule}
                addModuleItem={(moduleItem) =>
                  addModuleItem(module.id, moduleItem)
                }
                removeModuleItem={(moduleItem) =>
                  removeModuleItem(module.id, moduleItem)
                }
              />
            </List.Item>
          )}
        />
      </div>
    </React.Fragment>
  )
}

export default Modules
