import { Typography, List } from 'antd'
import { CheckCircleOutlined, LockOutlined } from '@ant-design/icons'

const VideoItem = ({
  lecture,
  highlight,
  chooseLecture,
  completed,
  accessible,
}) => {
  return (
    <List.Item
      onClick={() => accessible && chooseLecture()}
      style={{
        backgroundColor: highlight ? '#d9d9d9' : undefined,
        paddingLeft: '14px',
        cursor: accessible ? 'pointer' : 'not-allowed',
        justifyContent: 'initial',
        overflowX: 'hidden',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        opacity: accessible ? 1 : 0.5,
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
      {!accessible && (
        <LockOutlined style={{ color: 'red', marginLeft: '8px' }} />
      )}
    </List.Item>
  )
}

export default VideoItem
