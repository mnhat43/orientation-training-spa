import React from 'react'
import {
  Card,
  Tag,
  Typography,
  Button,
  Statistic,
  Row,
  Col,
  Divider,
} from 'antd'
import {
  SaveOutlined,
  ScheduleOutlined,
  BookOutlined,
  AppstoreOutlined,
} from '@ant-design/icons'
import { CATEGORIES, CATEGORY_COLORS } from '@constants/categories'

const { Title } = Typography

const InfoSummaryColumn = ({ selectedCourses, onNext }) => {
  const totalHours = selectedCourses.reduce((sum, course) => {
    const durationMatch = course.duration?.match(/(\d+)/)
    return sum + (durationMatch ? parseInt(durationMatch[1], 10) : 0)
  }, 0)

  const uniqueCategories = Array.from(
    new Set(selectedCourses.map((c) => c.category)),
  )

  return (
    <>
      <Card
        title={
          <span>
            <ScheduleOutlined style={{ marginRight: 8 }} />
            Learning Path Summary
          </span>
        }
      >
        <Row gutter={16}>
          <Col span={12}>
            <Statistic
              title="Total Courses"
              value={selectedCourses.length}
              prefix={<BookOutlined />}
            />
          </Col>
          <Col span={12}>
            <Statistic
              title="Estimated Duration"
              value={totalHours}
              suffix="hours"
              prefix={<ScheduleOutlined />}
            />
          </Col>
        </Row>

        <Divider />

        {selectedCourses.length > 0 && (
          <div>
            <Title level={5}>
              <AppstoreOutlined style={{ marginRight: 8 }} />
              Included Categories
            </Title>
            <div style={{ marginTop: 8 }}>
              {uniqueCategories.map((category) => (
                <Tag
                  key={category}
                  color={CATEGORY_COLORS[category] || 'blue'}
                  style={{
                    marginBottom: 8,
                    fontSize: '14px',
                    padding: '4px 8px',
                  }}
                >
                  {CATEGORIES[category] || category}
                </Tag>
              ))}
            </div>
          </div>
        )}
      </Card>
    </>
  )
}

export default InfoSummaryColumn
