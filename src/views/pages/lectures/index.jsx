import { useParams } from 'react-router-dom'
import { Empty, Row, Col, Space, Spin, Alert } from 'antd'
import { useState, useCallback } from 'react'

import PlaylistMenu from './components/PlaylistMenu'
import LectureContent from './components/LectureContent'
import useLectureData from '@hooks/useLectureData'

// Add styles for scrollable containers
const contentContainerStyle = {
  height: 'calc(100vh - 64px)', // Adjust based on your header height
  overflowY: 'auto',
  paddingRight: '16px',
}

const playlistContainerStyle = {
  height: 'calc(100vh - 64px)', // Same height as content area
  overflowY: 'auto',
}

const Lectures = () => {
  const { moduleId, moduleItemId, courseId } = useParams()
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  const {
    lectures,
    selectedLecture,
    loading,
    error,
    allLectures,
    isLatestUnlocked,
    chooseLecture,
    handleProgressUpdate,
  } = useLectureData(courseId, moduleId, moduleItemId)

  const handlePlayStateChange = useCallback((isPlaying) => {
    setIsVideoPlaying(isPlaying)
  }, [])

  if (loading) {
    return (
      <Spin
        tip="Loading lectures..."
        size="large"
        style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}
      />
    )
  }

  if (error) {
    return <Alert type="error" message={`Error: ${error}`} showIcon />
  }

  if (!Object.keys(lectures).length) {
    return <Empty description="No lectures available" />
  }

  if (!selectedLecture) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
  }

  return (
    <Row gutter={[16, 16]} style={{ margin: 0 }}>
      <Col xs={24} sm={24} xl={18} style={contentContainerStyle}>
        <Space
          size="middle"
          direction="vertical"
          style={{ width: '100%', paddingBottom: '24px' }}
        >
          <LectureContent
            selectedLecture={selectedLecture}
            onPlayStateChange={handlePlayStateChange}
          />
        </Space>
      </Col>
      <Col xs={24} sm={24} xl={6} style={playlistContainerStyle}>
        <PlaylistMenu
          lectures={lectures}
          selectedLecture={selectedLecture}
          chooseLecture={chooseLecture}
          isLatestUnlocked={isLatestUnlocked}
          courseId={courseId}
          allLectures={allLectures}
          onProgressUpdate={handleProgressUpdate}
          isVideoPlaying={isVideoPlaying}
        />
      </Col>
    </Row>
  )
}

export default Lectures
