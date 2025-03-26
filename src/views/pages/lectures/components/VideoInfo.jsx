import { Typography } from 'antd'

const VideoInfo = ({ lecture }) => {
  return (
    <div style={{ backgroundColor: '#fafafa', borderRadius: '10px', overflow: 'hidden', alignItems: 'center', padding: '8px 12px' }}>
      <div>
        <Typography.Title style={{ margin: '0px' }} level={4}>
          {lecture.title}
        </Typography.Title>
        <div style={{ marginTop: '4px', color: '#bfbfbf', fontSize: '12px', fontWeight: '600' }}>
          {lecture.publishedAt}
        </div>
      </div>
    </div>
  )
}

export default VideoInfo
