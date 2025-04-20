import React from 'react'
import { Typography } from 'antd'
import {
  CheckCircleFilled,
  LockOutlined,
  PlayCircleFilled,
  ClockCircleOutlined,
  RightCircleFilled,
  PlaySquareOutlined,
  FilePdfOutlined,
} from '@ant-design/icons'
import { formatTime } from '@helpers/common'
import './LectureItem.scss'

const LectureItem = ({
  lecture,
  highlight,
  onChooseLecture,
  ItemIcon,
  itemType,
  durationField,
  isLatestUnlocked = false,
  courseCompleted = false,
}) => {
  const accessible = lecture.unlocked === true
  const isCompleted = (courseCompleted || !isLatestUnlocked) && accessible

  const getClassNames = () => {
    let classNames = 'lecture-item'
    if (highlight) classNames += ' lecture-item--highlighted'
    if (!accessible) classNames += ' lecture-item--locked'
    if (isCompleted) classNames += ' lecture-item--completed'
    return classNames
  }

  const getIconClassNames = () => {
    let classNames = 'lecture-item__icon'
    if (itemType === 'video') classNames += ' lecture-item__icon--video'
    if (itemType === 'file') classNames += ' lecture-item__icon--file'
    return classNames
  }

  const getStatusIcon = () => {
    if (!accessible) {
      return (
        <div className="status-icon status-icon--locked">
          <LockOutlined />
        </div>
      )
    }

    if (isCompleted) {
      return (
        <div className="status-icon status-icon--completed">
          <CheckCircleFilled />
        </div>
      )
    }

    if (isLatestUnlocked) {
      return (
        <div className="status-icon status-icon--current">
          <RightCircleFilled />
        </div>
      )
    }

    return null
  }

  const handleClick = () => {
    if (accessible) {
      onChooseLecture(lecture.module_id, lecture.module_item_id)
    }
  }

  const getDuration = () => {
    if (itemType === 'video') {
      return lecture[durationField]
    } else if (itemType === 'file') {
      return formatTime(lecture[durationField])
    }
    return '00:00:00'
  }

  const duration = getDuration()

  return (
    <div
      className={getClassNames()}
      onClick={handleClick}
      role="button"
      tabIndex={0}
    >
      <div className={getIconClassNames()}>
        <ItemIcon />
      </div>

      <div className="lecture-item__content">
        <Typography.Text className="lecture-item__content-title">
          {lecture.title}
        </Typography.Text>

        <div className="lecture-item__content-meta">
          <span className="meta-item">
            <ClockCircleOutlined />
            {duration}
          </span>

          {itemType === 'video' && (
            <span className="meta-item">
              <PlayCircleFilled />
              Video
            </span>
          )}

          {itemType === 'file' && (
            <span className="meta-item">
              <FilePdfOutlined />
              PDF
            </span>
          )}
        </div>
      </div>

      <div className="lecture-item__status">{getStatusIcon()}</div>
    </div>
  )
}

export default React.memo(LectureItem)
