import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { Empty, Row, Col, Space } from 'antd'

import Video from './components/Video'
import VideoInfo from './components/VideoInfo'
import PlaylistMenu from './components/PlaylistMenu'
import lecture from '@api/lecture'

const selectLecture = (lectures, lectureId) => {
  if (!Array.isArray(lectures) || !lectures.length) return null
  if (!lectureId) return lectures[0]
  const index = lectures.findIndex((lecture) => lecture.id === lectureId)
  if (index === -1) return null
  return lectures[index]
}

const LecturePage = (props) => {
  const { lectures } = props
  const { lectureId } = useParams()
  const [selectedLecture, setSelectedLecture] = useState(selectLecture(lectures, lectureId))

  if (!selectedLecture) return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />

  const chooseLecture = (lectureId) => {
    setSelectedLecture(selectLecture(lectures, lectureId))
  }

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} xl={18}>
          <Space size='middle' direction='vertical' style={{ width: '100%' }}>
            <Video selectedLecture={selectedLecture}></Video>
            <VideoInfo lecture={selectedLecture} />
            {/* <LectureComments selectedLecture={selectedLecture} /> */}
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
    </>
  )
}

const Lectures = () => {
  const [lectures, setLectures] = useState([])
  const [loading, setLoading] = useState(true)
  const { courseId } = useParams()

  const fetchLectures = async () => {
    try {
      setLoading(true)
      const response = await lecture.getListLecture({ course_id: parseInt(courseId) })
      setLectures(response.data.data)
      setLoading(false)
    } catch (error) {
      setLoading(false)

      console.error("Failed to fetch lectures:", error.message)
    }
  }

  useEffect(() => {
    fetchLectures()
  }, [courseId])

  if (loading) return <div>Loading...</div>
  if (!lectures.length) return <Empty description="No lectures available" />

  return <LecturePage lectures={lectures} />
}

export default Lectures
