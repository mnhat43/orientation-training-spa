import React, { useState, useEffect } from 'react'
import { Result, Card } from 'antd'
import { FileTextOutlined } from '@ant-design/icons'
import './QuizModern.scss'

import {
  StartScreen,
  EssayQuiz,
  MultipleChoiceQuiz,
  QuizResults,
  ConfirmModal,
} from './quiz'

import quizApi from '@api/quiz'

const QuizModern = ({
  selectedLecture,
  onCompleteLecture,
  onCompleteCourse,
  isLastLecture,
}) => {
  const [hasStarted, setHasStarted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [userAnswers, setUserAnswers] = useState({})
  const [multipleAnswers, setMultipleAnswers] = useState({})
  const [essayAnswer, setEssayAnswer] = useState('')
  const [showResults, setShowResults] = useState(false)
  const [deadline, setDeadline] = useState(null)
  const [confirmModalVisible, setConfirmModalVisible] = useState(false)
  const [timeWarning, setTimeWarning] = useState(false)
  const [quizResult, setQuizResult] = useState(null)

  const quizData = selectedLecture?.quiz_data || {}

  const { quiz_id, quiz_type, time_limit, questions } = quizData

  useEffect(() => {
    if (time_limit && hasStarted && !showResults) {
      const now = Date.now()
      setDeadline(now + time_limit * 1000)
    }
  }, [time_limit, hasStarted, showResults])

  const handleSingleAnswerSelect = (questionId, answerId) => {
    setUserAnswers({
      ...userAnswers,
      [questionId]: answerId,
    })
  }

  const handleMultipleAnswerSelect = (checkedValues, questionId) => {
    setMultipleAnswers({
      ...multipleAnswers,
      [questionId]: checkedValues,
    })
  }

  const handleEssayChange = (e) => {
    setEssayAnswer(e.target.value)
  }

  const handleStartQuiz = () => {
    setHasStarted(true)
  }

  const handleNextQuestion = () => {
    if (
      quiz_type === 'multiple_choice' &&
      currentQuestion < questions.length - 1
    ) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setConfirmModalVisible(true)
    }
  }

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleLectureCompletion = () => {
    if (isLastLecture) {
      onCompleteCourse()
      return
    }
    onCompleteLecture()
  }

  const submitQuiz = async () => {
    try {
      if (quiz_type === 'essay') {
        const response = await quizApi.submitQuizAnswers({
          quiz_id: Number(quiz_id),
          answers: [
            {
              question_id: questions[0].id,
              answer_text: essayAnswer,
            },
          ],
        })

        if (response.status === 1) {
          setQuizResult(response.data)

          const passed = response.data?.passed === true

          if (passed) {
            handleLectureCompletion()
          }
        }
      } else if (quiz_type === 'multiple_choice') {
        const answers = questions.map((question) => {
          let selectedAnswerIds = []

          if (question.allow_multiple) {
            selectedAnswerIds = multipleAnswers[question.id] || []
          } else {
            const answerId = userAnswers[question.id]
            if (answerId) selectedAnswerIds = [answerId]
          }

          return {
            question_id: question.id,
            selected_answer_ids: selectedAnswerIds,
          }
        })

        const response = await quizApi.submitQuizAnswers({
          quiz_id: Number(quiz_id),
          answers: answers,
        })

        if (response.status === 1) {
          setQuizResult(response.data)
          if (response.data.passed) {
            handleLectureCompletion()
          }
        }
      }
    } catch (error) {
      console.error('Quiz submission error:', error)
    }
  }

  const handleSubmit = () => {
    setShowResults(true)
    setConfirmModalVisible(false)
    submitQuiz()
  }

  const handleTimeWarning = () => {
    if (!timeWarning) {
      setTimeWarning(true)
    }
  }

  const handleTimeExpire = () => {
    handleSubmit()
  }

  const handleRetry = () => {
    setHasStarted(false)
    setCurrentQuestion(0)
    setUserAnswers({})
    setMultipleAnswers({})
    setEssayAnswer('')
    setShowResults(false)
    setDeadline(null)
    setConfirmModalVisible(false)
    setTimeWarning(false)
    setQuizResult(null)
  }

  return (
    <>
      {!hasStarted ? (
        <StartScreen quizData={quizData} onStartQuiz={handleStartQuiz} />
      ) : quiz_type === 'essay' ? (
        <>
          <EssayQuiz
            quizData={quizData}
            deadline={deadline}
            showResults={showResults}
            essayAnswer={essayAnswer}
            onEssayChange={handleEssayChange}
            onSubmit={handleSubmit}
            onTimeWarning={handleTimeWarning}
            handleConfirmModal={() => setConfirmModalVisible(true)}
            resultData={quizResult}
          />

          <ConfirmModal
            visible={confirmModalVisible}
            onOk={handleSubmit}
            onCancel={() => setConfirmModalVisible(false)}
            confirmTitle="Submit Essay"
            confirmMessage="Are you sure you want to submit this essay? You won't be able to make changes after submission."
            okText="Submit"
            cancelText="Continue Writing"
          />
        </>
      ) : !questions || questions.length === 0 ? (
        <div className="quiz-modern-empty">
          <Card>
            <Result
              icon={<FileTextOutlined />}
              title="No questions available"
              subTitle="This quiz doesn't have any questions yet."
            />
          </Card>
        </div>
      ) : showResults ? (
        <QuizResults
          quizData={quizData}
          quizResult={quizResult}
          onRetry={handleRetry}
        />
      ) : (
        <>
          <MultipleChoiceQuiz
            quizData={quizData}
            currentQuestion={currentQuestion}
            userAnswers={userAnswers}
            multipleAnswers={multipleAnswers}
            onSingleAnswerSelect={handleSingleAnswerSelect}
            onMultipleAnswerSelect={handleMultipleAnswerSelect}
            onNextQuestion={handleNextQuestion}
            onPrevQuestion={handlePrevQuestion}
            onConfirmModal={() => setConfirmModalVisible(true)}
            deadline={deadline}
            onSubmit={handleTimeExpire}
            onTimeWarning={handleTimeWarning}
          />

          <ConfirmModal
            visible={confirmModalVisible}
            onOk={handleSubmit}
            onCancel={() => setConfirmModalVisible(false)}
            answeredQuestions={
              Object.keys(userAnswers).length +
              Object.keys(multipleAnswers).length
            }
            totalQuestions={questions.length}
          />
        </>
      )}
    </>
  )
}

export default QuizModern
