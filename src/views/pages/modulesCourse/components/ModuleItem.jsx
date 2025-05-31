import { List, Space, Button } from 'antd'
import styled from 'styled-components'

import {
  FileOutlined,
  YoutubeOutlined,
  DeleteOutlined,
} from '@ant-design/icons'
import { useParams } from 'react-router'
import { useNavigate } from 'react-router-dom'

const HoverableListItem = styled(List.Item)`
  cursor: pointer;
  padding-left: 8px;
  font-size: 16px;
  &:hover {
    background-color: #f0f0f0;
    color: #1890ff;
  }
`

const getIcon = (item) => {
  if (item.item_type === 'video') return <YoutubeOutlined />
  if (item.item_type === 'file') return <FileOutlined />
}

const ModuleItem = ({ item, moduleId, instructorAccess, removeModuleItem }) => {
  const { title, item_type, url } = item
  const { courseId } = useParams()

  const navigate = useNavigate()

  const getActions = (item) => {
    return (
      <span
        onClick={(event) => {
          event.stopPropagation()
        }}
      >
        <Button
          onClick={() => removeModuleItem(item)}
          type="text"
          icon={<DeleteOutlined />}
          danger
        />
      </span>
    )
  }

  return (
    <HoverableListItem
      extra={getActions(item)}
      onClick={() => {
        navigate(`/course/${courseId}/lectures/${moduleId}/${item.id}`)
      }}
    >
      <Space size={20}>
        {getIcon(item)}
        {title}
      </Space>
    </HoverableListItem>
  )
}

export default ModuleItem
