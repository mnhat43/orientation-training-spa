import React from 'react'
import { useState, useEffect } from 'react'
import Video from './Video'
import File from './File'
import QuizModern from './QuizModern'
import './LectureContent.scss'
import { QuizReview } from './quiz'
import quizApi from '@api/quiz'

const LectureContent = ({
  selectedLecture,
  setIsVideoPlaying,
  onCompleteLecture,
  onCompleteCourse,
  isLastLecture,
  allLectures,
}) => {
  const [quizPassed, setQuizPassed] = useState(false)
  const [quizResults, setQuizResults] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setQuizPassed(false)
    const fetchQuizStatus = async () => {
      if (selectedLecture.item_type !== 'quiz') return

      try {
        setLoading(true)
        const response = await quizApi.getQuizResult({
          quiz_id: selectedLecture.quiz_id,
        })

        if (response.status == 1 && response.data) {
          if (response.data.passed) {
            setQuizPassed(true)
            setQuizResults(response.data.results)
          }
        }
      } catch (error) {
        console.error('Error fetching quiz status:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchQuizStatus()
  }, [selectedLecture])

  const renderQuizContent = () => {
    if (loading) return <div className="loading-quiz">Loading quiz...</div>

    if (quizPassed) {
      return (
        <QuizReview
          quizData={selectedLecture.quiz_data}
          quizResult={quizResults}
        />
      )
    }
    return (
      <QuizModern
        selectedLecture={selectedLecture}
        onCompleteLecture={onCompleteLecture}
        onCompleteCourse={onCompleteCourse}
        isLastLecture={isLastLecture}
        allLectures={allLectures}
      />
    )
  }

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
          {loading ? (
            <div className="loading-quiz">Loading quiz...</div>
          ) : (
            renderQuizContent()
          )}
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
