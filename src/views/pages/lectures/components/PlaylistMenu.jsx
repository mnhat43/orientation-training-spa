import React, { memo, useState, useMemo } from 'react'
import { List, Tooltip } from 'antd'
import {
  RightOutlined,
  BookOutlined,
  CheckCircleFilled,
  ClockCircleOutlined,
  ReadOutlined,
} from '@ant-design/icons'
import LectureItem from './LectureItem'
import { formatTime, timeStringToSeconds } from '@helpers/common'
import './PlaylistMenu.scss'

const PlaylistMenu = ({
  lectures,
  selectedLecture,
  latestUnlockedLecture,
  courseCompleted,
  onChooseLecture,
}) => {
  const allLectures = useMemo(() => Object.values(lectures).flat(), [lectures])
  const [expandedLectureModules, setExpandedLectureModules] = useState(
    Object.keys(lectures).slice(0, 0),
  )

  const progressData = useMemo(() => {
    const totalLectures = allLectures?.length || 0
    if (totalLectures === 0)
      return { percent: 0, completedLectures: 0, totalLectures: 0 }

    const completedLectures = allLectures.filter((lecture) => {
      if (courseCompleted) {
        return lecture.unlocked === true
      } else {
        return lecture.unlocked === true && lecture !== latestUnlockedLecture
      }
    }).length

    return {
      percent: Math.round((completedLectures / totalLectures) * 100),
      completedLectures: completedLectures,
      totalLectures: totalLectures,
    }
  }, [allLectures, courseCompleted, latestUnlockedLecture])

  const { percent, completedLectures, totalLectures } = progressData

  const weekDurations = useMemo(() => {
    const durations = {}

    Object.keys(lectures).forEach((week) => {
      durations[week] = lectures[week].reduce((total, lecture) => {
        if (lecture.item_type === 'video') {
          return total + timeStringToSeconds(lecture.duration)
        }
        if (lecture.item_type === 'file') {
          return total + (parseInt(lecture.required_time) || 0)
        }
        return total
      }, 0)
    })

    return durations
  }, [lectures])

  const toggleModule = (week) => {
    setExpandedLectureModules((prev) =>
      prev.includes(week) ? prev.filter((lm) => lm !== week) : [...prev, week],
    )
  }

  return (
    <div className="playlist-menu-alt">
      <div className="sidebar-header">
        <div className="course-info">
          <ReadOutlined className="course-icon" />
          <div className="course-title">
            <h2>Course Content</h2>
            <div className="course-progress">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${percent}%` }}
                ></div>
              </div>
              <span>{percent}% Complete</span>
            </div>
          </div>
        </div>

        {courseCompleted && (
          <Tooltip title="Course completed">
            <div className="completion-indicator">
              <CheckCircleFilled />
            </div>
          </Tooltip>
        )}
      </div>

      <div className="content-summary">
        <div className="summary-item">
          <BookOutlined />
          <span>
            <strong>{Object.keys(lectures).length}</strong> Modules
          </span>
        </div>
        <div className="summary-item">
          <ClockCircleOutlined />
          <span>
            <strong>
              {completedLectures}/{totalLectures}
            </strong>{' '}
            Lessons
          </span>
        </div>
      </div>

      <div className="module-list">
        {Object.keys(lectures).map((week) => {
          const isExpanded = expandedLectureModules.includes(week)

          const completedInWeek = lectures[week].filter(
            (lecture) =>
              lecture.unlocked &&
              (courseCompleted || lecture !== latestUnlockedLecture),
          ).length
          const totalInWeek = lectures[week].length

          const weekDuration = formatTime(weekDurations[week] || 0)

          return (
            <div
              className={`module-item ${completedInWeek === totalInWeek ? 'module-completed' : ''}`}
              key={week}
            >
              <div className="module-header" onClick={() => toggleModule(week)}>
                <div className="module-details">
                  <div className="module-title">
                    <span className="module-name">{week}</span>
                    {completedInWeek === totalInWeek && (
                      <span className="completion-tag">Completed</span>
                    )}
                  </div>
                  <div className="module-subtitle">
                    <span className="completion-indicator">
                      {completedInWeek}/{totalInWeek}
                    </span>
                    <span className="subtitle-separator">|</span>
                    <span className="time-indicator">
                      <ClockCircleOutlined /> {weekDuration}
                    </span>
                  </div>
                </div>

                <div className={`toggle-icon ${isExpanded ? 'expanded' : ''}`}>
                  <RightOutlined />
                </div>
              </div>

              <div className={`module-content ${isExpanded ? 'expanded' : ''}`}>
                <List
                  dataSource={lectures[week]}
                  renderItem={(lecture) => {
                    return (
                      <LectureItem
                        lecture={lecture}
                        highlight={lecture === selectedLecture}
                        onChooseLecture={onChooseLecture}
                        isLatestUnlocked={lecture === latestUnlockedLecture}
                        courseCompleted={courseCompleted}
                      />
                    )
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default memo(PlaylistMenu)
