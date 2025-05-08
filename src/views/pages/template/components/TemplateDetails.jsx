import React from 'react'
import { Typography, Tag, Divider, Drawer } from 'antd'
import { BookOutlined, InfoCircleOutlined } from '@ant-design/icons'
import CourseList from '@components/CourseList'
import './TemplateDetails.scss'

const { Title, Paragraph } = Typography

const mockCourses = [
  {
    id: 1,
    title: 'Introduction to HTML & CSS',
    description:
      'Learn the fundamentals of HTML5 and CSS3 for web development.',
    category: 'Web Development',
    duration: '12 hours',
  },
  {
    id: 2,
    title: 'JavaScript Basics',
    description:
      'Understanding JavaScript syntax, variables, functions and control structures.',
    category: 'Web Development',
    duration: '16 hours',
  },
  {
    id: 3,
    title: 'React Fundamentals',
    description: 'Learn component-based UI development with React.',
    category: 'Web Development',
    duration: '20 hours',
  },
  {
    id: 4,
    title: 'Responsive Web Design',
    description: 'Create websites that look great on any device.',
    category: 'Web Development',
    duration: '8 hours',
  },
]

const TemplateDetails = ({ template, drawerVisible, setDrawerVisible }) => {
  if (!template) return null

  const courses = mockCourses

  return (
    <Drawer
      title={null}
      placement="right"
      closable={true}
      onClose={() => setDrawerVisible(false)}
      visible={drawerVisible}
      width={450}
      className="template-drawer"
      styles={{ header: { display: 'none' } }}
    >
      <div className="template-details-container">
        <div className="detail-header">
          <Title level={4}>{template.name}</Title>
        </div>

        <div className="detail-content">
          <div className="content-section description-section">
            <div className="section-header">
              <Title level={5}>
                <InfoCircleOutlined /> Description
              </Title>
            </div>
            <Paragraph className="description-text">
              {template.description || 'No description provided.'}
            </Paragraph>
          </div>

          <Divider style={{ margin: '12px 0' }} />

          <div className="content-section courses-section">
            <div className="section-header">
              <Title level={5}>
                <BookOutlined /> Courses ({courses.length})
              </Title>
            </div>

            <div className="courses-list-container">
              <CourseList courses={courses} />
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  )
}

export default TemplateDetails
