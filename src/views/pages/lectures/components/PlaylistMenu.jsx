import { List, Typography, Collapse } from 'antd'
import VideoItem from './VideoItem'
import FileItem from './FileItem'

const { Panel } = Collapse

const PlaylistMenu = (props) => {
  const { lectures, selectedLecture, chooseLecture, completedLectures } = props

  return (
    <div className="playlist-menu">
      <Typography.Title level={4} className="playlist-title">
        Lectures Playlist
      </Typography.Title>
      <Collapse accordion>
        {Object.keys(lectures).map((week) => (
          <Panel header={week} key={week}>
            <List
              dataSource={lectures[week]}
              renderItem={(lecture) => {
                const completed = completedLectures.includes(lecture.id)
                return lecture.itemType === 'video' ? (
                  <VideoItem
                    key={lecture.id}
                    lecture={lecture}
                    highlight={lecture.id === selectedLecture.id}
                    chooseLecture={() => chooseLecture(lecture.id)}
                    completed={completed}
                  />
                ) : lecture.itemType === 'file' ? (
                  <FileItem
                    key={lecture.id}
                    lecture={lecture}
                    highlight={lecture.id === selectedLecture.id}
                    chooseLecture={() => chooseLecture(lecture.id)}
                    completed={completed}
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

export default PlaylistMenu
