import React from 'react'
import { Button, Tooltip } from 'antd'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import './PlaylistToggle.scss'

const PlaylistToggle = ({ visible, onToggle }) => {
  return (
    <Tooltip
      title={visible ? 'Hide playlist' : 'Show playlist'}
      placement="left"
    >
      <Button
        className={`playlist-toggle ${visible ? 'expanded' : 'collapsed'}`}
        onClick={onToggle}
        type="primary"
        icon={visible ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
        aria-label={visible ? 'Hide playlist' : 'Show playlist'}
      >
        {visible ? 'Hide Playlist' : 'Show Playlist'}
      </Button>
    </Tooltip>
  )
}

export default PlaylistToggle
