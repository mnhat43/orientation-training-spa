import { useEffect } from 'react'
import Video from './Video'
import VideoInfo from './VideoInfo'
import File from './File'

const LectureContent = ({ selectedLecture, onPlayStateChange }) => {
  useEffect(() => {
    // Reset video playing state when lecture changes
    if (onPlayStateChange) {
      onPlayStateChange(false)
    }
  }, [
    selectedLecture?.module_id,
    selectedLecture?.module_item_id,
    onPlayStateChange,
  ])

  return (
    <>
      {selectedLecture.item_type === 'video' ? (
        <>
          <Video
            videoId={selectedLecture.videoId}
            onPlayStateChange={onPlayStateChange}
          />
          <VideoInfo
            title={selectedLecture.title}
            publishedAt={selectedLecture.publishedAt}
          />
        </>
      ) : (
        <File filePath={selectedLecture.file_path} />
      )}
    </>
  )
}

export default LectureContent
