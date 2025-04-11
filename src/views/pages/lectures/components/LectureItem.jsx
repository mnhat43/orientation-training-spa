import React from 'react'
import { Typography, List } from 'antd'
import { CheckCircleFilled, LockOutlined } from '@ant-design/icons'
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
  },
  title: (highlight) => ({
    fontSize: '14px',
    color: highlight ? '#1890ff' : 'inherit',
    display: 'block',
    marginBottom: '2px',
    fontWeight: highlight ? 600 : 400,
    wordBreak: 'break-word',
    whiteSpace: 'normal',
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
    margin: '0 8px',
  },
  timeText: {
    fontSize: '12px',
  },
}

const LectureItem = ({
  lecture,
  highlight,
  chooseLecture,
  ItemIcon,
  itemType,
  durationField,
}) => {
  const accessible = lecture.unlocked === true

  const handleClick = () => {
    if (accessible) {
      chooseLecture(lecture.module_id, lecture.id)
    }
  }

  // Display time based on field type
  const displayTime = () => {
    if (durationField === 'required_time') {
      return formatTime(lecture[durationField])
    }
    return lecture[durationField]
  }

  return (
    <List.Item
      onClick={handleClick}
      style={styles.listItem(accessible, highlight)}
      aria-disabled={!accessible}
      role="button"
      key={`${itemType}-${lecture.id}-${highlight}`}
    >
      <div style={styles.content}>
        <Typography.Paragraph
          style={styles.title(highlight)}
          strong={highlight}
        >
          {lecture.title}
        </Typography.Paragraph>
        <div style={styles.metaContainer}>
          <ItemIcon style={styles.icon(highlight)} />
          <Typography.Text type="secondary" style={styles.timeText}>
            {displayTime()}
          </Typography.Text>
        </div>
      </div>

      {accessible ? (
        <CheckCircleFilled style={{ ...styles.statusIcon, color: '#52c41a' }} />
      ) : (
        <LockOutlined
          style={{ ...styles.statusIcon, color: '#faad14' }}
          aria-label="Locked content"
        />
      )}
    </List.Item>
  )
}

export default React.memo(LectureItem)
