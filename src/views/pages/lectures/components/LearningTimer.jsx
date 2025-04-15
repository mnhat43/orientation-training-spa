import { useEffect, useState, useCallback, useRef, memo } from 'react'
import useAuth from '@hooks/useAuth'

// Simple constants
const REQUIRED_TIME_DEFAULT = 10
const USER_ACTIVITY_TIMEOUT = 10000
const TIMER_CHECK_INTERVAL = 500
const IS_DEV = process.env.NODE_ENV !== 'production'

const LearningTimer = ({
  lecture,
  onComplete,
  courseId,
  isVideoPlaying,
  allLectures = [],
}) => {
  // User data and basic state
  const { userData } = useAuth()
  const userId = userData?.id
  const [isUserActive, setIsUserActive] = useState(false)
  const [timeSpent, setTimeSpent] = useState(0)

  // Important lecture properties
  const {
    module_id,
    module_position,
    module_item_id,
    module_item_position,
    required_time = 0,
    item_type,
  } = lecture || {}

  // Core logic values
  const requiredTime = required_time > 0 ? required_time : REQUIRED_TIME_DEFAULT
  const isFileContent = item_type !== 'video'
  const isActive = isFileContent ? isUserActive : isVideoPlaying

  // Technical refs for timer management
  const refs = useRef({
    timer: null,
    activityTimer: null,
    startTime: null,
    completed: false,
  }).current

  // Find next lecture in course
  const findNextLecture = useCallback(() => {
    if (!allLectures?.length) return null

    const currentModulePos = Number(module_position)
    const currentItemPos = Number(module_item_position)

    // First check in same module
    const nextInModule = allLectures.find(
      (lec) =>
        Number(lec.module_position) === currentModulePos &&
        Number(lec.module_item_position) > currentItemPos,
    )

    if (nextInModule) return nextInModule

    // Then check next module
    return allLectures.find(
      (lec) => Number(lec.module_position) > currentModulePos,
    )
  }, [allLectures, module_position, module_item_position])

  // Handle completion - now just notifies parent without API call
  const completeProgress = useCallback(() => {
    if (refs.completed) return
    refs.completed = true

    const nextLecture = findNextLecture()
    if (!nextLecture || !userId) return

    // Notify parent component with completion data
    onComplete({
      userId,
      courseId: Number(courseId),
      modulePosition: Number(nextLecture.module_position),
      moduleItemPosition: Number(nextLecture.module_item_position),
      currentModule: module_id,
      currentItem: module_item_id,
    })
  }, [
    userId,
    courseId,
    findNextLecture,
    module_id,
    module_item_id,
    onComplete,
    refs,
  ])

  // Reset everything when lecture changes
  useEffect(() => {
    const resetTimer = () => {
      if (refs.timer) clearInterval(refs.timer)
      if (refs.activityTimer) clearTimeout(refs.activityTimer)
      refs.timer = null
      refs.activityTimer = null
      refs.startTime = null
      refs.completed = false
      setTimeSpent(0)
      setIsUserActive(false)
    }

    resetTimer()
    return resetTimer
  }, [module_id, module_item_id, refs])

  // Track user activity for file content
  useEffect(() => {
    if (!isFileContent) return

    function handleActivity() {
      if (refs.activityTimer) clearTimeout(refs.activityTimer)

      setIsUserActive(true)
      refs.activityTimer = setTimeout(() => {
        setIsUserActive(false)
      }, USER_ACTIVITY_TIMEOUT)
    }

    // Add events with passive option for performance
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

    handleActivity() // Initialize

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

    // Only run timer when user is active
    if (!isActive || refs.completed) return

    refs.startTime = performance.now()

    refs.timer = setInterval(() => {
      const elapsedSeconds = Math.floor(
        (performance.now() - refs.startTime) / 1000,
      )
      setTimeSpent(elapsedSeconds)

      // Complete the lesson when time requirement is met
      if (elapsedSeconds >= requiredTime && !refs.completed) {
        clearInterval(refs.timer)
        refs.timer = null
        completeProgress()
      }
    }, TIMER_CHECK_INTERVAL)

    return () => {
      if (refs.timer) clearInterval(refs.timer)
    }
  }, [isActive, requiredTime, completeProgress, refs])

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
        debug.textContent = `${isFileContent ? 'File' : 'Video'}: ${timeSpent}/${requiredTime}s (${isActive ? 'ACTIVE' : 'PAUSED'})`
      }

      update()
      document.body.appendChild(debug)

      const interval = setInterval(update, 1000)

      return () => {
        clearInterval(interval)
        document.body.removeChild(debug)
      }
    }
  }, [timeSpent, isActive, isFileContent, requiredTime])

  return null
}

export default memo(LearningTimer)
