import React from 'react'
import Video from './Video'
import File from './File'
import QuizModern from './QuizModern'
import './LectureContent.scss'

const LectureContent = ({
  selectedLecture,
  setIsVideoPlaying,
  onCompleteLecture,
  onCompleteCourse,
  isLastLecture,
  allLectures,
}) => {
  return (
    <div className="lecture-content-container">
      {selectedLecture.item_type === 'video' ? (
        <div className="video-container">
          <div className="video-content">
            <Video
              videoId={selectedLecture.videoId}
              setIsVideoPlaying={setIsVideoPlaying}
            />
          </div>
        </div>
      ) : selectedLecture.item_type === 'quiz' ? (
        <div className="quiz-container">
          <QuizModern
            selectedLecture={selectedLecture}
            onCompleteLecture={onCompleteLecture}
            onCompleteCourse={onCompleteCourse}
            isLastLecture={isLastLecture}
            allLectures={allLectures}
          />
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
