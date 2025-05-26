import React from 'react'
import { Progress } from 'antd'
import {
  CheckCircleOutlined,
  BookOutlined,
  RightCircleOutlined,
} from '@ant-design/icons'
import './progress-stats.scss'

const ProgressStats = ({ userProgress, totalCourses }) => {
  return (
    <div className="progress-section">
      <h3>Your Learning Journey</h3>

      <div className="progress-wrapper">
        <div className="progress-circle-container">
          <Progress
            type="circle"
            percent={Math.round(userProgress.progressPercentage)}
            width={90}
            strokeColor={{
              '0%': '#108ee9',
              '100%': '#87d068',
            }}
            format={(percent) => (
              <div className="progress-text">
                <span className="percent">{percent}%</span>
              </div>
            )}
          />
        </div>

        <div className="progress-info">
          <div className="progress-stat">
            <div className="stat-label">Completed</div>
            <div className="stat-value">
              <CheckCircleOutlined /> {userProgress.totalCompleted}
            </div>
          </div>
          <div className="progress-stat">
            <div className="stat-label">Total Courses</div>
            <div className="stat-value">
              <BookOutlined /> {totalCourses}
            </div>
          </div>
          <div className="progress-stat">
            <div className="stat-label">Remaining</div>
            <div className="stat-value">
              <RightCircleOutlined />{' '}
              {totalCourses - userProgress.totalCompleted}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProgressStats
