import { Typography, List } from 'antd'
import { CheckCircleOutlined } from '@ant-design/icons'

const FileItem = ({ lecture, highlight, chooseLecture, completed }) => {
  return (
    <List.Item
      onClick={() => chooseLecture()}
      style={{
        backgroundColor: highlight ? '#d9d9d9' : undefined,
        paddingLeft: '14px',
        cursor: 'pointer',
        justifyContent: 'initial',
        overflowX: 'hidden',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div style={{ flex: 1 }}>
        <Typography.Text ellipsis={true} style={{ fontSize: '14px' }} strong>
          {lecture.title}
        </Typography.Text>
      </div>
      {completed && (
        <CheckCircleOutlined style={{ color: 'green', marginLeft: '8px' }} />
      )}
    </List.Item>
  )
}

export default FileItem
