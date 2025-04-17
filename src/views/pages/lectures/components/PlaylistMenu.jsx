import React, { memo, useCallback, useMemo } from 'react'
import { List, Typography, Collapse, Space } from 'antd'
import { PlaySquareOutlined, FilePdfOutlined } from '@ant-design/icons'
import LectureItem from './LectureItem'
import LearningTimer from './LearningTimer'
import CompletionModule from './CompletionModule'
import userprogress from '@api/userprogress'

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

// Updated styles for better responsiveness
const playlistStyle = {
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  paddingBottom: '8px',
}

const collapseStyle = {
  flexGrow: 1,
  overflowY: 'auto',
  marginBottom: '4px', // Ensure space between collapse and certificate
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
  return (
    <div className="playlist-menu" style={playlistStyle}>
      <Typography.Title level={4} className="playlist-title">
        Lectures Playlist
      </Typography.Title>

      {isLatestUnlocked && selectedLecture && !activeCertificate && (
        <Space
          direction="vertical"
          style={{ width: '100%', marginBottom: '16px' }}
        >
          <LearningTimer
            lecture={selectedLecture}
            courseId={courseId}
            isVideoPlaying={
              selectedLecture.item_type === 'video' ? isVideoPlaying : true
            }
            allLectures={allLectures}
            isLastLecture={isLastLecture}
            onCompleteLecture={onCompleteLecture}
            onCompleteCourse={onCompleteCourse}
          />
        </Space>
      )}

      {/* Make sure the Collapse doesn't take up all the space */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          minHeight: 0,
        }}
      >
        <Collapse
          defaultActiveKey={selectedLecture?.week_name}
          style={collapseStyle}
          items={Object.keys(lectures).map((week) => ({
            key: week,
            label: week,
            children: (
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
            ),
          }))}
        />

        {/* Certificate module - now in a separate div to ensure it's always visible */}
        <div style={{ flexShrink: 0 }}>
          <CompletionModule
            courseCompleted={courseCompleted}
            onViewCertificate={onViewCertificate}
            courseTitle={
              allLectures?.length > 0 ? allLectures[0]?.course_title : 'Course'
            }
            activeCertificate={activeCertificate}
          />
        </div>
      </div>
    </div>
  )
}

export default memo(PlaylistMenu)
