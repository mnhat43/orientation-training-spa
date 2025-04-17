import React from 'react'
import { Typography, List, Tag } from 'antd'
import {
  SafetyCertificateOutlined,
  LockOutlined,
  CheckCircleFilled,
  TrophyOutlined,
} from '@ant-design/icons'

// Simplified styles for better responsiveness
const styles = {
  moduleContainer: {
    marginTop: '12px',
    borderTop: '1px solid #e8e8e8',
    paddingTop: '12px',
    marginBottom: '8px',
  },
  certificateHeader: {
    fontSize: '12px',
    color: '#8c8c8c',
    margin: '0 0 6px 4px',
    display: 'flex',
    alignItems: 'center',
  },
  headerIcon: {
    marginRight: '6px',
    fontSize: '12px',
    color: '#faad14',
  },
  listItem: (accessible, highlight) => ({
    cursor: accessible ? 'pointer' : 'not-allowed',
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    opacity: accessible ? 1 : 0.6,
    padding: '8px 10px',
    borderRadius: '4px',
    marginBottom: '4px',
    border: accessible ? '1px solid #e8e8e8' : '1px dashed #d9d9d9',
    transition: 'all 0.3s ease',
    background: accessible ? (highlight ? '#e6f7ff' : '#f6ffed') : '#f5f5f5',
    ...(highlight && {
      borderLeft: '3px solid #1890ff',
      boxShadow: '0 2px 8px rgba(24, 144, 255, 0.15)',
    }),
  }),
  content: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    minWidth: 0, // Prevent flex items from overflowing
  },
  title: (highlight, accessible) => ({
    fontSize: '14px',
    color: highlight ? '#1890ff' : accessible ? '#52c41a' : 'inherit',
    fontWeight: highlight || accessible ? 600 : 400,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }),
  metaContainer: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '2px',
  },
  icon: (highlight, accessible) => ({
    fontSize: '12px',
    marginRight: '4px',
    color: highlight ? '#1890ff' : accessible ? '#52c41a' : '#8c8c8c',
    flexShrink: 0,
  }),
  badgeText: {
    fontSize: '12px',
    color: '#8c8c8c',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  statusContainer: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: '8px',
    flexShrink: 0,
  },
  statusTag: (accessible) => ({
    marginRight: '6px',
    fontSize: '10px',
    lineHeight: '16px',
    padding: '0 4px',
    height: 'auto',
    background: accessible ? '#52c41a' : '#d9d9d9',
    color: '#fff',
  }),
  statusIcon: {
    fontSize: '16px',
    flexShrink: 0,
  },
}

const CompletionModule = ({
  courseCompleted,
  onViewCertificate,
  courseTitle,
  activeCertificate,
}) => {
  const handleClick = () => {
    if (courseCompleted) {
      onViewCertificate()
    }
  }

  return (
    <div style={styles.moduleContainer}>
      <div style={styles.certificateHeader}>
        <TrophyOutlined style={styles.headerIcon} />
        <Typography.Text>COURSE ACHIEVEMENT</Typography.Text>
      </div>

      <List.Item
        onClick={handleClick}
        style={styles.listItem(courseCompleted, activeCertificate)}
        aria-disabled={!courseCompleted}
        role="button"
      >
        <div style={styles.content}>
          <Typography.Text
            style={styles.title(activeCertificate, courseCompleted)}
            strong={activeCertificate || courseCompleted}
          >
            Certificate of Completion
          </Typography.Text>
          <div style={styles.metaContainer}>
            <SafetyCertificateOutlined
              style={styles.icon(activeCertificate, courseCompleted)}
            />
            <Typography.Text type="secondary" style={styles.badgeText}>
              {courseCompleted
                ? 'View your certificate'
                : 'Complete all lectures to unlock'}
            </Typography.Text>
          </div>
        </div>

        <div style={styles.statusContainer}>
          {courseCompleted && (
            <Tag
              style={styles.statusTag(courseCompleted)}
              color={activeCertificate ? 'blue' : 'success'}
            >
              {activeCertificate ? 'VIEWING' : 'COMPLETED'}
            </Tag>
          )}

          <div style={styles.statusIcon}>
            {courseCompleted ? (
              <CheckCircleFilled
                style={{
                  color: activeCertificate ? '#1890ff' : '#52c41a',
                }}
                aria-label="Certificate available"
              />
            ) : (
              <LockOutlined
                style={{ color: '#faad14' }}
                aria-label="Certificate locked"
              />
            )}
          </div>
        </div>
      </List.Item>
    </div>
  )
}

export default React.memo(CompletionModule)
