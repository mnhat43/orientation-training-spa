import { Typography, List } from 'antd'
import { CheckCircleOutlined } from '@ant-design/icons'

const VideoItem = ({ lecture, highlight, chooseLecture, completed }) => {
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
      <img
        style={{ width: '80px', height: '46px', marginRight: '8px' }}
        src={lecture.thumbnail}
        alt="video thumbnail"
      />
      <div style={{ flex: 1 }}>
        <Typography.Text ellipsis={true} style={{ fontSize: '14px' }} strong>
          {lecture.title}
        </Typography.Text>
        <div>
          <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
            {lecture.duration}
          </Typography.Text>
        </div>
      </div>
      {completed && (
        <CheckCircleOutlined style={{ color: 'green', marginLeft: '8px' }} />
      )}
    </List.Item>
  )
}

export default VideoItem
