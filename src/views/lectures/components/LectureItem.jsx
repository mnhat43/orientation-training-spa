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
  moduleItem,
  module_id,
  highlight,
  onSelectLecture,
  isLatestUnlocked,
  courseCompleted,
}) => {
  const { unlocked, item_type, module_item_id, module_item_title, content } =
    moduleItem
  const isCompleted = (courseCompleted || !isLatestUnlocked) && unlocked

  const getClassNames = () => {
    let classNames = 'lecture-item'
    if (highlight) classNames += ' lecture-item--highlighted'
    if (!unlocked) classNames += ' lecture-item--locked'
    if (isCompleted) classNames += ' lecture-item--completed'
    return classNames
  }

  const getDuration = () => {
    if (item_type === 'video') return formatTime(content.duration)
    if (item_type === 'file') return formatTime(content.duration)
    if (item_type === 'quiz') return formatTime(content.time_limit)
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
      onSelectLecture({
        moduleId: module_id,
        moduleItemId: module_item_id,
        navigate: true,
      })
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
          {module_item_title}
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
