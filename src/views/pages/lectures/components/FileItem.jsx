import React from 'react'
import { FilePdfOutlined } from '@ant-design/icons'
import LectureItem from './LectureItem'

const FileItem = ({ lecture, highlight, chooseLecture }) => {
  return (
    <LectureItem
      lecture={lecture}
      highlight={highlight}
      chooseLecture={chooseLecture}
      ItemIcon={FilePdfOutlined}
      itemType="file"
      durationField="required_time"
    />
  )
}

export default React.memo(FileItem)
