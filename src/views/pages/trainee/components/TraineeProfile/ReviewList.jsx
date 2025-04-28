import React from 'react'
import { Row, Col, Typography, Rate } from 'antd'

const { Text, Paragraph } = Typography

const ReviewList = ({ comments }) => {
  return (
    <div style={{ maxHeight: '300px', overflow: 'auto' }}>
      {comments.map((comment, index) => (
        <div
          key={index}
          style={{
            padding: 12,
            borderRadius: 6,
            backgroundColor: '#f9f9f9',
            marginBottom: index < comments.length - 1 ? 12 : 0,
            border: '1px solid #eee',
          }}
        >
          <Row gutter={[8, 8]}>
            <Col flex="auto">
              <Text strong>{comment.author}</Text> -{' '}
              <Text>{comment.position}</Text>
            </Col>
            <Col>
              <Text type="secondary">{comment.date}</Text>
            </Col>
            <Col span={24}>
              <Rate
                disabled
                defaultValue={comment.rating}
                allowHalf
                style={{ fontSize: 12 }}
              />
              <Text
                type="secondary"
                style={{ marginLeft: 8, fontSize: '0.85rem' }}
              >
                {comment.rating}/5
              </Text>
            </Col>
            <Col span={24}>
              <Paragraph style={{ margin: 0 }}>{comment.comment}</Paragraph>
            </Col>
          </Row>
        </div>
      ))}
    </div>
  )
}

export default ReviewList
