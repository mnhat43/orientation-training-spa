import { useEffect, useState, useCallback, useRef, memo, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import _ from 'lodash'

const USER_ACTIVITY_TIMEOUT = 10000
const TIMER_CHECK_INTERVAL = 500
const IS_DEV = process.env.NODE_ENV !== 'prod'

const LearningTimer = ({
  selectedLecture,
  lastLecture,
  isVideoPlaying,
  courseCompleted,
  onCompleteLecture,
  onCompleteCourse,
}) => {
  if (courseCompleted) return null

  const [isUserActive, setIsUserActive] = useState(false)
  const [timeSpent, setTimeSpent] = useState(0)
  const { courseId } = useParams()

  const { module_item_id, content, item_type } = selectedLecture

  const { required_time } = content

  const isFileContent = item_type == 'file'
  const isActive = isFileContent ? isUserActive : isVideoPlaying

  const refs = useRef({
    timer: null,
    activityTimer: null,
    startTime: null,
    completed: false,
    accumulatedTime: 0,
    lastPauseTime: null,
  }).current

  const completeProgress = useCallback(() => {
    if (refs.completed) return
    refs.completed = true

    if (_.isEqual(selectedLecture, lastLecture)) {
      onCompleteCourse()
      return
    }

    onCompleteLecture()
  }, [
    courseId,
    selectedLecture,
    refs,
    lastLecture,
    onCompleteCourse,
    onCompleteLecture,
  ])

  useEffect(() => {
    const resetTimer = () => {
      if (refs.timer) clearInterval(refs.timer)
      if (refs.activityTimer) clearTimeout(refs.activityTimer)
      refs.timer = null
      refs.activityTimer = null
      refs.startTime = null
      refs.completed = false
      refs.accumulatedTime = 0
      refs.lastPauseTime = null
      setTimeSpent(0)
      setIsUserActive(false)
    }

    resetTimer()
    return resetTimer
  }, [module_item_id, refs])

  useEffect(() => {
    if (!isFileContent) return

    function handleActivity() {
      if (refs.activityTimer) clearTimeout(refs.activityTimer)

      setIsUserActive(true)
      refs.activityTimer = setTimeout(() => {
        setIsUserActive(false)
      }, USER_ACTIVITY_TIMEOUT)
    }

    const events = [
      'mousemove',
      'mousedown',
      'scroll',
      'keypress',
      'touchstart',
    ]
    events.forEach((event) =>
      document.addEventListener(event, handleActivity, { passive: true }),
    )

    handleActivity()

    return () => {
      events.forEach((event) =>
        document.removeEventListener(event, handleActivity),
      )
      if (refs.activityTimer) clearTimeout(refs.activityTimer)
    }
  }, [isFileContent, refs])

  // Main timer logic
  useEffect(() => {
    if (refs.timer) {
      clearInterval(refs.timer)
      refs.timer = null
    }

    if (!isActive) {
      if (refs.startTime) {
        const sessionTime = Math.floor(
          (performance.now() - refs.startTime) / 1000,
        )
        refs.accumulatedTime += sessionTime
        refs.lastPauseTime = performance.now()
        refs.startTime = null
      }
      return
    }

    if (refs.completed) return

    refs.startTime = performance.now()

    refs.timer = setInterval(() => {
      const currentSessionTime = Math.floor(
        (performance.now() - refs.startTime) / 1000,
      )

      const totalTimeSpent = refs.accumulatedTime + currentSessionTime
      setTimeSpent(totalTimeSpent)

      if (totalTimeSpent >= required_time && !refs.completed) {
        clearInterval(refs.timer)
        refs.timer = null
        completeProgress()
      }
    }, TIMER_CHECK_INTERVAL)

    return () => {
      if (refs.timer) clearInterval(refs.timer)
    }
  }, [isActive, required_time, completeProgress, refs])

  // Simple debug display
  useEffect(() => {
    if (IS_DEV) {
      const debug = document.createElement('div')
      Object.assign(debug.style, {
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        padding: '8px',
        background: isActive ? 'rgba(0,128,0,0.7)' : 'rgba(0,0,0,0.7)',
        color: 'white',
        borderRadius: '4px',
        zIndex: 9999,
        fontSize: '12px',
      })

      const update = () => {
        debug.textContent = `${isFileContent ? 'File' : 'Video'}: ${timeSpent}/${required_time}s (${isActive ? 'ACTIVE' : 'PAUSED'})`
      }

      update()
      document.body.appendChild(debug)

      const interval = setInterval(update, 1000)

      return () => {
        clearInterval(interval)
        document.body.removeChild(debug)
      }
    }
  }, [
    timeSpent,
    isActive,
    isFileContent,
    required_time,
    refs.accumulatedTime,
    lastLecture,
  ])

  return null
}

export default memo(LearningTimer)
