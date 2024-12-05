import React, { useEffect } from 'react'
import styled from 'styled-components'
import { Typography, Button, List, Space, Tag, Dropdown, Menu } from 'antd'
import { AiOutlineSolution } from 'react-icons/ai'
import { Link } from 'react-router-dom'
import { useParams } from 'react-router'

const { Title, Text } = Typography

const StyledListItem = styled(List.Item)`
  background-color: #fafafa;
  padding: 24px 16px;
  width: 100%;
  margin-top: 16px;
  border-radius: 10px;
  cursor: pointer;
  &:hover {
    background-color: #d9d9d9;
  }
`
const ExamItem = ({ exam, disabled }) => {
    const { courseId } = useParams()
    // const { privilege } = useCoursePrivilege()
    const deleteExam = (courseId, examId) => {
        console.log(courseId, examId);
    }
    const optionMenu = (
        <Menu>
            <Menu.Item>
                <Link to={`/course/${courseId}/assessment/${exam.id}/grade`}>
                    Grade All
                </Link>
            </Menu.Item>
            <Menu.Item>
                <Link to={`/course/${courseId}/assessment/${exam.id}/submissions`}>
                    All Submissions
                </Link>
            </Menu.Item>
            <Menu.Item danger onClick={() => deleteExam(courseId, exam.id)}>
                Delete
            </Menu.Item>
        </Menu>
    )

    const getActions = () => {
        // if (privilege !== STUDENT)
        return (
            <>
                <Space
                    onClick={(event) => {
                        event.stopPropagation()
                    }}
                >
                    <Dropdown.Button
                        trigger={['click']}
                        placement="bottomLeft"
                        type="text"
                        overlay={optionMenu}
                    ></Dropdown.Button>
                </Space>
            </>
        )
    }

    return (
        <StyledListItem
            // onClick={() => window.open(`/course/${courseId}/exam/${exam.id}`)}
            onClick={() =>
                navigate(`/course/${courseId}/exam/${exam.id}`)
            }
            extra={getActions()}
        // extra={getActions(privilege)}
        >
            <Space>
                <AiOutlineSolution
                    style={{
                        fontSize: '32px',
                        color: disabled ? '#a7a7a7d9' : 'intial'
                    }}
                />
                <Space size="small" direction="vertical">
                    <Space>
                        <span>
                            <Text type="secondary">weight: </Text>
                            <Text strong>{`${exam.weight * 100}%`}</Text>
                        </span>
                        <span>
                            <Text type="secondary">maxScore: </Text>
                            <Text strong>{exam.maxScore}</Text>
                        </span>
                        <span>
                            <Text type="secondary">Duration: </Text>
                            <Text strong>
                                {Math.round(exam.timeLimit / 60)}
                                <Text type="secondary"> minutes</Text>
                            </Text>
                        </span>
                        <span>
                            <Text type="secondary">Submission: </Text>
                            <Text strong>{exam.submissionType}</Text>
                        </span>
                    </Space>

                    <Title
                        style={{ margin: 0, color: disabled ? '#a7a7a7d9' : 'intial' }}
                        level={5}
                    >
                        {exam.title}
                    </Title>

                    <div>
                        {exam.status.code === 'willOpen' && (
                            <Tag color="geekblue">{exam.status.code}</Tag>
                        )}
                        {exam.status.code === 'open' && (
                            <Tag color="green">{exam.status.code}</Tag>
                        )}
                        {exam.status.code === 'closed' && (
                            <Tag color="red">{exam.status.code}</Tag>
                        )}
                        <Text type="secondary">{exam.status.message}</Text>
                    </div>
                </Space>
            </Space>
        </StyledListItem>
    )
}

export default ExamItem;