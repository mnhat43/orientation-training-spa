import { useEffect, useState, useCallback, useRef, memo } from 'react'

const REQUIRED_TIME_DEFAULT = 10
const USER_ACTIVITY_TIMEOUT = 10000
const TIMER_CHECK_INTERVAL = 500
const IS_DEV = process.env.NODE_ENV !== 'production'

const LearningTimer = ({
  lecture,
  courseId,
  isVideoPlaying,
  allLectures = [],
  courseCompleted = false,
  isLastLecture = false,
  onCompleteLecture,
  onCompleteCourse,
}) => {
  if (courseCompleted) return null

  const [isUserActive, setIsUserActive] = useState(false)
  const [timeSpent, setTimeSpent] = useState(0)

  const {
    module_id,
    module_position,
    module_item_id,
    module_item_position,
    required_time,
    item_type,
  } = lecture

  const requiredTime = required_time > 0 ? required_time : REQUIRED_TIME_DEFAULT
  const isFileContent = item_type !== 'video'
  const isActive = isFileContent ? isUserActive : isVideoPlaying

  // Technical refs for timer management
  const refs = useRef({
    timer: null,
    activityTimer: null,
    startTime: null,
    completed: false,
    accumulatedTime: 0,
    lastPauseTime: null,
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

  // Handle completion - now handles both lecture completion and course completion
  const completeProgress = useCallback(() => {
    if (refs.completed) return
    refs.completed = true

    // If this is the last lecture, complete the course instead
    if (isLastLecture) {
      onCompleteCourse()
      return
    }

    // Otherwise find next lecture and update progress as before
    const nextLecture = findNextLecture()
    if (!nextLecture) return

    // Notify parent component with completion data
    onCompleteLecture({
      courseId: Number(courseId),
      modulePosition: Number(nextLecture.module_position),
      moduleItemPosition: Number(nextLecture.module_item_position),
      currentModule: module_id,
      currentItem: module_item_id,
    })
  }, [
    courseId,
    findNextLecture,
    module_id,
    module_item_id,
    refs,
    isLastLecture,
    onCompleteCourse,
    onCompleteLecture,
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
      refs.accumulatedTime = 0 // Reset accumulated time
      refs.lastPauseTime = null
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

  // Main timer logic - modified to accumulate time
  useEffect(() => {
    if (refs.timer) {
      clearInterval(refs.timer)
      refs.timer = null
    }

    // When active state changes, handle accumulated time
    if (!isActive) {
      // If we were active before and now we're inactive, store progress
      if (refs.startTime) {
        const sessionTime = Math.floor(
          (performance.now() - refs.startTime) / 1000,
        )
        refs.accumulatedTime += sessionTime // Add session time to accumulated time
        refs.lastPauseTime = performance.now()
        refs.startTime = null
      }
      return
    }

    // Only proceed if active and not completed
    if (refs.completed) return

    // Start fresh timing session
    refs.startTime = performance.now()

    refs.timer = setInterval(() => {
      // Calculate current session time
      const currentSessionTime = Math.floor(
        (performance.now() - refs.startTime) / 1000,
      )

      // Total time is accumulated plus current session
      const totalTimeSpent = refs.accumulatedTime + currentSessionTime
      setTimeSpent(totalTimeSpent)

      // Complete the lesson when time requirement is met
      if (totalTimeSpent >= requiredTime && !refs.completed) {
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
  }, [
    timeSpent,
    isActive,
    isFileContent,
    requiredTime,
    refs.accumulatedTime,
    isLastLecture,
  ])

  return null
}

export default memo(LearningTimer)
