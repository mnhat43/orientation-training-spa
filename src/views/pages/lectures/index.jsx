import { Empty, Row, Col, Spin, Alert } from 'antd'
import { useState } from 'react'
import PlaylistMenu from './components/PlaylistMenu'
import LectureContent from './components/LectureContent'
import LearningTimer from './components/LearningTimer'
import useLectureData from '@hooks/useLectureData'
import './lectures.scss'

const Lectures = () => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  const {
    lectures,
    allLectures,
    selectedLecture,
    latestUnlockedLecture,
    courseCompleted,
    isLatestUnlocked,
    isLastLecture,
    handleChooseLecture,
    handleCompleteCourse,
    handleCompleteLecture,
    loading,
    error,
  } = useLectureData()

  if (loading) {
    return (
      <div className="lectures-page__loading">
        <Spin tip="Loading lectures..." size="large" />
      </div>
    )
  }

  if (error) {
    return <Alert type="error" message={`Error: ${error}`} showIcon />
  }

  if (!Object.keys(lectures).length || !selectedLecture) {
    return <Empty description="No lectures available" />
  }

  return (
    <div className="lectures-page">
      <Row gutter={[16, 16]}>
        <Col
          xs={24}
          sm={24}
          md={24}
          lg={18}
          xl={18}
          className="lectures-page__content-container"
        >
          <LectureContent
            selectedLecture={selectedLecture}
            setIsVideoPlaying={setIsVideoPlaying}
            onCompleteLecture={handleCompleteLecture}
            onCompleteCourse={handleCompleteCourse}
            isLastLecture={isLastLecture}
            allLectures={allLectures}
          />
        </Col>

        <Col
          xs={24}
          sm={24}
          md={24}
          lg={6}
          xl={6}
          className="lectures-page__playlist-container"
        >
          <PlaylistMenu
            lectures={lectures}
            selectedLecture={selectedLecture}
            latestUnlockedLecture={latestUnlockedLecture}
            courseCompleted={courseCompleted}
            onChooseLecture={handleChooseLecture}
          />
        </Col>
      </Row>

      {isLatestUnlocked &&
        selectedLecture &&
        selectedLecture.item_type !== 'quiz' && (
          <div className="lectures-page__timer-container">
            <LearningTimer
              lectures={lectures}
              selectedLecture={selectedLecture}
              isVideoPlaying={
                selectedLecture.item_type === 'video' ? isVideoPlaying : true
              }
              courseCompleted={courseCompleted}
              isLastLecture={isLastLecture}
              onCompleteLecture={handleCompleteLecture}
              onCompleteCourse={handleCompleteCourse}
            />
          </div>
        )}
    </div>
  )
}

export default Lectures
