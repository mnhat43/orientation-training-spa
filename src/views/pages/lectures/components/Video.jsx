import React, { useEffect, useRef } from 'react'
import './Video.scss'

const Video = ({ videoId, setIsVideoPlaying }) => {
  const iframeRef = useRef(null)

  useEffect(() => {
    const handleMessage = (event) => {
      if (
        event.origin !== 'https://www.youtube.com' &&
        event.origin !== 'https://www.youtube-nocookie.com'
      ) {
        return
      }

      try {
        const data =
          typeof event.data === 'string' ? JSON.parse(event.data) : event.data

        if (
          data.event === 'onStateChange' ||
          data.info?.playerState !== undefined
        ) {
          const playerState =
            data.info === undefined ? data.data : data.info.playerState

          if (playerState === 1 || playerState === 'PLAYING') {
            setIsVideoPlaying && setIsVideoPlaying(true)
          } else if (
            playerState === 0 ||
            playerState === 2 ||
            playerState === 'ENDED' ||
            playerState === 'PAUSED'
          ) {
            setIsVideoPlaying && setIsVideoPlaying(false)
          }
        }
      } catch (e) {
        console.debug('Failed to parse YouTube message:', e)
      }
    }

    window.addEventListener('message', handleMessage)

    setTimeout(() => {
      if (iframeRef.current) {
        try {
          iframeRef.current.contentWindow.postMessage(
            JSON.stringify({
              event: 'listening',
              id: videoId,
            }),
            '*',
          )
        } catch (e) {
          console.error('Failed to send message to iframe:', e)
        }
      }
    }, 1000)

    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [setIsVideoPlaying, videoId])

  return (
    <iframe
      ref={iframeRef}
      src={`https://www.youtube-nocookie.com/embed/${videoId}?enablejsapi=1&origin=${encodeURIComponent(
        window.location.origin,
      )}&rel=0&modestbranding=1&widgetid=1`}
      title="YouTube video player"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      loading="lazy"
      className="youtube-iframe"
    />
  )
}

export default Video
