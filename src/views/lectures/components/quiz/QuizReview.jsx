import React from 'react'
import { Spin } from 'antd'
import './QuizReview.scss'
import MultipleChoiceQuizReview from './MultipleChoiceQuizReview'
import EssayQuizReview from './EssayQuizReview'

const QuizReview = ({ quizType, questions, quizResult }) => {
  if (!quizResult) {
    return (
      <div className="quiz-review-loading">
        <Spin tip="Loading quiz results..." />
      </div>
    )
  }

  if (quizType === 'essay') {
    return <EssayQuizReview questions={questions} quizResult={quizResult} />
  }

  return (
    <MultipleChoiceQuizReview questions={questions} quizResult={quizResult} />
  )
}

export default QuizReview
