import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { PlusOutlined, FileTextOutlined } from '@ant-design/icons'
import { Typography, Button, List, Space, Tag, Dropdown, Menu } from 'antd'
import { DateTime } from 'luxon'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom'

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
const AssignmentItem = ({ assignment, disabled }) => {

    const { courseId } = useParams()
    const navigate = useNavigate();

    const deleteAssignment = (courseId, assignmentId) => {
        console.log(courseId, assignmentId);
    }

    const optionMenu = (
        <Menu>
            <Menu.Item>
                <Link to={`/course/${courseId}/assessment/${assignment.id}/grade`}>
                    Grade All
                </Link>
            </Menu.Item>
            <Menu.Item>
                <Link
                    to={`/course/${courseId}/assessment/${assignment.id}/submissions`}
                >
                    All Submissions
                </Link>
            </Menu.Item>
            <Menu.Item
                danger
                onClick={() => deleteAssignment(courseId, assignment.id)}
            >
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
            onClick={() =>
                navigate(`/course/${courseId}/assignment/${assignment.id}`)
            }
            // extra={getActions(privilege)}
            extra={getActions()}
        >
            <Space>
                <FileTextOutlined
                    style={{
                        fontSize: '32px',
                        color: disabled ? '#a7a7a7d9' : 'intial'
                    }}
                />
                <Space size="small" direction="vertical">
                    <Space>
                        <span>
                            <Text type="secondary">weight: </Text>
                            <Text strong>{`${assignment.weight * 100}%`}</Text>
                        </span>
                        <span>
                            <Text type="secondary">maxScore: </Text>
                            <Text strong>{assignment.maxScore}</Text>
                        </span>
                        <span>
                            <Text type="secondary">Submission: </Text>
                            <Text strong>{assignment.submissionType}</Text>
                        </span>
                    </Space>

                    <Title
                        style={{ margin: 0, color: disabled ? '#a7a7a7d9' : 'intial' }}
                        level={5}
                    >
                        {assignment.title}
                    </Title>

                    <div>
                        <Tag color="red">Due At</Tag>
                        <Text type="secondary">
                            {DateTime.fromISO(assignment.dueDate).toLocaleString(
                                DateTime.DATETIME_FULL
                            )}
                        </Text>
                    </div>
                </Space>
            </Space>
        </StyledListItem>
    )
}



export default AssignmentItem;
