import React from 'react'
import { Button, Avatar, Tag } from 'antd'
import {
  FireOutlined,
  TrophyOutlined,
  RocketOutlined,
  CrownOutlined,
  StarOutlined,
  BookOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons'
import { CATEGORY_COLORS } from '@constants'
import './next-action.scss'
import { formatTime } from '@helpers/common'

const NextAction = ({ allCompleted, nextCourse, navigate }) => {
  return (
    <div className="next-action-section">
      {!allCompleted ? (
        <>
          <div className="next-course-header">
            <FireOutlined className="fire-icon" />
            <span>Continue Your Learning</span>
          </div>

          <div className="next-course-content">
            <div className="course-preview">
              <Avatar
                shape="square"
                size={64}
                src={
                  nextCourse.thumbnail
                    ? `data:image/jpeg;base64,${nextCourse.thumbnail}`
                    : null
                }
                icon={!nextCourse.thumbnail && <BookOutlined />}
                className="course-avatar"
              />
              <div className="course-info">
                <h4 className="course-title">{nextCourse.title}</h4>
                <Tag color={CATEGORY_COLORS[nextCourse.category] || 'blue'}>
                  {nextCourse.category}
                </Tag>
                <div className="course-meta">
                  <span className="duration">
                    <ClockCircleOutlined /> {formatTime(nextCourse.duration)}
                  </span>
                </div>
              </div>
            </div>
            <Button
              type="primary"
              size="large"
              block
              icon={<RocketOutlined />}
              onClick={() =>
                navigate(`/course/${nextCourse.course_id}/lectures`)
              }
              className="start-button"
            >
              Start Now
            </Button>
          </div>
        </>
      ) : (
        <div className="all-completed">
          <div className="completed-header">
            <TrophyOutlined className="trophy-icon" />
            <span>Mission Accomplished!</span>
          </div>
          <div className="completed-content">
            <div className="trophy-container">
              <CrownOutlined className="crown-icon" />
            </div>
            <h3>All Courses Completed!</h3>
            <p>
              Congratulations on completing your learning path. You've mastered
              all the required skills.
            </p>
            <Button type="primary" icon={<StarOutlined />}>
              View Certificate
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default NextAction
