import React from 'react'
import { Tag } from 'antd'
import {
  TrophyOutlined,
  StarOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons'
import './achieved-skills.scss'

const AchievedSkills = ({ mySkills = [] }) => {
  if (!mySkills || mySkills.length === 0) {
    return (
      <div className="achieved-skills-section">
        <div className="skills-header">
          <TrophyOutlined className="skills-icon" />
          <h3>Acquired Skills</h3>
        </div>
        <div className="no-skills-message">
          <p>
            Complete courses to unlock new skills and showcase your expertise!
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="achieved-skills-section">
      <div className="skills-header">
        <TrophyOutlined className="skills-icon" />
        <h3>Acquired Skills</h3>
      </div>

      <div className="skills-content">
        <div className="skills-description">
          <p>Skills you've mastered from completed courses:</p>
        </div>

        <div className="skills-list">
          {mySkills.map((skill, index) => (
            <Tag
              key={index}
              color="purple"
              style={{
                padding: '4px 10px',
                borderRadius: '16px',
                fontSize: '14px',
              }}
            >
              {skill}
            </Tag>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AchievedSkills
