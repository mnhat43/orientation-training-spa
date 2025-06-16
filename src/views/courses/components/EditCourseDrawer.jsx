import React, { useState, useEffect } from 'react'
import {
  Drawer,
  Form,
  Input,
  Upload,
  Button,
  Select,
  Typography,
  Row,
  Col,
  message,
  Space,
} from 'antd'
import { PlusOutlined, InfoCircleOutlined } from '@ant-design/icons'
import './AddCourseDrawer.scss'
import skillkeywordApi from '@api/skillkeyword'

const { Option } = Select
const { Text, Title } = Typography
const { TextArea } = Input

const EditCourseDrawer = ({
  isDrawerOpen,
  setIsDrawerOpen,
  handleEditCourse,
  course,
}) => {
  const [form] = Form.useForm()
  const [skillKeywords, setSkillKeywords] = useState([])
  const [selectedKeywords, setSelectedKeywords] = useState([])
  const [newKeywordInput, setNewKeywordInput] = useState('')
  const [isAddingKeyword, setIsAddingKeyword] = useState(false)
  useEffect(() => {
    if (isDrawerOpen) {
      loadSkillKeywords()
    }
  }, [isDrawerOpen])

  useEffect(() => {
    if (isDrawerOpen && course && skillKeywords.length > 0) {
      populateForm()
    }
  }, [isDrawerOpen, course, skillKeywords])
  const populateForm = () => {
    if (course) {
      form.setFieldsValue({
        title: course.title,
        description: course.description,
        category: course.category,
      })

      let keywordIds = []
      if (course.skill_keyword_ids) {
        keywordIds = course.skill_keyword_ids
      } else if (course.skill_keyword) {
        if (Array.isArray(course.skill_keyword)) {
          if (typeof course.skill_keyword[0] === 'string') {
            keywordIds = skillKeywords
              .filter((sk) => course.skill_keyword.includes(sk.name))
              .map((sk) => sk.id)
          } else {
            keywordIds = course.skill_keyword
          }
        }
      }

      setSelectedKeywords(keywordIds)

      if (course.thumbnail) {
        form.setFieldsValue({
          thumbnail: [
            {
              uid: '-1',
              name: 'thumbnail.jpg',
              status: 'done',
              url: course.thumbnail,
            },
          ],
        })
      }
    }
  }

  const loadSkillKeywords = async () => {
    try {
      const response = await skillkeywordApi.list()
      if (response && response.data) {
        setSkillKeywords(response.data)
      }
    } catch (error) {
      console.error('Error loading skill keywords:', error)
      message.error('Failed to load skill keywords')
    }
  }

  const handleCreateKeyword = async () => {
    if (!newKeywordInput.trim()) {
      message.warning('Please enter keyword name')
      return
    }

    try {
      setIsAddingKeyword(true)
      const response = await skillkeywordApi.create({
        name: newKeywordInput.trim(),
      })

      if (response && response.data) {
        message.success('Keyword created successfully')
        setNewKeywordInput('')
        loadSkillKeywords()
        const newKeyword = response.data
        if (newKeyword && !selectedKeywords.includes(newKeyword.id)) {
          setSelectedKeywords([...selectedKeywords, newKeyword.id])
        }
      }
    } catch (error) {
      console.error('Error creating keyword:', error)
      message.error('Failed to create new keyword')
    } finally {
      setIsAddingKeyword(false)
    }
  }

  const handleKeywordSelect = (value) => {
    setSelectedKeywords(value)
  }

  const handleRemoveKeyword = (keywordId) => {
    setSelectedKeywords(selectedKeywords.filter((id) => id !== keywordId))
  }

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e
    }
    return e?.fileList
  }
  const handleSubmit = () => {
    // Validate course data
    if (!course || !course.course_id) {
      message.error('Course data is missing')
      console.error('Course data is invalid:', course)
      return
    }

    form
      .validateFields()
      .then((values) => {
        const courseData = {
          ...values,
          course_id: course.course_id,
          skill_keyword_ids: selectedKeywords,
        }
        console.log('Submitting course data:', courseData)
        handleEditCourse(courseData)
        handleDrawerClose()
      })
      .catch((info) => {
        console.log('Validate Failed:', info)
      })
  }

  const handleDrawerClose = () => {
    setIsDrawerOpen(false)
    form.resetFields()
    setSelectedKeywords([])
    setNewKeywordInput('')
  }

  return (
    <Drawer
      title={
        <div className="add-course-drawer-header">
          <Title level={4} style={{ margin: 0 }}>
            Edit Training Course
          </Title>
          <Text type="secondary">Update details for your training course</Text>
        </div>
      }
      placement="right"
      width={720}
      open={isDrawerOpen}
      onClose={handleDrawerClose}
      className="add-course-drawer"
      destroyOnClose={true}
      maskClosable={true}
      footer={
        <div className="drawer-footer">
          <Space>
            <Button onClick={handleDrawerClose}>Cancel</Button>
            <Button type="primary" onClick={handleSubmit}>
              Update Course
            </Button>
          </Space>
        </div>
      }
    >
      <Form
        form={form}
        layout="vertical"
        name="edit_course_form"
        requiredMark={false}
        className="course-form"
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="title"
              label="Title"
              rules={[{ required: true, message: 'Please enter a title' }]}
            >
              <Input placeholder="Enter course title" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="category"
              label="Category"
              rules={[{ required: true, message: 'Please select a category' }]}
              tooltip={{
                title: 'Categorize to help trainees find relevant content',
                icon: <InfoCircleOutlined />,
              }}
            >
              <Select placeholder="Select category">
                <Option value="Onboarding">Onboarding Essentials</Option>
                <Option value="Company">Company Policies</Option>
                <Option value="Technical">Technical Skills</Option>
                <Option value="Soft">Soft Skills</Option>
                <Option value="Compliance">Compliance</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="description"
              label="Description"
              tooltip={{
                title: 'Helps trainees understand what they will learn',
                icon: <InfoCircleOutlined />,
              }}
            >
              <TextArea
                placeholder="Brief description (optional)"
                rows={4}
                showCount
                maxLength={500}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="thumbnail"
              label="Thumbnail"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              extra="Add an image to make your course visually appealing"
            >
              <Upload
                listType="picture-card"
                maxCount={1}
                beforeUpload={() => false}
                className="course-thumbnail-upload"
              >
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              </Upload>
            </Form.Item>
          </Col>
        </Row>

        {/* Skill Keywords Section */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Skill Keywords"
              tooltip={{
                title:
                  'Select keywords to categorize the skills of this course',
                icon: <InfoCircleOutlined />,
              }}
            >
              <div className="skill-keywords-section">
                <Select
                  mode="multiple"
                  placeholder="Select skill keywords"
                  value={selectedKeywords}
                  onChange={handleKeywordSelect}
                  style={{ width: '100%' }}
                  showSearch
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {skillKeywords.map((keyword) => (
                    <Option key={keyword.id} value={keyword.id}>
                      {keyword.name}
                    </Option>
                  ))}
                </Select>
              </div>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Or Create New Keyword">
              <div className="create-keyword-section">
                <Space.Compact style={{ display: 'flex' }}>
                  <Input
                    placeholder="Enter new keyword name"
                    value={newKeywordInput}
                    onChange={(e) => setNewKeywordInput(e.target.value)}
                    onPressEnter={handleCreateKeyword}
                    style={{ flex: 1 }}
                  />
                  <Button
                    type="primary"
                    ghost
                    icon={<PlusOutlined />}
                    onClick={handleCreateKeyword}
                    loading={isAddingKeyword}
                    disabled={!newKeywordInput.trim()}
                  >
                    Add
                  </Button>
                </Space.Compact>
              </div>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Drawer>
  )
}

export default EditCourseDrawer
