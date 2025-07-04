import React from 'react'
import { Tooltip, Popconfirm, Tag } from 'antd'
import {
  EditOutlined,
  DeleteOutlined,
  ClockCircleOutlined,
  LockOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons'
import { CATEGORIES, CATEGORY_COLORS, ROLES } from '@constants'
import './index.scss'
import { formatTime } from '@helpers/common'

const DEFAULT_COURSE_SVG = `
<svg width="320" height="180" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="courseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3498db" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#2c3e50" stop-opacity="0.9"/>
    </linearGradient>
  </defs>
  <rect width="320" height="180" fill="url(#courseGradient)" />
  <g transform="translate(160, 80)" fill="#ffffff">
    <path d="M-40,-30 L40,-30 L40,30 L-40,30 Z" fill="none" stroke="#ffffff" stroke-width="4" />
    <path d="M-30,-20 L-30,20 M-20,-20 L-20,20 M-10,-20 L-10,20 M0,-20 L0,20 M10,-20 L10,20 M20,-20 L20,20 M30,-20 L30,20" 
          stroke="#ffffff" stroke-width="2" stroke-opacity="0.7" />
    <circle cx="0" cy="0" r="15" fill="#ffffff" fill-opacity="0.9" />
    <path d="M-7,-7 L7,7 M-7,7 L7,-7" stroke="#3498db" stroke-width="4" stroke-linecap="round" />
  </g>
  <text x="160" y="140" font-family="Arial, sans-serif" font-size="14" text-anchor="middle" fill="#ffffff" font-weight="bold">
    TRAINING COURSE
  </text>
</svg>
`

const DEFAULT_IMAGE_URL = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(DEFAULT_COURSE_SVG)}`

const COLOR_MAP = {
  blue: { color: '#1890ff', background: '#e6f7ff' },
  green: { color: '#52c41a', background: '#f6ffed' },
  orange: { color: '#fa8c16', background: '#fff2e8' },
  purple: { color: '#722ed1', background: '#f9f0ff' },
  cyan: { color: '#13c2c2', background: '#e6fffb' },
  red: { color: '#f5222d', background: '#fff1f0' },
  gold: { color: '#faad14', background: '#fffbe6' },
  magenta: { color: '#eb2f96', background: '#fff0f6' },
  default: { color: '#1890ff', background: '#e6f7ff' },
}

const CourseCard = ({
  course,
  onDelete,
  onEdit,
  onClick,
  role = ROLES.MANAGER,
  status = {},
  position,
}) => {
  const {
    course_id,
    title,
    thumbnail,
    description,
    category,
    duration,
    skill_keyword,
  } = course
  const { locked = false, completed = false } = status
  const truncateText = (text) => {
    const fallbackText = 'No description available'
    const inputText = text || fallbackText

    const maxLength = 50

    if (inputText.length > maxLength) {
      let truncated = inputText.substring(0, maxLength)
      const lastSpace = truncated.lastIndexOf(' ')

      if (lastSpace > maxLength * 0.6) {
        truncated = inputText.substring(0, lastSpace)
      }

      const result = truncated.trim() + '...'
      return result
    }

    return inputText
  }

  const getCategoryName = (categoryKey) => {
    return CATEGORIES[categoryKey] || categoryKey || 'Uncategorized'
  }

  const getCategoryColor = (categoryKey) => {
    const colorName = CATEGORY_COLORS[categoryKey] || 'default'
    return COLOR_MAP[colorName] || COLOR_MAP.default
  }
  const handleEditClick = (e) => {
    e.stopPropagation()
    onEdit(course_id)
  }

  const confirmDelete = () => {
    onDelete(Number(course_id))
  }

  const handleImageError = (e) => {
    e.target.onerror = null
    e.target.src = DEFAULT_IMAGE_URL
    e.target.classList.add('placeholder-image')
  }

  const categoryName = getCategoryName(category)
  const categoryStyle = getCategoryColor(category)

  const getStatusClass = () => {
    if (locked) return 'locked'
    if (completed) return 'completed'
    return 'in-progress'
  }

  return (
    <div className="course-card-container">
      <div
        className={`course-card ${getStatusClass()}`}
        onClick={locked ? null : onClick}
      >
        <div className="card-thumbnail">
          <img
            src={thumbnail || DEFAULT_IMAGE_URL}
            alt={title}
            onError={handleImageError}
          />

          {!locked && (
            <div className="thumbnail-overlay">
              <button className="view-course-btn">View Course</button>
            </div>
          )}

          {role === ROLES.EMPLOYEE && position && (
            <div className="course-position">{position}</div>
          )}

          {role === ROLES.EMPLOYEE && locked && (
            <div className="locked-overlay">
              <LockOutlined />
            </div>
          )}

          {role === ROLES.EMPLOYEE && completed && (
            <div className="completed-overlay">
              <CheckCircleOutlined />
            </div>
          )}

          <div
            className="card-category"
            style={{
              backgroundColor: categoryStyle.background,
              color: categoryStyle.color,
            }}
          >
            {categoryName}
          </div>
        </div>

        <div className="card-body">
          <h3 className="card-title">{title}</h3>{' '}
          <Tooltip
            title={description || 'No description available'}
            placement="bottom"
            mouseEnterDelay={0.5}
          >
            <p className="card-description">
              {truncateText(description || 'No description available')}
            </p>
          </Tooltip>{' '}
          <div className="card-footer">
            {skill_keyword && skill_keyword.length > 0 && (
              <div className="skill-keywords">
                {skill_keyword.map((skill, index) => (
                  <Tag
                    key={index}
                    color="blue"
                    style={{
                      fontSize: '12px',
                      padding: '0 8px',
                      borderRadius: '10px',
                    }}
                  >
                    {skill}
                  </Tag>
                ))}
              </div>
            )}

            <div className="footer-bottom">
              <div className="card-duration">
                <ClockCircleOutlined /> {formatTime(duration)}
              </div>

              {role === ROLES.MANAGER && (
                <div className="card-actions">
                  <Tooltip title="Edit course">
                    <button
                      className="action-btn edit"
                      onClick={handleEditClick}
                    >
                      <EditOutlined />
                    </button>
                  </Tooltip>
                  <Tooltip title="Delete course">
                    <div onClick={(e) => e.stopPropagation()}>
                      <Popconfirm
                        title="Delete this course?"
                        description="All course content and progress will be permanently removed."
                        onConfirm={confirmDelete}
                        okText="Delete"
                        cancelText="Cancel"
                        okButtonProps={{ danger: true }}
                        placement="topRight"
                      >
                        <button className="action-btn delete">
                          <DeleteOutlined />
                        </button>
                      </Popconfirm>
                    </div>
                  </Tooltip>
                </div>
              )}

              {role === ROLES.EMPLOYEE && (
                <div className="course-status">
                  {locked ? (
                    <span className="status locked">
                      <LockOutlined /> Locked
                    </span>
                  ) : completed ? (
                    <span className="status completed">
                      <CheckCircleOutlined /> Completed
                    </span>
                  ) : (
                    <span className="status in-progress">Available</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseCard
