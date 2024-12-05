import { useState } from 'react'
import { useParams } from 'react-router-dom'

import { Empty, Row, Col, Space } from 'antd'

import Video from './components/Video'
import VideoInfo from './components/VideoInfo'
import PlaylistMenu from './components/PlaylistMenu'

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
  const lectures = [
    {
      id: '1',
      title: 'Video 1',
      thumbnail: {
        url: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      },
      duration: '10:11',
      videoId: 'ckqd8ZxTuDY',
      publishedAt: '2024/05/02'
    },
    {
      id: '2',
      title: 'Video 3',
      thumbnail: {
        url: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      },
      duration: '10:11',
      videoId: 'vy2A00BcP1w',
      publishedAt: '2024/03/02'
    }
  ]

  // const [lectures, setLectures] = useState([
  //   {
  //     id: 1,
  //     title: 'Video 1',
  //     thumbnail: {
  //       url: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  //     },
  //     duration: '10:11',
  //     videoId: 'ckqd8ZxTuDY',
  //     publishedAt: '2024/05/02'
  //   },
  //   {
  //     id: 2,
  //     title: 'Video 2',
  //     thumbnail: {
  //       url: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  //     },
  //     duration: '10:11',
  //     videoId: 'ckqd8ZxTuDY',
  //     publishedAt: '2024/05/02'
  //   },
  //   {
  //     id: 3,
  //     title: 'Video 3',
  //     thumbnail: {
  //       url: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  //     },
  //     duration: '10:11',
  //     videoId: 'ckqd8ZxTuDY',
  //     publishedAt: '2024/05/02'
  //   },
  // ]);


  // if (loading) {
  //   return <Spinner size='large' />
  // }

  return <LecturePage lectures={lectures} />
}

export default Lectures
