import React from 'react'
import { Typography, List } from 'antd'
import {
  CheckCircleFilled,
  LockOutlined,
  PlaySquareOutlined,
  FilePdfOutlined,
} from '@ant-design/icons'
import { formatTime } from '@helpers/common'

const styles = {
  listItem: (accessible, highlight) => ({
    cursor: accessible ? 'pointer' : 'not-allowed',
    justifyContent: 'space-between',
    overflowX: 'hidden',
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    opacity: accessible ? 1 : 0.5,
    padding: '8px 12px',
    borderRadius: '4px',
    marginBottom: '4px',
    ...(highlight && {
      backgroundColor: '#e6f7ff',
      borderLeft: '3px solid #1890ff',
      transition: 'all 0.3s',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.09)',
    }),
  }),
  content: {
    flex: 1,
    marginRight: '10px',
  },
  title: (highlight) => ({
    fontSize: '14px',
    color: highlight ? '#1890ff' : 'inherit',
    display: 'block',
    marginBottom: '2px',
    fontWeight: highlight ? 600 : 400,
    whiteSpace: 'normal',
    wordBreak: 'break-word',
  }),
  metaContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  icon: (highlight) => ({
    fontSize: '12px',
    marginRight: '4px',
    color: highlight ? '#1890ff' : '#8c8c8c',
  }),
  statusIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
  },
  timeText: {
    fontSize: '12px',
  },
}

// Media configuration moved inside LectureItem
const mediaConfig = {
  video: {
    icon: PlaySquareOutlined,
    durationField: 'duration',
    formatter: (value) => value,
  },
  file: {
    icon: FilePdfOutlined,
    durationField: 'required_time',
    formatter: formatTime,
  },
}

const LectureItem = ({
  lecture,
  highlight,
  onChooseLecture,
  isLatestUnlocked = false,
  courseCompleted = false,
}) => {
  const accessible = lecture.unlocked === true

  // Determine type, icon, and duration field from lecture
  const type = lecture.item_type
  const config = mediaConfig[type] || mediaConfig.video
  const ItemIcon = config.icon
  const durationField = config.durationField
  const formatValue = config.formatter

  const handleClick = () => {
    if (accessible) {
      onChooseLecture(lecture.module_id, lecture.module_item_id)
    }
  }

  return (
    <List.Item
      onClick={handleClick}
      style={styles.listItem(accessible, highlight)}
      aria-disabled={!accessible}
      role="button"
      key={`${type}-${lecture.id}-${highlight}`}
    >
      <div style={styles.content}>
        <Typography.Text style={styles.title(highlight)} strong={highlight}>
          {lecture.title}
        </Typography.Text>
        <div style={styles.metaContainer}>
          <ItemIcon style={styles.icon(highlight)} />
          <Typography.Text type="secondary" style={styles.timeText}>
            {formatValue(lecture[durationField])}
          </Typography.Text>
        </div>
      </div>

      <div style={styles.statusIcon}>
        {accessible ? (
          (courseCompleted || !isLatestUnlocked) && (
            <CheckCircleFilled
              style={{ color: '#52c41a', fontSize: '18px' }}
              aria-label="Completed content"
            />
          )
        ) : (
          <LockOutlined
            style={{ color: '#faad14' }}
            aria-label="Locked content"
          />
        )}
      </div>
    </List.Item>
  )
}

export default React.memo(LectureItem)
