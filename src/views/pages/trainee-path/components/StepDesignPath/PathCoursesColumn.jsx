import React from 'react'
import { Card, Button, Divider } from 'antd'
import { FileTextOutlined, AppstoreAddOutlined } from '@ant-design/icons'
import DragComponent from './DragComponent'

const PathCoursesColumn = ({
  selectedCourses,
  setSelectedCourses,
  setTemplateDrawerVisible,
  setCourseDrawerVisible,
}) => {
  return (
    <Card
      title={
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>
            <FileTextOutlined style={{ marginRight: 8 }} />
            Learning Path Courses
          </span>
        </div>
      }
      extra={
        <>
          <Button
            type="primary"
            ghost
            icon={<FileTextOutlined />}
            onClick={() => setTemplateDrawerVisible(true)}
            style={{ marginRight: 8 }}
          >
            Apply Template
          </Button>
          <Button
            type="primary"
            icon={<AppstoreAddOutlined />}
            onClick={() => setCourseDrawerVisible(true)}
          >
            Add Courses
          </Button>
        </>
      }
    >
      <DragComponent
        selectedCourses={selectedCourses}
        setSelectedCourses={setSelectedCourses}
      />
    </Card>
  )
}

export default PathCoursesColumn
