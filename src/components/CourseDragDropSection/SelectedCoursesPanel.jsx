import React from 'react'
import { Empty, Tag, Button, Card, Space, Badge, Divider } from 'antd'
import {
  DeleteOutlined,
  OrderedListOutlined,
  DragOutlined,
  BookOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons'
import { Draggable, DragDropContext } from 'react-beautiful-dnd'
import StrictModeDroppable from './StrictModeDroppable'
import { calculateTotalHours } from '@helpers/common'
import './SelectedCoursesPanel.scss'

const SelectedCoursesPanel = ({ selectedCourses, setSelectedCourses }) => {
  console.log('SelectedCoursesPanel', selectedCourses)
  const totalHours = calculateTotalHours(selectedCourses)

  const handleRemoveCourse = (courseId) => {
    setSelectedCourses(
      selectedCourses.filter((course) => course.id !== courseId),
    )
  }

  const handleDragEnd = (result) => {
    if (!result.destination) return

    const items = Array.from(selectedCourses)
    const [removed] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, removed)

    setSelectedCourses(items)
  }

  return (
    <div className="selected-courses-wrapper">
      <Card
        title={
          <div className="selected-courses-header">
            <Space>
              <OrderedListOutlined />
              <span>Selected Courses</span>
              <Badge
                count={selectedCourses.length}
                style={{
                  backgroundColor: selectedCourses.length
                    ? '#52c41a'
                    : '#d9d9d9',
                }}
              />
            </Space>

            {selectedCourses.length > 0 && (
              <span className="drag-instruction">
                <DragOutlined /> Drag to reorder
              </span>
            )}
          </div>
        }
        className="selected-courses-card"
      >
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="selected-courses-container">
            {selectedCourses.length === 0 ? (
              <Empty description="No courses selected yet" />
            ) : (
              <StrictModeDroppable droppableId="selected-courses">
                {(provided) => (
                  <div
                    className="courses-droppable"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {selectedCourses.map((course, index) => (
                      <Draggable
                        key={course.id}
                        draggableId={`course-${course.id}`}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`draggable-course-item ${
                              snapshot.isDragging ? 'dragging' : ''
                            }`}
                          >
                            <div className="course-order">{index + 1}</div>
                            <div className="course-content">
                              <div className="course-title">
                                <span>{course.title}</span>
                                <Tag color="blue">{course.category}</Tag>
                              </div>
                              <div className="course-duration">
                                <ClockCircleOutlined /> {course.duration} hours
                              </div>
                            </div>
                            <Button
                              type="text"
                              danger
                              icon={<DeleteOutlined />}
                              onClick={() => handleRemoveCourse(course.id)}
                              className="remove-course-btn"
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </StrictModeDroppable>
            )}
          </div>
        </DragDropContext>

        {selectedCourses.length > 0 && (
          <div className="course-summary-wrapper">
            <Divider style={{ margin: '16px 0' }} />
            <div className="courses-summary">
              <Space size="large">
                <div className="summary-item">
                  <BookOutlined className="summary-icon" />
                  <span className="summary-text">
                    {selectedCourses.length}{' '}
                    {selectedCourses.length === 1 ? 'Course' : 'Courses'}
                  </span>
                </div>

                <div className="summary-item">
                  <ClockCircleOutlined className="summary-icon" />
                  <span className="summary-text">
                    {totalHours > 0 ? `${totalHours} hours` : 'No duration'}
                  </span>
                </div>
              </Space>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}

export default SelectedCoursesPanel
