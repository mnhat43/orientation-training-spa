import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { Alert, Spin, Card, Button } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import './Slide.scss'

const Slide = ({ filePath, requiredTime }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [iframeLoaded, setIframeLoaded] = useState(false)
  const [iframeError, setIframeError] = useState(false)
  const [currentViewer, setCurrentViewer] = useState('office-online') // Default to Office Online

  useEffect(() => {
    if (filePath) {
      console.log('Slide component mounted with filePath:', filePath)
      setLoading(false)
    }
  }, [filePath])

  // Handle iframe load
  const handleIframeLoad = () => {
    setIframeLoaded(true)
    console.log('Viewer loaded successfully')
  }

  const handleIframeError = () => {
    setIframeError(true)
    console.error('Viewer failed to load')
  }

  // Create viewer URLs
  const encodedFilePath = encodeURIComponent(filePath)

  // Office Online URL for PowerPoint-like experience (like in the image)
  const officeOnlineUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodedFilePath}&wdStartSlideShow=0&wdView=0`

  // Google Docs viewer as fallback
  const googleDocsUrl = `https://docs.google.com/viewer?url=${encodedFilePath}&embedded=true`

  const switchToFallback = () => {
    if (currentViewer === 'office-online') {
      setCurrentViewer('google-docs')
      setIframeError(false)
    }
  }
  console.log('Rendering Slide component:', {
    filePath,
    loading,
    error,
    officeOnlineUrl,
    googleDocsUrl,
    currentViewer,
    iframeLoaded,
    iframeError,
  })
  if (loading) {
    return (
      <div className="slide-container loading">
        <Card className="slide-loading-card">
          <Spin size="large" />
          <p style={{ marginTop: 16, textAlign: 'center' }}>
            Loading presentation...
          </p>
        </Card>
      </div>
    )
  }
  if (error) {
    return (
      <div className="slide-container error">
        <Alert
          message="Failed to Load Presentation"
          description={error}
          type="error"
          showIcon
          icon={<ExclamationCircleOutlined />}
          className="slide-error-alert"
        />{' '}
      </div>
    )
  }
  return (
    <div className="slide-container">
      {/* Google Docs viewer - Full width */}
      <div className="slide-viewer-content">
        {iframeError && (
          <div className="slide-error-overlay">
            <Alert
              message="Google Docs viewer failed to load"
              description="Please check the file URL and try again"
              type="warning"
              showIcon
            />
          </div>
        )}

        <iframe
          src={googleDocsUrl}
          className="slide-viewer-iframe"
          title="Google Docs Presentation Viewer"
          frameBorder="0"
          allowFullScreen
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          style={{
            display: !iframeError ? 'block' : 'none',
          }}
        />
      </div>
    </div>
  )
}

Slide.propTypes = {
  filePath: PropTypes.string.isRequired,
  requiredTime: PropTypes.number,
}

export default Slide
