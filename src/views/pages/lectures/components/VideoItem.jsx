import React from 'react'
import { PlaySquareOutlined } from '@ant-design/icons'
import LectureItem from './LectureItem'

const VideoItem = ({ lecture, highlight, chooseLecture }) => {
  return (
    <LectureItem
      lecture={lecture}
      highlight={highlight}
      chooseLecture={chooseLecture}
      ItemIcon={PlaySquareOutlined}
      itemType="video"
      durationField="duration"
    />
  )
}

export default React.memo(VideoItem)
