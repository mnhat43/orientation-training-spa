import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { Empty, Row, Col, Space, Button } from 'antd'

import Video from './components/Video'
import VideoInfo from './components/VideoInfo'
import PlaylistMenu from './components/PlaylistMenu'
import lecture from '@api/lecture'

const selectLecture = (lectures, lectureId) => {
  const allLectures = Object.values(lectures).flat()
  if (!Array.isArray(allLectures) || !allLectures.length) return null
  if (!lectureId) return allLectures[0]
  const index = allLectures.findIndex((lecture) => lecture.id === lectureId)
  if (index === -1) return null
  return allLectures[index]
}

const LecturePage = (props) => {
  const { lectures } = props
  const { lectureId } = useParams()
  const [selectedLecture, setSelectedLecture] = useState(
    selectLecture(lectures, lectureId),
  )
  const [completedLectures, setCompletedLectures] = useState([])

  if (!selectedLecture) return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />

  // All lectures are accessible if at least 2 lectures have been completed
  const allLecturesUnlocked = completedLectures.length >= 2

  // Get a flat list of all lectures
  const allLectures = Object.values(lectures).flat()

  // Find the index of the last completed lecture
  let lastCompletedIndex = -1
  allLectures.forEach((lecture, index) => {
    if (completedLectures.includes(lecture.id)) {
      lastCompletedIndex = index
    }
  })

  const chooseLecture = (lectureId) => {
    const lectureIndex = allLectures.findIndex(
      (lecture) => lecture.id === lectureId,
    )

    // A lecture is accessible if:
    // 1. All lectures are unlocked (2+ completed)
    // 2. OR It's the first lecture (index 0)
    // 3. OR It's already completed
    // 4. OR It's the next lecture after the last completed one
    const accessible =
      allLecturesUnlocked ||
      lectureIndex === 0 ||
      completedLectures.includes(lectureId) ||
      lectureIndex === lastCompletedIndex + 1

    if (accessible) {
      setSelectedLecture(selectLecture(lectures, lectureId))
    } else {
      alert('Please complete the previous lectures first.')
    }
  }

  const markAsCompleted = (lectureId) => {
    if (!completedLectures.includes(lectureId)) {
      setCompletedLectures([...completedLectures, lectureId])
    }
  }

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} xl={18}>
          <Space size="middle" direction="vertical" style={{ width: '100%' }}>
            {selectedLecture.itemType === 'video' ? (
              <>
                <Video selectedLecture={selectedLecture}></Video>
                <VideoInfo lecture={selectedLecture} />
                <Button onClick={() => markAsCompleted(selectedLecture.id)}>
                  Mark as Completed
                </Button>
              </>
            ) : (
              <>
                <embed
                  src={selectedLecture.file_path}
                  width="100%"
                  height="600px"
                />
                <Button onClick={() => markAsCompleted(selectedLecture.id)}>
                  Mark as Completed
                </Button>
              </>
            )}

            {/* <LectureComments selectedLecture={selectedLecture} /> */}
          </Space>
        </Col>

        <Col xs={24} sm={24} xl={6}>
          <PlaylistMenu
            lectures={lectures}
            selectedLecture={selectedLecture}
            chooseLecture={chooseLecture}
            completedLectures={completedLectures}
          />
        </Col>
      </Row>
    </>
  )
}

const Lectures = () => {
  const [lectures, setLectures] = useState({})
  const [loading, setLoading] = useState(true)
  const { courseId } = useParams()

  const fetchLectures = async () => {
    try {
      setLoading(true)
      const response = await lecture.getListLecture({
        course_id: parseInt(courseId),
      })
      setLectures(response.data.data)
      setLoading(false)
    } catch (error) {
      setLoading(false)

      console.error('Failed to fetch lectures:', error.message)
    }
  }

  useEffect(() => {
    fetchLectures()
  }, [courseId])

  if (loading) return <div>Loading...</div>
  if (!Object.keys(lectures).length)
    return <Empty description="No lectures available" />

  return <LecturePage lectures={lectures} />
}

export default Lectures
