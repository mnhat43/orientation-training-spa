import React from 'react'
import { List, Card, Badge, Typography, Tag } from 'antd'
import { ClockCircleOutlined } from '@ant-design/icons'
import './CourseList.scss'

const { Text, Paragraph } = Typography

const CourseList = ({ courses }) => {
  return (
    <List
      className="courses-list"
      itemLayout="vertical"
      dataSource={courses}
      renderItem={(course, index) => (
        <Card className="course-card-material" key={course.id} bordered={true}>
          <div className="card-left">
            <Badge
              count={index + 1}
              className="course-number-badge"
              overflowCount={999}
            />
          </div>

          <div className="card-content">
            <div className="card-header">
              <Text strong className="course-title">
                {course.title}
              </Text>
            </div>

            {course.description && (
              <Paragraph
                ellipsis={{
                  rows: 2,
                  expandable: true,
                  symbol: 'more',
                }}
                className="course-description"
              >
                {course.description}
              </Paragraph>
            )}

            <div className="card-meta">
              <div className="meta-item">
                <Tag color="blue" className="category-tag">
                  {course.category}
                </Tag>
              </div>
              <div className="meta-item">
                <ClockCircleOutlined />
                <span>{course.duration}</span>
              </div>
            </div>
          </div>
        </Card>
      )}
    />
  )
}

export default CourseList
