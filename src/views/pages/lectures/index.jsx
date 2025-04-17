import { useParams } from 'react-router-dom'
import { Empty, Row, Col, Space, Spin, Alert, Tabs } from 'antd'
import { useState, useCallback, useMemo } from 'react'
import { SafetyCertificateOutlined, ReadOutlined } from '@ant-design/icons'

import PlaylistMenu from './components/PlaylistMenu'
import LectureContent from './components/LectureContent'
import CertificateView from './components/CertificateView'
import useLectureData from '@hooks/useLectureData'

// Enhanced responsive styles
const contentContainerStyle = {
  height: { xs: 'auto', sm: 'auto', md: 'calc(100vh - 64px)' }, // Responsive height
  overflowY: 'auto',
  paddingRight: { xs: '0', sm: '0', md: '16px' }, // Responsive padding
  marginBottom: { xs: '16px', sm: '16px', md: '0' }, // Add margin on small screens
}

const playlistContainerStyle = {
  height: { xs: 'auto', sm: 'auto', md: 'calc(100vh - 64px)' }, // Responsive height
  minHeight: { xs: '300px', sm: '400px', md: 'auto' }, // Minimum height on small screens
  overflowY: 'auto',
  display: 'flex', // Ensure flex layout
  flexDirection: 'column', // Stack children vertically
}

const Lectures = () => {
  const { moduleId, moduleItemId, courseId } = useParams()
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [activeTab, setActiveTab] = useState('lecture')

  const handleTabChange = (key) => {
    setActiveTab(key)
    if (key === 'lecture' && isVideoPlaying) {
      // Pause video when switching to certificate tab
      setIsVideoPlaying(false)
    }
  }

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

  // Course name and user name for certificate
  const courseName = useMemo(
    () => (allLectures?.length > 0 ? allLectures[0]?.course_title : 'Course'),
    [allLectures],
  )

  const userName = useMemo(
    () => (allLectures?.length > 0 ? allLectures[0]?.user_name : 'Student'),
    [allLectures],
  )

  if (loading) {
    return (
      <Spin
        tip="Loading lectures..."
        size="large"
        style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}
        fullscreen
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

  // Create items for tab navigation
  const tabItems = [
    {
      key: 'lecture',
      label: (
        <span>
          <ReadOutlined /> Lecture Content
        </span>
      ),
      children: (
        <LectureContent
          selectedLecture={selectedLecture}
          onPlayStateChange={handlePlayStateChange}
        />
      ),
      disabled: !selectedLecture,
    },
  ]

  // Add certificate tab only when course is completed
  if (courseCompleted) {
    tabItems.push({
      key: 'certificate',
      label: (
        <span>
          <SafetyCertificateOutlined /> Certificate
        </span>
      ),
      children: (
        <CertificateView
          courseId={courseId}
          courseName={courseName}
          userName={userName}
          completionDate={new Date().toLocaleDateString()}
        />
      ),
    })
  }

  return (
    <Row gutter={[16, 16]} style={{ margin: 0 }}>
      <Col
        xs={{ order: 2, span: 24 }}
        sm={{ order: 2, span: 24 }}
        md={{ order: 2, span: 24 }}
        lg={{ order: 2, span: 6 }}
        xl={{ order: 2, span: 6 }}
        style={playlistContainerStyle}
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
            setActiveTab('lecture') // Switch to lecture tab when selecting a lecture
          }}
          onCompleteCourse={handleCompleteCourse}
          onCompleteLecture={handleCompleteLecture}
          onViewCertificate={handleViewCertificate}
          activeCertificate={activeTab === 'certificate'}
        />
      </Col>

      <Col
        xs={{ order: 1, span: 24 }}
        sm={{ order: 1, span: 24 }}
        md={{ order: 1, span: 24 }}
        lg={{ order: 1, span: 18 }}
        xl={{ order: 1, span: 18 }}
        style={contentContainerStyle}
      >
        <Tabs
          activeKey={activeTab}
          items={tabItems}
          onChange={handleTabChange}
          size="large"
          tabBarStyle={{ marginBottom: '16px', paddingLeft: '8px' }}
        />
      </Col>
    </Row>
  )
}

export default Lectures
