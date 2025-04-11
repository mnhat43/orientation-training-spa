import { useEffect, useState, useCallback, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Empty, Row, Col, Space, Button, Spin } from 'antd'

import Video from './components/Video'
import VideoInfo from './components/VideoInfo'
import PlaylistMenu from './components/PlaylistMenu'
import lecture from '@api/lecture'
import File from './components/File'

const LectureContent = ({ selectedLecture }) => {
  if (selectedLecture.item_type === 'video') {
    return (
      <>
        <Video videoId={selectedLecture.videoId} />
        <VideoInfo
          title={selectedLecture.title}
          publishedAt={selectedLecture.publishedAt}
        />
      </>
    )
  }

  return <File filePath={selectedLecture.file_path} />
}

const LecturePage = ({ lectures }) => {
  const { moduleId, moduleItemId, courseId } = useParams()
  const navigate = useNavigate()
  const [selectedLecture, setSelectedLecture] = useState(null)

  const allLectures = useMemo(() => Object.values(lectures).flat(), [lectures])

  const selectLecture = useCallback(
    (lectures, moduleId, moduleItemId) => {
      if (!Array.isArray(allLectures) || !allLectures.length) return null
      if (!moduleId || !moduleItemId) return allLectures[0]

      const index = allLectures.findIndex(
        (lecture) =>
          lecture.module_id === parseInt(moduleId) &&
          lecture.id === parseInt(moduleItemId),
      )

      return index === -1 ? null : allLectures[index]
    },
    [allLectures],
  )

  const chooseLecture = useCallback(
    (moduleId, moduleItemId) => {
      navigate(`/course/${courseId}/lectures/${moduleId}/${moduleItemId}`)

      const lecture = selectLecture(lectures, moduleId, moduleItemId)

      if (lecture) {
        setSelectedLecture(lecture)
      }
      console.log('lecture', lecture)
      console.log('selectedLecture', selectedLecture)
    },
    [navigate, courseId, lectures, selectLecture],
  )

  useEffect(() => {
    const lecture = selectLecture(lectures, moduleId, moduleItemId)

    if (lecture) {
      setSelectedLecture(lecture)
    } else if (allLectures.length > 0) {
      setSelectedLecture(allLectures[0])

      const firstLecture = allLectures[0]
      navigate(
        `/course/${courseId}/lectures/${firstLecture.module_id}/${firstLecture.id}`,
        { replace: true },
      )
    }
  }, [
    lectures,
    moduleId,
    moduleItemId,
    courseId,
    allLectures,
    navigate,
    selectLecture,
  ])

  if (!selectedLecture) return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={24} xl={18}>
        <Space size="middle" direction="vertical" style={{ width: '100%' }}>
          <LectureContent selectedLecture={selectedLecture} />
        </Space>
      </Col>

      <Col xs={24} sm={24} xl={6}>
        <PlaylistMenu
          lectures={lectures}
          selectedLecture={selectedLecture}
          chooseLecture={chooseLecture}
        />
      </Col>
    </Row>
  )
}

const Lectures = () => {
  const [lectures, setLectures] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { courseId } = useParams()

  const fetchLectures = useCallback(async () => {
    if (!courseId) return

    try {
      setLoading(true)
      setError(null)
      const response = await lecture.getListLecture({
        course_id: parseInt(courseId),
      })
      setLectures(response.data)
    } catch (error) {
      console.error('Failed to fetch lectures:', error.message)
      setError(error.message || 'Failed to fetch lectures')
    } finally {
      setLoading(false)
    }
  }, [courseId])

  useEffect(() => {
    fetchLectures()
  }, [fetchLectures])

  if (loading)
    return (
      <Spin
        tip="Loading lectures..."
        size="large"
        style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}
      />
    )

  if (error) return <Empty description={`Error: ${error}`} />

  if (!Object.keys(lectures).length)
    return <Empty description="No lectures available" />

  return <LecturePage lectures={lectures} />
}

export default Lectures
