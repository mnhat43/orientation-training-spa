import React from 'react'
import { Button } from 'antd'
import { TrophyOutlined } from '@ant-design/icons'
import './CompletionModule.scss'

const CompletionModule = ({
  courseCompleted,
  onViewCertificate,
  activeCertificate,
  compact = false,
}) => {
  if (!courseCompleted) return null

  if (compact) {
    return (
      <div
        className="mini-certificate"
        onClick={onViewCertificate}
        title="View your certificate"
      >
        <TrophyOutlined />
        <span>Certificate</span>
      </div>
    )
  }

  return (
    <div className="completion-wrapper">
      <div className="completion-banner">
        <div className="completion-trophy">
          <TrophyOutlined />
        </div>
        <div className="completion-text">
          <h4>Course Completed!</h4>
          <p>Congratulations on finishing this course.</p>
        </div>
        <Button
          type="primary"
          className="completion-button"
          onClick={onViewCertificate}
        >
          {activeCertificate ? 'Hide Certificate' : 'View Certificate'}
        </Button>
      </div>
    </div>
  )
}

export default CompletionModule
