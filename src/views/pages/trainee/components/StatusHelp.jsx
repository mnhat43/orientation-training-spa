import React from 'react'
import { Tooltip, Button } from 'antd'
import {
  InfoCircleOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  WarningOutlined,
} from '@ant-design/icons'

const StatusHelp = ({
  pendingReviewsCount,
  activeTab,
  onShowPendingReviews,
}) => {
  const statusHelpContent = (
    <div className="status-tooltip-content">
      <div className="status-help-item">
        <div className="status-indicator completed">
          <div className="dot"></div>
          <CheckCircleOutlined />
          <span>Completed</span>
        </div>
        <div className="status-description">
          Courses that have been successfully finished by the trainee with
          passing grades.
        </div>
      </div>

      <div className="status-help-item">
        <div className="status-indicator in-progress">
          <div className="dot"></div>
          <ClockCircleOutlined />
          <span>In Progress</span>
        </div>
        <div className="status-description">
          Courses that have been started but not yet completed by the trainee.
        </div>
      </div>

      <div className="status-help-item">
        <div className="status-indicator needs-review">
          <div className="dot"></div>
          <WarningOutlined />
          <span>Needs Review</span>
        </div>
        <div className="status-description">
          Courses completed by the trainee and awaiting your review.
          {pendingReviewsCount > 0 && (
            <Button
              type="link"
              size="small"
              onClick={() => {
                onShowPendingReviews()
                // Close the tooltip after clicking
                document.body.click()
              }}
              className="filter-link"
            >
              {activeTab === 'pending-review'
                ? 'Show all trainees'
                : `Show ${pendingReviewsCount} pending reviews`}
            </Button>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <Tooltip
      title={statusHelpContent}
      color="#fff"
      overlayClassName="status-tooltip"
      trigger="click"
      placement="bottomLeft"
      overlayStyle={{ maxWidth: '400px' }}
    >
      <InfoCircleOutlined className="status-help-icon" />
    </Tooltip>
  )
}

export default StatusHelp
