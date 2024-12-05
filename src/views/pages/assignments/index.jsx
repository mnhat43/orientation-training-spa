import React, { useEffect } from 'react'
import { FlexSectionHeader } from '../../style'
import styled from 'styled-components'

import { Typography, Button, List, Space, Tag, Dropdown, Menu } from 'antd'

import { PlusOutlined, FileTextOutlined } from '@ant-design/icons'
import { useParams } from 'react-router'

import { useNavigate } from 'react-router-dom'
import AssignmentItem from './components/AssignmentItem'

const { Title, Text } = Typography

const Assignments = () => {
  const { courseId } = useParams()
  // const history = useHistory()
  // const { enrolled, privilege } = useCoursePrivilege()
  const navigate = useNavigate();

  // const assignments = useSelector((state) => state.assignments.data)
  const assignments = [
    {
      id: 1,
      title: 'Assignment 1',
      weight: '0.2',
      maxScore: 10,
      submissionType: 'online',
      dueDate: '2024-05-10T23:59:00.000Z',
    },
    {
      id: 1,
      title: 'Assignment 2',
      weight: '0.2',
      maxScore: 10,
      submissionType: 'online',
      dueDate: '2024-05-10T23:59:00.000Z',
    },
    {
      id: 1,
      title: 'Assignment 3',
      weight: '0.2',
      maxScore: 10,
      submissionType: 'online',
      dueDate: '2024-05-10T23:59:00.000Z',
    }
  ]


  return (
    <>
      <FlexSectionHeader>
        <Title level={3}>All Assignments</Title>
        {/* {enrolled && privilege !== STUDENT && ( */}
        <Button
          onClick={() =>
            navigate(`/course/${courseId}/assignments/create`)
          }
          type="dashed"
          shape="round"
          icon={<PlusOutlined />}
        >
          Add Assignment
        </Button>
        {/* )} */}
      </FlexSectionHeader>

      <div style={{ marginTop: '16px' }}>
        <List
          dataSource={assignments}
          renderItem={(assignment) => (
            <AssignmentItem assignment={assignment} />
          )}
        />
      </div>
    </>
  )
}




export default Assignments
