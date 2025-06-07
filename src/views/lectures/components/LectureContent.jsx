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
}) => {
  const [quizPassed, setQuizPassed] = useState(false)
  const [quizResults, setQuizResults] = useState(null)
  const [loading, setLoading] = useState(false)

  const { item_type, content } = selectedLecture

  useEffect(() => {
    setQuizPassed(false)
    const fetchQuizStatus = async () => {
      if (item_type !== 'quiz') return

      try {
        setLoading(true)
        const response = await quizApi.getQuizResult({
          quiz_id: content.quiz_id,
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
          quizType={content.quiz_type}
          questions={content.questions}
          quizResult={quizResults}
        />
      )
    }
    return (
      <QuizModern
        contentQuiz={content}
        onCompleteLecture={onCompleteLecture}
        onCompleteCourse={onCompleteCourse}
        isLastLecture={isLastLecture}
      />
    )
  }

  return (
    <div className="lecture-content-container">
      {item_type === 'video' ? (
        <div className="video-container">
          <div className="video-content">
            <Video
              videoId={content.videoId}
              setIsVideoPlaying={setIsVideoPlaying}
            />
          </div>
        </div>
      ) : item_type === 'quiz' ? (
        <div className="quiz-container">
          {loading ? (
            <div className="loading-quiz">Loading quiz...</div>
          ) : (
            renderQuizContent()
          )}
        </div>
      ) : item_type === 'file' ? (
        <div className="file-container">
          <File filePath={content.file_path} />
        </div>
      ) : null}
    </div>
  )
}

export default LectureContent
