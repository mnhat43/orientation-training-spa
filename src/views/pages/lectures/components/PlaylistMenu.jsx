import React, { memo, useState, useMemo } from 'react'
import { List, Typography, Divider, Progress } from 'antd'
import {
  PlaySquareOutlined,
  FilePdfOutlined,
  BookOutlined,
  CaretRightOutlined,
  CaretDownOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  BarChartOutlined,
  TrophyOutlined,
} from '@ant-design/icons'
import LectureItem from './LectureItem'
import CompletionModule from './CompletionModule'
import { formatTime } from '@helpers/common'
import './PlaylistMenu.scss'

// Media configuration for different content types
const mediaConfig = {
  video: {
    icon: PlaySquareOutlined,
    durationField: 'duration',
  },
  file: {
    icon: FilePdfOutlined,
    durationField: 'required_time',
  },
}

// Helper function to convert time string (HH:MM:SS) to seconds
const timeStringToSeconds = (timeString) => {
  if (!timeString) return 0

  // Split the time string by colons
  const parts = timeString.split(':')

  // Handle different formats (HH:MM:SS or MM:SS)
  if (parts.length === 3) {
    // HH:MM:SS format
    return (
      parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2])
    )
  } else if (parts.length === 2) {
    // MM:SS format
    return parseInt(parts[0]) * 60 + parseInt(parts[1])
  }

  // If invalid format, return 0
  return 0
}

const PlaylistMenu = ({
  courseId,
  lectures,
  allLectures,
  selectedLecture,
  latestUnlockedLecture,
  courseCompleted,
  isVideoPlaying,
  isLatestUnlocked,
  isLastLecture,
  onChooseLecture,
  onCompleteCourse,
  onCompleteLecture,
  onViewCertificate,
  activeCertificate,
}) => {
  // State to track which weeks are expanded
  const [expandedWeeks, setExpandedWeeks] = useState(() =>
    selectedLecture
      ? [selectedLecture.week_name]
      : Object.keys(lectures).slice(0, 1),
  )

  // Get the week name of the selected lecture
  const selectedWeek = selectedLecture?.week_name

  // Calculate course progress
  const calculateProgress = () => {
    const totalLectures = allLectures?.length || 0
    if (totalLectures === 0) return 0

    let completedLectures

    if (courseCompleted) {
      // If course is completed, count all unlocked lectures
      completedLectures = allLectures.filter(
        (lecture) => lecture.unlocked,
      ).length
    } else {
      // Otherwise, don't count the latest unlocked lecture
      completedLectures = allLectures.filter(
        (lecture) => lecture.unlocked && lecture !== latestUnlockedLecture,
      ).length
    }

    return Math.round((completedLectures / totalLectures) * 100)
  }

  const progress = calculateProgress()

  // Calculate completed lectures count
  const completedLecturesCount = useMemo(() => {
    if (courseCompleted) {
      return allLectures.filter((lecture) => lecture.unlocked).length
    } else {
      return allLectures.filter(
        (lecture) => lecture.unlocked && lecture !== latestUnlockedLecture,
      ).length
    }
  }, [allLectures, courseCompleted, latestUnlockedLecture])

  // Calculate week durations
  const weekDurations = useMemo(() => {
    const durations = {}

    Object.keys(lectures).forEach((week) => {
      durations[week] = lectures[week].reduce((total, lecture) => {
        // For videos, duration is in HH:MM:SS format, convert to seconds
        if (lecture.item_type === 'video') {
          return total + timeStringToSeconds(lecture.duration)
        }
        // For files, required_time is already in seconds
        if (lecture.item_type === 'file') {
          return total + (parseInt(lecture.required_time) || 0)
        }
        return total
      }, 0)
    })

    return durations
  }, [lectures])

  // Toggle week expansion
  const toggleWeek = (week) => {
    setExpandedWeeks((prev) =>
      prev.includes(week) ? prev.filter((w) => w !== week) : [...prev, week],
    )
  }

  return (
    <div className="playlist-menu">
      <div className="playlist-header">
        <Typography.Title level={1} className="playlist-header__title">
          Playlist lectures
        </Typography.Title>

        <div className="playlist-header__stats">
          <div className="compact-stats">
            <Progress
              type="circle"
              percent={progress}
              width={32}
              strokeWidth={3}
              format={(percent) => `${percent}%`}
              strokeColor={{
                '0%': '#1890ff',
                '50%': '#52c41a',
                '100%': '#faad14',
              }}
            />
            <span className="lessons-count">
              {completedLecturesCount}/{allLectures?.length || 0}{' '}
              <span className="lessons-label">Lessons</span>
            </span>

            {courseCompleted && (
              <CompletionModule
                courseCompleted={courseCompleted}
                onViewCertificate={onViewCertificate}
                activeCertificate={activeCertificate}
                compact={true}
              />
            )}
          </div>
        </div>
      </div>

      <div className="week-cards">
        {Object.keys(lectures).map((week) => {
          const isExpanded = expandedWeeks.includes(week)
          const completedInWeek = lectures[week].filter(
            (lecture) =>
              lecture.unlocked &&
              (courseCompleted || lecture !== latestUnlockedLecture),
          ).length
          const totalInWeek = lectures[week].length
          const weekDuration = formatTime(weekDurations[week] || 0)
          const isActiveWeek = week === selectedWeek

          return (
            <div
              className={`week-card ${isActiveWeek ? 'week-card--active' : ''}`}
              key={week}
            >
              <div
                className="week-card__header"
                onClick={() => toggleWeek(week)}
              >
                <h3 className="week-card__header-title">
                  <span>{week}</span>
                  {/* Moved caret icon to the right using absolute positioning */}
                  <span className={`caret-icon ${isExpanded ? 'open' : ''}`}>
                    <CaretDownOutlined />
                  </span>
                </h3>
                <div className="week-card__header-info">
                  <span className="week-card__header-text">
                    {completedInWeek}/{totalInWeek}{' '}
                    <span className="separator">|</span> {weekDuration}
                  </span>
                </div>
              </div>

              {isExpanded && (
                <div className="week-card__content">
                  <List
                    dataSource={lectures[week]}
                    renderItem={(lecture) => {
                      const highlighted =
                        lecture === selectedLecture && !activeCertificate
                      const isLatestUnlockedLecture =
                        lecture === latestUnlockedLecture
                      const type = lecture.item_type
                      const config = mediaConfig[type]

                      return (
                        <LectureItem
                          key={`${type}-${lecture.module_item_id}`}
                          lecture={lecture}
                          highlight={highlighted}
                          onChooseLecture={onChooseLecture}
                          ItemIcon={config.icon}
                          itemType={type}
                          durationField={config.durationField}
                          isLatestUnlocked={isLatestUnlockedLecture}
                          courseCompleted={courseCompleted}
                        />
                      )
                    }}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default memo(PlaylistMenu)
