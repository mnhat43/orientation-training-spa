import React from 'react'
import { Typography, Space, Tag } from 'antd'
import { CalendarOutlined } from '@ant-design/icons'
import './VideoInfo.scss'

const { Title, Paragraph } = Typography

const VideoInfo = ({
  title,
  description,
  publishedAt,
  duration,
  tags = [],
}) => {
  const formattedDate = publishedAt
    ? new Date(publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  return (
    <div className="video-info">
      {title && (
        <Title level={3} className="video-info__title">
          {title}
        </Title>
      )}

      <div className="video-info__meta">
        {formattedDate && (
          <Space className="video-info__date">
            <CalendarOutlined />
            <span>{formattedDate}</span>
          </Space>
        )}

        {duration && <span className="video-info__duration">{duration}</span>}
      </div>

      {tags && tags.length > 0 && (
        <div className="video-info__tags">
          {tags.map((tag) => (
            <Tag key={tag} color="blue">
              {tag}
            </Tag>
          ))}
        </div>
      )}

      {description && (
        <Paragraph className="video-info__description">{description}</Paragraph>
      )}
    </div>
  )
}

export default VideoInfo
