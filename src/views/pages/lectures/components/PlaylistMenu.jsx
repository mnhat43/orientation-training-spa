import React from 'react'
import { List, Typography, Collapse } from 'antd'
import VideoItem from './VideoItem'
import FileItem from './FileItem'

const { Panel } = Collapse

const PlaylistMenu = ({ lectures, selectedLecture, chooseLecture }) => {
  const isSelected = React.useCallback(
    (lecture) => {
      if (!selectedLecture) return false
      return (
        parseInt(lecture.id) === parseInt(selectedLecture.id) &&
        parseInt(lecture.module_id) === parseInt(selectedLecture.module_id)
      )
    },
    [selectedLecture],
  )

  // Find the module containing the selected lecture to auto-open that panel
  const getDefaultActiveKey = React.useMemo(() => {
    if (!selectedLecture) return Object.keys(lectures)[0]

    for (const week in lectures) {
      const found = lectures[week].some(
        (lecture) =>
          lecture.id === selectedLecture.id &&
          lecture.module_id === selectedLecture.module_id,
      )
      if (found) return week
    }
    return Object.keys(lectures)[0]
  }, [lectures, selectedLecture])

  return (
    <div className="playlist-menu">
      <Typography.Title level={4} className="playlist-title">
        Lectures Playlist
      </Typography.Title>
      <Collapse accordion defaultActiveKey={getDefaultActiveKey}>
        {Object.keys(lectures).map((week) => (
          <Panel header={week} key={week}>
            <List
              dataSource={lectures[week]}
              renderItem={(lecture) => {
                const highlighted = isSelected(lecture)
                return lecture.item_type === 'video' ? (
                  <VideoItem
                    key={`video-${lecture.id}`}
                    lecture={lecture}
                    highlight={highlighted}
                    chooseLecture={chooseLecture}
                  />
                ) : lecture.item_type === 'file' ? (
                  <FileItem
                    key={`file-${lecture.id}`}
                    lecture={lecture}
                    highlight={highlighted}
                    chooseLecture={chooseLecture}
                  />
                ) : null
              }}
            />
          </Panel>
        ))}
      </Collapse>
    </div>
  )
}

export default React.memo(PlaylistMenu)
