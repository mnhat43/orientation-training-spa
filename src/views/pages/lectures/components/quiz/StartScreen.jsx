import React from 'react'
import { Button, Typography, Space, Tag, Tooltip } from 'antd'
import {
  PlayCircleOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  QuestionOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  FireOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons'
import './StartScreen.scss'

const { Title, Text } = Typography

const formatTime = (seconds) => {
  if (!seconds) return null

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  const parts = []
  if (hours > 0) parts.push(`${hours}h`)
  if (minutes > 0) parts.push(`${minutes}m`)
  if (secs > 0 && hours === 0) parts.push(`${secs}s`)

  return parts.join(' ') || '0s'
}

const StartScreen = ({ content, onStartQuiz }) => {
  const { quiz_type, time_limit, difficulty, total_score, questions } = content
  const timeFormatted = formatTime(time_limit)

  const QuizTypeIcon =
    quiz_type === 'multiple_choice' ? CheckCircleOutlined : FileTextOutlined

  const getDifficultyStyle = () => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return { color: '#52c41a' }
      case 'medium':
        return { color: '#faad14' }
      default:
        return { color: '#ff4d4f' }
    }
  }

  return (
    <div className="quiz-start-container">
      <div className="quiz-header">
        <div className="quiz-type-icon">
          <QuizTypeIcon />
        </div>

        <div className="quiz-title-container">
          <Title level={3} className="quiz-title">
            Exam
          </Title>

          <Space size={8} className="quiz-meta-tags">
            <Tag color={getDifficultyStyle().color}>
              <FireOutlined /> {difficulty || 'Medium'}
            </Tag>

            <Tag color="blue">
              <QuizTypeIcon />{' '}
              {quiz_type === 'multiple_choice' ? 'Multiple Choice' : 'Essay'}
            </Tag>

            {timeFormatted && (
              <Tag color="purple">
                <ClockCircleOutlined /> {timeFormatted}
              </Tag>
            )}
          </Space>
        </div>
      </div>

      <div className="quiz-content">
        <div className="quiz-info-grid">
          <div className="info-item">
            <Tooltip title="Total points available">
              <TrophyOutlined className="info-icon" />
            </Tooltip>
            <div className="info-value">{total_score}</div>
            <div className="info-label">Points</div>
          </div>

          {quiz_type === 'multiple_choice' && (
            <div className="info-item">
              <Tooltip title="Number of questions">
                <QuestionOutlined className="info-icon" />
              </Tooltip>
              <div className="info-value">{questions?.length || 0}</div>
              <div className="info-label">Questions</div>
            </div>
          )}

          {timeFormatted && (
            <div className="info-item">
              <Tooltip title="Time limit for this quiz">
                <ClockCircleOutlined className="info-icon" />
              </Tooltip>
              <div className="info-value time-value">{timeFormatted}</div>
              <div className="info-label">Time Limit</div>
            </div>
          )}
        </div>

        <div className="quiz-instructions">
          <div className="instruction-header">
            <InfoCircleOutlined />
            <span>Instructions</span>
          </div>

          <div className="instruction-content">
            <Text>
              {quiz_type === 'multiple_choice'
                ? 'Answer all questions before submitting. Some questions may have multiple correct answers.'
                : 'Provide a comprehensive answer to the essay question.'}
              {time_limit > 0 &&
                ' The timer will start once you begin and cannot be paused.'}
            </Text>
          </div>
        </div>
      </div>

      <div className="quiz-action">
        <Button
          type="primary"
          size="large"
          icon={<PlayCircleOutlined />}
          onClick={onStartQuiz}
        >
          Start Quiz
        </Button>
      </div>
    </div>
  )
}

export default StartScreen
