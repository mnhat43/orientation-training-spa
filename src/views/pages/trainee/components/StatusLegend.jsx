import React from 'react'
import { Typography, Tooltip, Button } from 'antd'
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  WarningOutlined,
} from '@ant-design/icons'

const { Text } = Typography

// Note: This component is no longer used directly in the parent component
// We've replaced it with a more interactive inline legend
// Keeping this file for reference or future use
const StatusLegend = ({
  pendingReviewsCount,
  onShowPendingReviews,
  isShowingPendingOnly,
}) => {
  return (
    <div className="status-legend">
      <div className="legend-group">
        <div className="legend-group-title">Status Indicators:</div>
        <div className="legend-items">
          <div className="legend-item completed">
            <div className="indicator-dot"></div>
            <CheckCircleOutlined />
            <span>Completed</span>
          </div>
          <div className="legend-item in-progress">
            <div className="indicator-dot"></div>
            <ClockCircleOutlined />
            <span>In Progress</span>
          </div>
          <div className="legend-item needs-review">
            <div className="indicator-dot"></div>
            <WarningOutlined />
            <span>Needs Review</span>
            {pendingReviewsCount > 0 && (
              <Button
                type="link"
                size="small"
                onClick={onShowPendingReviews}
                className="show-pending-link"
              >
                {isShowingPendingOnly ? 'Show All' : 'Show Only'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatusLegend
