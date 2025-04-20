import React, { useEffect } from 'react'
import Video from './Video'
import VideoInfo from './VideoInfo'
import File from './File'
import './LectureContent.scss'

const LectureContent = ({ selectedLecture, onPlayStateChange, isExpanded }) => {
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
    <div className="lecture-content-container">
      {selectedLecture.item_type === 'video' ? (
        <div className="video-container">
          <div className="video-content">
            <Video
              videoId={selectedLecture.videoId}
              onPlayStateChange={onPlayStateChange}
            />
          </div>

          <div className="video-info-container">
            <VideoInfo
              title={selectedLecture.title}
              description={selectedLecture.description}
              publishedAt={selectedLecture.publishedAt}
              duration={selectedLecture.duration}
              tags={selectedLecture.tags}
            />
          </div>
        </div>
      ) : (
        <div className="file-container">
          <File filePath={selectedLecture.file_path} />
        </div>
      )}
    </div>
  )
}

export default LectureContent
