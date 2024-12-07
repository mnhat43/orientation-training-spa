import { useState } from 'react';
import { Modal, Form, Input, Button, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import './AddCourseForm.scss';

const AddCourseForm = ({ setIsModalOpen, handleAddCourse }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail] = useState(null);

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };



  return (
    <Modal
      title="Add New Course"
      visible={true}
      onCancel={() => setIsModalOpen(false)}
      footer={[
        <Button key="cancel" onClick={() => setIsModalOpen(false)}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" htmlType="submit" form="addCourseForm">
          Add
        </Button>
      ]}
      className="add-course-modal"
      destroyOnClose={true}
    >
      <Form
        id="addCourseForm"
        onFinish={handleAddCourse}
        layout="horizontal"
        initialValues={{ title, description, thumbnail }}
      >
        {/* Course Title */}
        <Form.Item
          label="Title"
          name="course_title"
          rules={[{ required: true, message: 'Please enter the course title!' }]}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
        >
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter the title of the course"
          />
        </Form.Item>

        {/* Course Description */}
        <Form.Item
          label="Description"
          name="course_description"
          rules={[{ message: 'Please enter a description for the course!' }]}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
        >
          <Input.TextArea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Enter the course description"
          />
        </Form.Item>

        {/* Thumbnail Upload */}
        <Form.Item
          name="course_thumbnail"
          label="Thumbnail"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
        >
          <Upload
            name="logo"
            listType="picture"
            beforeUpload={() => false}
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Click to upload</Button>
          </Upload>
        </Form.Item>

        {/* Display Uploaded Thumbnail */}
        {thumbnail && (
          <Form.Item
            label="Uploaded Thumbnail"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
          >
            <img src={thumbnail} alt="Thumbnail Preview" style={{ width: 100, height: 100 }} />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default AddCourseForm;
