import React, { useEffect, useRef } from 'react'
import './Video.scss'

const Video = ({ videoId, onPlayStateChange }) => {
  const iframeRef = useRef(null)

  useEffect(() => {
    // Function to handle message events from the YouTube iframe
    const handleMessage = (event) => {
      // Make sure the message is from YouTube
      if (
        event.origin !== 'https://www.youtube.com' &&
        event.origin !== 'https://www.youtube-nocookie.com'
      ) {
        return
      }

      try {
        // YouTube sends messages in different formats, handle both string and object formats
        const data =
          typeof event.data === 'string' ? JSON.parse(event.data) : event.data

        // Handle YT API events
        if (
          data.event === 'onStateChange' ||
          data.info?.playerState !== undefined
        ) {
          // Extract player state from different message formats
          const playerState =
            data.info === undefined ? data.data : data.info.playerState

          // Handle player state: 1=playing, 2=paused, 0=ended, 3=buffering
          if (playerState === 1 || playerState === 'PLAYING') {
            onPlayStateChange && onPlayStateChange(true)
          } else if (
            playerState === 0 ||
            playerState === 2 ||
            playerState === 'ENDED' ||
            playerState === 'PAUSED'
          ) {
            onPlayStateChange && onPlayStateChange(false)
          }
        }
      } catch (e) {
        // Not a JSON message or doesn't have the expected format
        console.debug('Failed to parse YouTube message:', e)
      }
    }

    // Add event listener
    window.addEventListener('message', handleMessage)

    // Send a message to the iframe to start listening for events
    setTimeout(() => {
      if (iframeRef.current) {
        try {
          // This forces the iframe to initialize the JS API
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

    // Clean up
    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [onPlayStateChange, videoId])

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
