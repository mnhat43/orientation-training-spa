import { List, Typography, Collapse } from 'antd'
import VideoItem from './VideoItem'
import FileItem from './FileItem'

const { Panel } = Collapse

const PlaylistMenu = (props) => {
  const { lectures, selectedLecture, chooseLecture, completedLectures } = props

  // All lectures are accessible if at least 2 lectures have been completed
  const allLecturesUnlocked = completedLectures.length >= 2

  // Get a flat list of all lectures
  const allLecturesFlat = Object.values(lectures).flat()

  // Find the index of the last completed lecture
  let lastCompletedIndex = -1
  allLecturesFlat.forEach((lecture, index) => {
    if (completedLectures.includes(lecture.id)) {
      lastCompletedIndex = index
    }
  })

  return (
    <div className="playlist-menu">
      <Typography.Title level={4} className="playlist-title">
        Lectures Playlist
      </Typography.Title>
      <Collapse accordion defaultActiveKey={Object.keys(lectures)[0]}>
        {Object.keys(lectures).map((week) => (
          <Panel header={week} key={week}>
            <List
              dataSource={lectures[week]}
              renderItem={(lecture) => {
                const completed = completedLectures.includes(lecture.id)

                // A lecture is accessible if:
                // 1. All lectures are unlocked (2+ completed)
                // 2. OR It's the first lecture (index 0)
                // 3. OR It's already completed
                // 4. OR It's the next lecture after the last completed one
                const lectureIndex = allLecturesFlat.findIndex(
                  (l) => l.id === lecture.id,
                )
                const accessible =
                  allLecturesUnlocked ||
                  lectureIndex === 0 ||
                  completed ||
                  lectureIndex === lastCompletedIndex + 1

                return lecture.itemType === 'video' ? (
                  <VideoItem
                    key={lecture.id}
                    lecture={lecture}
                    highlight={lecture.id === selectedLecture.id}
                    chooseLecture={() => chooseLecture(lecture.id)}
                    completed={completed}
                    accessible={accessible}
                  />
                ) : lecture.itemType === 'file' ? (
                  <FileItem
                    key={lecture.id}
                    lecture={lecture}
                    highlight={lecture.id === selectedLecture.id}
                    chooseLecture={() => chooseLecture(lecture.id)}
                    completed={completed}
                    accessible={accessible}
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
