import React from 'react'
import { ClockCircleOutlined } from '@ant-design/icons'
import moment from 'moment'

const LastLoginCell = ({ lastLogin }) => {
  if (!lastLogin) {
    return (
      <div style={{ color: '#999', fontSize: '12px' }}>
        <ClockCircleOutlined style={{ marginRight: 4 }} />
        Never logged in
      </div>
    )
  }

  const loginDate = moment(lastLogin)
  const now = moment()
  const diffDays = now.diff(loginDate, 'days')

  let color = '#52c41a'
  if (diffDays > 7) color = '#faad14'
  if (diffDays > 30) color = '#ff4d4f'

  return (
    <div>
      <div style={{ color, fontSize: '12px', fontWeight: 500 }}>
        {loginDate.format('MMM DD, YYYY')}
      </div>
      <div style={{ color: '#999', fontSize: '11px' }}>
        {loginDate.format('HH:mm A')}
      </div>
      <div style={{ color: '#999', fontSize: '10px' }}>
        {diffDays === 0
          ? 'Today'
          : diffDays === 1
            ? 'Yesterday'
            : `${diffDays} days ago`}
      </div>
    </div>
  )
}

export default LastLoginCell
