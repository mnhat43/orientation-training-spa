import React, { useEffect } from 'react'
import { FlexSectionHeader } from '../../style'

import { Typography, Button, List, Space, Tag, Dropdown, Menu } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useParams } from 'react-router'
import { useNavigate } from 'react-router-dom'
import ExamItem from './components/ExamItem'

const { Title, Text } = Typography

const Exams = () => {
  const { courseId } = useParams()
  // const history = useHistory()
  const navigate = useNavigate();

  // const exams = useSelector((state) => state.exams.data)

  // useEffect(() => {
  //   dispatch(getAllExams(courseId))
  // }, [courseId, dispatch])

  const exams = [
    {
      id: 1,
      title: "Quiz 1",
      weight: '0.2',
      maxScore: 10,
      timeLimit: '12000',
      submissionType: 'online',
      status: {
        code: 'open',
        message: 'assetment will close at 2024-07-10T23:59:00.000Z',
      }
    },
    {
      id: 2,
      title: "Quiz 2",
      weight: '0.2',
      maxScore: 10,
      timeLimit: '9000',
      submissionType: 'online',
      status: {
        code: 'willOpen',
        message: 'assetment will open at 2024-07-10T23:59:00.000Z',
      }
    },
    {
      id: 3,
      title: "Quiz 3",
      weight: '0.2',
      maxScore: 10,
      timeLimit: '12000',
      submissionType: 'online',
      status: {
        code: 'closed',
        message: 'assetment closed at 2024-07-10T23:59:00.000Z',
      }
    },
  ]

  return (
    <>
      <FlexSectionHeader>
        <Title level={3}>All Exams</Title>
        {/* {enrolled && privilege !== STUDENT && ( */}
        <Button
          onClick={
            () =>
              navigate(`/course/${courseId}/exams/create`)
          }
          type="dashed"
          shape="round"
          icon={<PlusOutlined />}
        >
          Add Exam
        </Button>
        {/* )} */}
      </FlexSectionHeader >

      <div style={{ marginTop: '16px' }}>
        <Text style={{ fontSize: '16px', fontWeight: '600', color: '#595959' }}>
          Active
        </Text>

        <List
          dataSource={exams.filter((exam) => exam.status.code !== 'closed')}
          renderItem={(exam) => <ExamItem exam={exam} />}
        />
      </div>

      <div
        style={{
          marginTop: '46px'
        }}
      >
        <Text style={{ fontSize: '16px', fontWeight: '600', color: '#595959' }}>
          Done
        </Text>

        <List
          dataSource={exams.filter((exam) => exam.status.code === 'closed')}
          renderItem={(exam) => <ExamItem exam={exam} disabled={true} />}
        />
      </div>
    </>
  )
}


// export { default as AssessmentCreation } from './components/AssessmentCreation'
// export { default as Submissions } from './components/Submissions'

export default Exams
