import React, { memo, useCallback, useMemo } from 'react'
import { List, Typography, Collapse, Space } from 'antd'
import { PlaySquareOutlined, FilePdfOutlined } from '@ant-design/icons'
import LectureItem from './LectureItem'
import LearningTimer from './LearningTimer'
import userprogress from '@api/userprogress'

const { Panel } = Collapse

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

const playlistStyle = {
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  paddingBottom: '16px',
}

const collapseStyle = {
  flexGrow: 1,
  overflowY: 'auto',
}

const PlaylistMenu = ({
  lectures,
  selectedLecture,
  chooseLecture,
  isLatestUnlocked,
  courseId,
  allLectures,
  onProgressUpdate,
  isVideoPlaying,
}) => {
  const isSelected = useCallback(
    (lecture) => {
      if (!selectedLecture) return false
      return (
        parseInt(lecture.module_item_id) ===
          parseInt(selectedLecture.module_item_id) &&
        parseInt(lecture.module_id) === parseInt(selectedLecture.module_id)
      )
    },
    [selectedLecture],
  )

  // Find the module containing the selected lecture to auto-open that panel
  const getDefaultActiveKey = useMemo(() => {
    if (!selectedLecture) return [Object.keys(lectures)[0]]

    for (const week in lectures) {
      const found = lectures[week].some(
        (lecture) =>
          lecture.module_item_id === selectedLecture.module_item_id &&
          lecture.module_id === selectedLecture.module_id,
      )
      if (found) return [week]
    }
    return [Object.keys(lectures)[0]]
  }, [lectures, selectedLecture])

  // Find the latest unlocked lecture (highest module_id and module_item_id)
  const latestUnlockedLecture = useMemo(() => {
    let latest = null

    // Flatten all lectures from all weeks
    const allLectures = Object.values(lectures).flat()

    // Filter only unlocked lectures
    const unlockedLectures = allLectures.filter(
      (lecture) => lecture.unlocked === true,
    )

    if (unlockedLectures.length === 0) return null

    // Find the one with highest module_id and module_item_id
    latest = unlockedLectures.reduce((highest, current) => {
      if (!highest) return current

      // Compare module_id first
      if (parseInt(current.module_id) > parseInt(highest.module_id))
        return current
      if (parseInt(current.module_id) < parseInt(highest.module_id))
        return highest

      // If module_id is equal, compare module_item_id
      if (parseInt(current.module_item_id) > parseInt(highest.module_item_id))
        return current
      return highest
    }, null)

    return latest
  }, [lectures])

  // Function to check if a lecture is the latest unlocked one
  const isLectureLatestUnlocked = (lecture) => {
    if (!latestUnlockedLecture) return false
    return (
      parseInt(lecture.module_id) ===
        parseInt(latestUnlockedLecture.module_id) &&
      parseInt(lecture.module_item_id) ===
        parseInt(latestUnlockedLecture.module_item_id)
    )
  }

  // Handle lecture completion
  const handleLectureComplete = useCallback(
    async (completionData) => {
      try {
        const { userId, courseId, modulePosition, moduleItemPosition } =
          completionData

        const response = await userprogress.updateUserProgress({
          user_id: userId,
          course_id: courseId,
          module_position: modulePosition,
          module_item_position: moduleItemPosition,
        })

        if (response.status === 1 && response?.data) {
          onProgressUpdate(response.data)
        }
      } catch (error) {
        console.error('Failed to update progress:', error)
      }
    },
    [onProgressUpdate],
  )

  return (
    <div className="playlist-menu" style={playlistStyle}>
      <Typography.Title level={4} className="playlist-title">
        Lectures Playlist
      </Typography.Title>

      {/* Add LearningTimer at the top of playlist */}
      {isLatestUnlocked && selectedLecture && (
        <Space
          direction="vertical"
          style={{ width: '100%', marginBottom: '16px' }}
        >
          <LearningTimer
            lecture={selectedLecture}
            onComplete={handleLectureComplete}
            courseId={courseId}
            isVideoPlaying={
              selectedLecture.item_type === 'video' ? isVideoPlaying : true
            }
            allLectures={allLectures}
          />
        </Space>
      )}

      <Collapse defaultActiveKey={getDefaultActiveKey} style={collapseStyle}>
        {Object.keys(lectures).map((week) => (
          <Panel header={week} key={week}>
            <List
              dataSource={lectures[week]}
              renderItem={(lecture) => {
                const highlighted = isSelected(lecture)
                const isLatestUnlockedLecture = isLectureLatestUnlocked(lecture)
                const type = lecture.item_type
                const config = mediaConfig[type] || {}

                return (
                  <LectureItem
                    key={`${type}-${lecture.module_item_id}`}
                    lecture={lecture}
                    highlight={highlighted}
                    chooseLecture={chooseLecture}
                    ItemIcon={config.icon}
                    itemType={type}
                    durationField={config.durationField}
                    isLatestUnlocked={isLatestUnlockedLecture}
                  />
                )
              }}
            />
          </Panel>
        ))}
      </Collapse>
    </div>
  )
}

export default memo(PlaylistMenu)
