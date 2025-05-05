import React from 'react'
import { Empty } from 'antd'
import { DragOutlined } from '@ant-design/icons'

const EmptyCourseState = ({ readOnly }) => {
  return (
    <div className="empty-course-list">
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={
          readOnly
            ? 'No courses in this learning path yet.'
            : 'Drag and drop courses here to create a learning path.'
        }
      >
        {!readOnly && (
          <div className="empty-drag-hint">
            <DragOutlined style={{ marginRight: 8 }} />
            Select courses from the left panel
          </div>
        )}
      </Empty>
    </div>
  )
}

export default EmptyCourseState
