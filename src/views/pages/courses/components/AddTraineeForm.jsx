import React, { useState, useEffect } from 'react'
import { Modal, Form, Select, Button, Spin, Empty } from 'antd'
import { UserAddOutlined } from '@ant-design/icons'
import { toast } from 'react-toastify'

const { Option } = Select

const AddTraineeForm = ({
  isModalOpen,
  setIsModalOpen,
  courseId,
  handleAddTrainees,
}) => {
  const [form] = Form.useForm()
  const [trainees, setTrainees] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchAvailableTrainees()
  }, [courseId])

  const fetchAvailableTrainees = async () => {
    try {
      setLoading(true)
      // This would be replaced with an actual API call
      // const response = await fetch('/api/trainees?exclude_course=' + courseId);
      // const data = await response.json();

      // Mock data for now
      const mockData = [
        { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
        { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com' },
        { id: 3, name: 'Michael Johnson', email: 'michael.j@example.com' },
        { id: 4, name: 'Emily Wilson', email: 'emily.w@example.com' },
      ]

      setTrainees(mockData)
    } catch (error) {
      toast.error('Error loading trainees')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleFinish = (values) => {
    handleAddTrainees(values)
  }

  const handleCancel = () => {
    form.resetFields()
    setIsModalOpen(false)
  }

  return (
    <Modal
      title="Add Trainees to Course"
      open={isModalOpen}
      onCancel={handleCancel}
      footer={null}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{ trainees: [] }}
      >
        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <Spin />
            <p style={{ marginTop: '10px' }}>Loading trainees...</p>
          </div>
        ) : trainees.length > 0 ? (
          <Form.Item
            name="trainees"
            label="Select Trainees"
            rules={[
              { required: true, message: 'Please select at least one trainee' },
            ]}
          >
            <Select
              mode="multiple"
              placeholder="Select trainees to add to this course"
              optionFilterProp="children"
              style={{ width: '100%' }}
              allowClear
            >
              {trainees.map((trainee) => (
                <Option key={trainee.id} value={trainee.id}>
                  {trainee.name} ({trainee.email})
                </Option>
              ))}
            </Select>
          </Form.Item>
        ) : (
          <Empty
            description="No available trainees found"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}

        <div style={{ textAlign: 'right', marginTop: '20px' }}>
          <Button onClick={handleCancel} style={{ marginRight: '8px' }}>
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            icon={<UserAddOutlined />}
            disabled={loading || trainees.length === 0}
          >
            Add Trainees
          </Button>
        </div>
      </Form>
    </Modal>
  )
}

export default AddTraineeForm
