import React, { useEffect, useRef } from 'react'
import { Button, Progress, Statistic } from 'antd'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import QuestionCard from './QuestionCard'

const { Countdown } = Statistic

const MultipleChoiceQuiz = ({
  quizData,
  currentQuestion,
  userAnswers,
  multipleAnswers,
  onSingleAnswerSelect,
  onMultipleAnswerSelect,
  onNextQuestion,
  onPrevQuestion,
  onConfirmModal,
  deadline,
  onSubmit,
  onTimeWarning,
}) => {
  const questionRef = useRef(null)

  useEffect(() => {
    if (questionRef.current) {
      questionRef.current.scrollTop = 0
    }
  }, [currentQuestion])

  const question = quizData.questions[currentQuestion]
  const isMultipleSelect = question.allow_multiple
  const isAnswered = isMultipleSelect
    ? multipleAnswers[question.id] && multipleAnswers[question.id].length > 0
    : !!userAnswers[question.id]

  return (
    <div className="quiz-modern" key={currentQuestion}>
      <div className="quiz-modern-header">
        {deadline && (
          <div className="quiz-modern-timer">
            <Countdown
              value={deadline}
              format="mm:ss"
              onFinish={onSubmit}
              onChange={(val) => {
                if (val <= 2 * 60 * 1000 && val > 0) {
                  onTimeWarning()
                }
              }}
            />
          </div>
        )}

        <div className="quiz-modern-progress">
          <div className="progress-text">
            Question {currentQuestion + 1} of {quizData.questions.length}
          </div>
          <Progress
            percent={Math.round(
              ((currentQuestion + 1) / quizData.questions.length) * 100,
            )}
            showInfo={false}
            size="small"
            strokeColor={{
              '0%': '#108ee9',
              '100%': '#87d068',
            }}
          />
        </div>
      </div>

      <div className="quiz-modern-question" ref={questionRef}>
        <QuestionCard
          question={question}
          userAnswers={userAnswers}
          multipleAnswers={multipleAnswers}
          onSingleAnswerSelect={onSingleAnswerSelect}
          onMultipleAnswerSelect={onMultipleAnswerSelect}
          quizTotalScore={quizData.score}
        />
      </div>

      <div className="quiz-modern-footer">
        <Button
          onClick={onPrevQuestion}
          disabled={currentQuestion === 0}
          icon={<LeftOutlined />}
          className="nav-button prev-button"
        >
          Previous
        </Button>

        {currentQuestion < quizData.questions.length - 1 ? (
          <Button
            type="primary"
            onClick={onNextQuestion}
            icon={<RightOutlined />}
            className="nav-button next-button"
            disabled={!isAnswered}
            iconPosition="right"
          >
            Next
          </Button>
        ) : (
          <Button
            type="primary"
            onClick={onConfirmModal}
            className="nav-button submit-button"
          >
            Submit Quiz
          </Button>
        )}
      </div>
    </div>
  )
}

export default MultipleChoiceQuiz
