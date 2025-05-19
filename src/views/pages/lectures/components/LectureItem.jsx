import React from 'react'
import { Typography } from 'antd'
import {
  CheckCircleFilled,
  LockOutlined,
  PlayCircleFilled,
  ClockCircleOutlined,
  RightCircleFilled,
  FilePdfOutlined,
  FileTextOutlined,
} from '@ant-design/icons'
import './LectureItem.scss'
import { formatTime } from '@helpers/common'

const LectureItem = ({
  lecture,
  highlight,
  onChooseLecture,
  isLatestUnlocked,
  courseCompleted,
}) => {
  const {
    unlocked,
    duration,
    quiz_data,
    item_type,
    module_id,
    module_item_id,
    title,
  } = lecture
  const isCompleted = (courseCompleted || !isLatestUnlocked) && unlocked

  const getClassNames = () => {
    let classNames = 'lecture-item'
    if (highlight) classNames += ' lecture-item--highlighted'
    if (!unlocked) classNames += ' lecture-item--locked'
    if (isCompleted) classNames += ' lecture-item--completed'
    return classNames
  }

  const getDuration = () => {
    if (item_type === 'video') return duration
    if (item_type === 'file') return duration
    if (item_type === 'quiz') return formatTime(quiz_data.time_limit)
    return null
  }

  const getMetaItem = () => {
    if (item_type === 'video')
      return (
        <>
          <PlayCircleFilled /> Video
        </>
      )
    if (item_type === 'file')
      return (
        <>
          <FilePdfOutlined /> File
        </>
      )
    if (item_type === 'quiz')
      return (
        <>
          <FileTextOutlined /> Quiz
        </>
      )
    return null
  }

  const getStatusIcon = () => {
    if (!unlocked) {
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
    if (unlocked) {
      onChooseLecture(module_id, module_item_id)
    }
  }

  return (
    <div
      className={getClassNames()}
      onClick={handleClick}
      role="button"
      tabIndex={0}
    >
      <div className="lecture-item__content">
        <Typography.Text className="lecture-item__content-title">
          {title}
        </Typography.Text>

        <div className="lecture-item__content-meta">
          <span className="meta-item">
            <ClockCircleOutlined />
            {getDuration()}
          </span>
          <span className="meta-item">{getMetaItem()}</span>
        </div>
      </div>

      <div className="lecture-item__status">{getStatusIcon()}</div>
    </div>
  )
}

export default React.memo(LectureItem)
