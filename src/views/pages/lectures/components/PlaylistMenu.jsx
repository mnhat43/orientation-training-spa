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
import { formatTime } from '@helpers/common'
import './PlaylistMenu.scss'
import _ from 'lodash'

const PlaylistMenu = ({
  lectures,
  selectedLecture,
  lastUnlockedLecture,
  courseCompleted,
  onSelectLecture,
}) => {
  const [expandedModules, setExpandedModules] = useState([])

  const progressData = useMemo(() => {
    const allLectures = lectures.flatMap((module) => module.lecture)
    const totalLectures = allLectures?.length

    const completedLectures = allLectures.filter((lecture) => {
      if (courseCompleted) {
        return lecture.unlocked === true
      } else {
        return lecture.unlocked === true && lecture !== lastUnlockedLecture
      }
    }).length

    return {
      percent: Math.round((completedLectures / totalLectures) * 100),
      completedLectures: completedLectures,
      totalLectures: totalLectures,
    }
  }, [lectures, courseCompleted, lastUnlockedLecture])

  const { percent, completedLectures, totalLectures } = progressData

  const toggleModule = (moduleId) => {
    setExpandedModules((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId],
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
            <strong>{lectures.length}</strong> Modules
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
        {lectures.map((module) => {
          const { module_id, lecture, module_title, duration } = module
          const isExpanded = expandedModules.includes(module_id)

          const completedInModule = lecture.filter(
            (item) =>
              item.unlocked &&
              (courseCompleted || item !== lastUnlockedLecture),
          ).length
          const totalInModule = lecture.length

          return (
            <div
              className={`module-item ${completedInModule === totalInModule ? 'module-completed' : ''}`}
              key={module_id}
            >
              <div
                className="module-header"
                onClick={() => toggleModule(module_id)}
              >
                <div className="module-details">
                  <div className="module-title">
                    <span className="module-name">{module_title}</span>
                    {completedInModule === totalInModule && (
                      <span className="completion-tag">Completed</span>
                    )}
                  </div>
                  <div className="module-subtitle">
                    <span className="completion-indicator">
                      {completedInModule}/{totalInModule}
                    </span>
                    <span className="subtitle-separator">|</span>
                    <span className="time-indicator">
                      <ClockCircleOutlined /> {formatTime(duration)}
                    </span>
                  </div>
                </div>

                <div className={`toggle-icon ${isExpanded ? 'expanded' : ''}`}>
                  <RightOutlined />
                </div>
              </div>

              <div className={`module-content ${isExpanded ? 'expanded' : ''}`}>
                <List
                  dataSource={lecture}
                  renderItem={(item) => {
                    return (
                      <LectureItem
                        key={item.module_item_id}
                        moduleItem={item}
                        module_id={module_id}
                        highlight={_.isEqual(item, selectedLecture)}
                        onSelectLecture={onSelectLecture}
                        isLatestUnlocked={_.isEqual(item, lastUnlockedLecture)}
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
