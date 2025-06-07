import { Empty, Row, Col, Spin, Alert } from 'antd'
import { useState } from 'react'
import PlaylistMenu from './components/PlaylistMenu'
import LectureContent from './components/LectureContent'
import LearningTimer from './components/LearningTimer'
import useLectureData from '@hooks/useLectureData'
import './lectures.scss'
import _ from 'lodash'

const Lectures = () => {
  const {
    loading,
    error,
    lectures,
    selectedLecture,
    courseCompleted,
    handleSelectLecture,
    handleGetLastLecture,
    handleGetLastUnlockedLecture,
    handleCompleteCourse,
    handleCompleteLecture,
  } = useLectureData()

  const lastUnlockedLecture = handleGetLastUnlockedLecture()
  const lastLecture = handleGetLastLecture()

  const itemType = selectedLecture?.item_type || ''

  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

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

  if (!lectures || !lectures.length) {
    return (
      <div className="lectures-page__empty">
        <Empty description="No lectures available" />
      </div>
    )
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
            isLastLecture={_.isEqual(selectedLecture, lastLecture)}
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
            lastUnlockedLecture={lastUnlockedLecture}
            courseCompleted={courseCompleted}
            onSelectLecture={handleSelectLecture}
          />
        </Col>
      </Row>

      {_.isEqual(selectedLecture, lastUnlockedLecture) &&
        itemType !== 'quiz' && (
          <div className="lectures-page__timer-container">
            <LearningTimer
              selectedLecture={selectedLecture}
              lastLecture={lastLecture}
              isVideoPlaying={itemType === 'video' ? isVideoPlaying : true}
              courseCompleted={courseCompleted}
              onCompleteLecture={handleCompleteLecture}
              onCompleteCourse={handleCompleteCourse}
            />
          </div>
        )}
    </div>
  )
}

export default Lectures
