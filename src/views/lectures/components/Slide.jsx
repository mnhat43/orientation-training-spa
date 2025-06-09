import React, { useState, useEffect } from 'react'
import { Button, Badge, Card, Spin, Alert, Typography } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import JSZip from 'jszip'
import slideApi from '@api/slide'
import './Slide.scss'

const { Text } = Typography

const getMimeType = (extension) => {
  const mimeTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.pdf': 'application/pdf',
    '.html': 'text/html',
    '.htm': 'text/html',
  }
  return mimeTypes[extension] || 'application/octet-stream'
}

const Slide = ({ filePath }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [slides, setSlides] = useState([])
  const [timeSpent, setTimeSpent] = useState(0)

  useEffect(() => {
    const startTime = Date.now()

    const timer = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (slides.length === 0) return

      switch (event.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
          event.preventDefault()
          setCurrentSlide((prev) => Math.max(0, prev - 1))
          break
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ':
          event.preventDefault()
          setCurrentSlide((prev) => Math.min(slides.length - 1, prev + 1))
          break
        case 'Home':
          event.preventDefault()
          setCurrentSlide(0)
          break
        case 'End':
          event.preventDefault()
          setCurrentSlide(slides.length - 1)
          break
        default:
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [slides.length])
  useEffect(() => {
    const loadSlides = async () => {
      try {
        setIsLoading(true)
        setError(null)

        console.log('Loading slides from:', filePath)

        const arrayBuffer = await slideApi.getSlideFile(filePath)
        console.log('Successfully fetched slide file')

        const zip = new JSZip()
        const zipData = await zip.loadAsync(arrayBuffer)

        const slideFiles = []
        const supportedExtensions = [
          '.jpg',
          '.jpeg',
          '.png',
          '.gif',
          '.svg',
          '.webp',
          '.pdf',
          '.html',
          '.htm',
        ]
        for (const [filename, file] of Object.entries(zipData.files)) {
          if (!file.dir) {
            const extension = filename
              .toLowerCase()
              .substring(filename.lastIndexOf('.'))

            if (supportedExtensions.includes(extension)) {
              let content = null

              try {
                if (
                  ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'].includes(
                    extension,
                  )
                ) {
                  const blob = await file.async('blob')

                  if (blob && blob.size > 0) {
                    const mimeType = getMimeType(extension)
                    const typedBlob = new Blob([blob], { type: mimeType })
                    content = URL.createObjectURL(typedBlob)

                    console.log(`✅ Created blob URL for image ${filename}:`, {
                      url: content,
                      originalSize: blob.size,
                      newSize: typedBlob.size,
                      mimeType: mimeType,
                      extension: extension,
                    })

                    try {
                      const testResponse = await fetch(content, {
                        method: 'HEAD',
                      })
                      console.log(`🧪 Blob URL test for ${filename}:`, {
                        status: testResponse.status,
                        contentType: testResponse.headers.get('content-type'),
                        contentLength:
                          testResponse.headers.get('content-length'),
                      })
                    } catch (testError) {
                      console.warn(
                        `⚠️ Blob URL test failed for ${filename}:`,
                        testError.message,
                      )

                      try {
                        const reader = new FileReader()
                        const dataUrl = await new Promise((resolve, reject) => {
                          reader.onload = () => resolve(reader.result)
                          reader.onerror = reject
                          reader.readAsDataURL(typedBlob)
                        })

                        URL.revokeObjectURL(content)
                        content = dataUrl
                        console.log(
                          `🔄 Using data URL fallback for ${filename}`,
                        )
                      } catch (dataUrlError) {
                        console.error(
                          `❌ Data URL fallback failed for ${filename}:`,
                          dataUrlError,
                        )
                      }
                    }
                  } else {
                    console.warn(`❌ Invalid blob for ${filename}:`, blob)
                    continue
                  }
                } else if (extension === '.pdf') {
                  const blob = await file.async('blob')
                  if (blob && blob.size > 0) {
                    content = URL.createObjectURL(blob)
                    console.log(
                      `Created blob URL for PDF ${filename}:`,
                      content,
                    )
                  } else {
                    console.warn(`Invalid PDF blob for ${filename}`)
                    continue
                  }
                } else if (['.html', '.htm'].includes(extension)) {
                  content = await file.async('text')
                  if (!content || content.trim().length === 0) {
                    console.warn(`Empty HTML content for ${filename}`)
                    continue
                  }
                }

                slideFiles.push({
                  name: filename,
                  type: extension.substring(1),
                  content: content,
                  size: file._data
                    ? file._data.uncompressedSize
                    : blob?.size || 0,
                })

                console.log(`Successfully processed ${filename} (${extension})`)
              } catch (fileError) {
                console.error(`Error processing file ${filename}:`, fileError)
              }
            }
          }
        }

        slideFiles.sort((a, b) =>
          a.name.localeCompare(b.name, undefined, { numeric: true }),
        )

        setSlides(slideFiles)

        if (slideFiles.length === 0) {
          setError(
            'No supported slide files found in the ZIP. Supported formats: images (jpg, png, gif, svg, webp), PDF, HTML',
          )
        }
      } catch (err) {
        console.error('Error loading slides:', err)
        setError(`Failed to load slides: ${err.message}`)
      } finally {
        setIsLoading(false)
      }
    }

    if (filePath) {
      loadSlides()
    }
  }, [filePath])

  useEffect(() => {
    return () => {
      slides.forEach((slide) => {
        if (slide.content && slide.content.startsWith('blob:')) {
          URL.revokeObjectURL(slide.content)
        }
      })
    }
  }, [slides])
  const renderSlideContent = (slide) => {
    if (!slide) return null

    switch (slide.type) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'svg':
      case 'webp':
        return (
          <div className="slide-image-container">
            <img
              src={slide.content}
              alt={`Slide: ${slide.name}`}
              className="slide-image"
              onError={(e) => {
                if (slide.content.startsWith('blob:')) {
                  fetch(slide.content, { method: 'HEAD' })
                    .then((response) => {
                      console.log('🔍 Blob URL fetch test:', {
                        status: response.status,
                        statusText: response.statusText,
                        headers: Object.fromEntries(response.headers.entries()),
                        url: slide.content,
                      })
                    })
                    .catch((err) => {
                      console.error('🔍 Blob URL fetch failed:', err.message)
                    })
                }
              }}
            />
          </div>
        )

      case 'pdf':
        return (
          <iframe
            src={slide.content}
            className="slide-pdf"
            title={`Slide: ${slide.name}`}
            onLoad={() => console.log('PDF loaded:', slide.name)}
            onError={(e) => console.error('PDF load error:', slide.name, e)}
          />
        )

      case 'html':
      case 'htm':
        return (
          <iframe
            srcDoc={slide.content}
            className="slide-html"
            title={`Slide: ${slide.name}`}
            sandbox="allow-scripts allow-same-origin"
            onLoad={() => console.log('HTML loaded:', slide.name)}
            onError={(e) => console.error('HTML load error:', slide.name, e)}
          />
        )

      default:
        return (
          <div className="slide-unsupported">
            <p>Unsupported file type: {slide.type}</p>
            <p>File: {slide.name}</p>
          </div>
        )
    }
  }

  if (isLoading) {
    return (
      <div className="slide-container loading">
        <Card className="slide-loading-card">
          <Spin size="large" />
          <Text
            style={{ marginTop: 16, display: 'block', textAlign: 'center' }}
          >
            Loading slide content...
          </Text>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="slide-container error">
        <Alert
          message="Slide Not Available"
          description={error}
          type="error"
          showIcon
          className="slide-error-alert"
          action={
            <Button
              size="small"
              icon={<DownloadOutlined />}
              onClick={() => window.open(filePath, '_blank')}
            >
              Download
            </Button>
          }
        />
      </div>
    )
  }
  return (
    <div>
      <div className="slide-header">
        <Badge
          count={`${currentSlide + 1} / ${slides.length}`}
          style={{
            backgroundColor: '#1890ff',
            fontSize: '12px',
            fontWeight: 'bold',
          }}
        />
      </div>

      {/* Simple two-column layout */}
      <div className="slide-main-layout">
        {/* Left: Thumbnail list with fixed width */}
        <div className="slide-thumbnails-list">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`thumbnail-item ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
            >
              {/* Thumbnail image/preview */}
              <div className="thumbnail-preview">
                {slide.type !== 'pdf' &&
                slide.type !== 'html' &&
                slide.type !== 'htm' ? (
                  <img
                    src={slide.content}
                    alt={slide.name}
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'flex'
                    }}
                  />
                ) : null}
                <div className="thumbnail-fallback">
                  {slide.type.toUpperCase()}
                </div>
              </div>

              {/* Slide number */}
              <div className="thumbnail-number">{index + 1}</div>
            </div>
          ))}
        </div>

        {/* Right: Main slide content with fixed dimensions */}
        <div className="slide-content-area">
          {slides.length > 0 ? (
            <div className="slide-viewer">
              {renderSlideContent(slides[currentSlide])}
            </div>
          ) : (
            <div className="no-slides">
              <Text type="secondary">No slides available</Text>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Slide
