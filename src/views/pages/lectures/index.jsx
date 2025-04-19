import { useParams } from 'react-router-dom'
import { Empty, Row, Col, Spin, Alert, Card } from 'antd'
import { useState, useCallback, useMemo } from 'react'
import PlaylistMenu from './components/PlaylistMenu'
import LectureContent from './components/LectureContent'
import CertificateView from './components/CertificateView'
import useLectureData from '@hooks/useLectureData'
import './lectures.scss'

const Lectures = () => {
  const { moduleId, moduleItemId, courseId } = useParams()
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [activeTab, setActiveTab] = useState('lecture')

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
  } = useLectureData(courseId, moduleId, moduleItemId)

  const handlePlayStateChange = useCallback((isPlaying) => {
    setIsVideoPlaying(isPlaying)
  }, [])

  const handleViewCertificate = useCallback(() => {
    setActiveTab('certificate')
  }, [])

  // Course name and user name for certificate - memoized
  const courseName = useMemo(
    () => allLectures?.[0]?.course_title || 'Course',
    [allLectures],
  )

  const userName = useMemo(
    () => allLectures?.[0]?.user_name || 'Student',
    [allLectures],
  )

  // Handle loading and error states
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
      <Row gutter={[16, 16]} className="lectures-page__row">
        <Col
          xs={24}
          sm={24}
          md={24}
          lg={18}
          xl={18}
          className="lectures-page__content-container"
        >
          <div className="lectures-page__content">
            {activeTab === 'lecture' ? (
              <LectureContent
                selectedLecture={selectedLecture}
                onPlayStateChange={handlePlayStateChange}
              />
            ) : (
              courseCompleted && (
                <Card className="lectures-page__certificate-card">
                  <CertificateView
                    courseId={courseId}
                    courseName={courseName}
                    userName={userName}
                    completionDate={new Date().toLocaleDateString()}
                  />
                </Card>
              )
            )}
          </div>
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
            courseId={courseId}
            lectures={lectures}
            allLectures={allLectures}
            selectedLecture={selectedLecture}
            latestUnlockedLecture={latestUnlockedLecture}
            courseCompleted={courseCompleted}
            isVideoPlaying={isVideoPlaying && activeTab === 'lecture'}
            isLatestUnlocked={isLatestUnlocked}
            isLastLecture={isLastLecture}
            onChooseLecture={(moduleId, moduleItemId) => {
              handleChooseLecture(moduleId, moduleItemId)
              setActiveTab('lecture')
            }}
            onCompleteCourse={handleCompleteCourse}
            onCompleteLecture={handleCompleteLecture}
            onViewCertificate={handleViewCertificate}
            activeCertificate={activeTab === 'certificate'}
          />
        </Col>
      </Row>
    </div>
  )
}

export default Lectures
