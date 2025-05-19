import { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import lecture from '@api/lecture'
import userprogress from '@api/userprogress'
import { useParams } from 'react-router-dom'

const useLectureData = () => {
  const navigate = useNavigate()
  const { moduleId, moduleItemId, courseId } = useParams()

  const [lectures, setLectures] = useState({})
  const [selectedLecture, setSelectedLecture] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [courseCompleted, setCourseCompleted] = useState(false)

  const allLectures = useMemo(() => Object.values(lectures).flat(), [lectures])

  const latestUnlockedLecture = useMemo(() => {
    if (!Array.isArray(allLectures) || !allLectures.length) return null

    const unlockedLectures = allLectures.filter(
      (lecture) => lecture.unlocked === true,
    )
    if (!unlockedLectures.length) return null

    return unlockedLectures.reduce((highest, current) => {
      const currentModulePosition = parseInt(current.module_position)
      const highestModulePosition = highest
        ? parseInt(highest.module_position)
        : -1

      if (currentModulePosition > highestModulePosition) return current
      if (currentModulePosition < highestModulePosition) return highest

      return parseInt(current.module_item_position) >
        parseInt(highest.module_item_position)
        ? current
        : highest
    }, null)
  }, [allLectures])

  const lastLecture = useMemo(() => {
    if (!Array.isArray(allLectures) || !allLectures.length) return null

    return allLectures.reduce((highest, current) => {
      if (!highest) return current

      const currentModulePosition = parseInt(current.module_position)
      const highestModulePosition = parseInt(highest.module_position)

      if (currentModulePosition > highestModulePosition) return current
      if (currentModulePosition < highestModulePosition) return highest

      return parseInt(current.module_item_position) >
        parseInt(highest.module_item_position)
        ? current
        : highest
    }, null)
  }, [allLectures])

  const isLatestUnlocked = useMemo(() => {
    if (!selectedLecture || !latestUnlockedLecture) return false

    return selectedLecture === latestUnlockedLecture
  }, [selectedLecture, latestUnlockedLecture])

  const isLastLecture = useMemo(() => {
    if (!selectedLecture || !lastLecture) return false

    return selectedLecture === lastLecture
  }, [selectedLecture, lastLecture])

  const selectLecture = useCallback(
    (moduleId, moduleItemId) => {
      const findLectureById = (moduleId, moduleItemId) => {
        if (!Array.isArray(allLectures) || !allLectures.length) return null
        if (!moduleId || !moduleItemId) return allLectures[0]

        return (
          allLectures.find(
            (lecture) =>
              lecture.module_id === parseInt(moduleId) &&
              lecture.module_item_id === parseInt(moduleItemId),
          ) || null
        )
      }
      const lecture = findLectureById(moduleId, moduleItemId)

      if (lecture) {
        setSelectedLecture(lecture)
        return lecture
      }

      return null
    },
    [moduleId, moduleItemId, courseId],
  )

  const handleChooseLecture = useCallback(
    (moduleId, moduleItemId) => {
      navigate(`/course/${courseId}/lectures/${moduleId}/${moduleItemId}`)
      selectLecture(moduleId, moduleItemId)
    },
    [navigate, courseId],
  )

  const checkCourseCompletionStatus = useCallback(async () => {
    if (!courseId) return false

    try {
      const response = await userprogress.getUserProgressSingle({
        course_id: parseInt(courseId),
      })

      if (
        response.status === 1 &&
        response.data &&
        response.data.completed === true
      ) {
        setCourseCompleted(true)
        return true
      }
      return false
    } catch (error) {
      console.error('Failed to check course completion status:', error)
      return false
    }
  }, [courseId])

  const fetchLectures = async () => {
    if (!courseId) return

    try {
      setLoading(true)
      setError(null)
      const response = await lecture.getListLecture({
        course_id: parseInt(courseId),
      })
      setLectures(response.data)

      await checkCourseCompletionStatus()
    } catch (error) {
      console.error('Failed to fetch lectures:', error.message)
      setError(error.message || 'Failed to fetch lectures')
    } finally {
      setLoading(false)
    }
  }

  const handleCompleteCourse = useCallback(async () => {
    try {
      const response = await userprogress.updateUserProgress({
        course_id: parseInt(courseId),
        completed: true,
      })
      if (response.status === 1 && response.data) {
        setCourseCompleted(true)
        return true
      }
      return false
    } catch (error) {
      console.error('Failed to complete course:', error)
      return false
    }
  }, [selectedLecture])

  const handleCompleteLecture = useCallback(async () => {
    try {
      const findNextLecture = (
        allLectures,
        currentModulePosition,
        currentItemPosition,
      ) => {
        if (!allLectures?.length) return null

        const currentModulePos = Number(currentModulePosition)
        const currentItemPos = Number(currentItemPosition)

        const nextInModule = allLectures.find(
          (lec) =>
            Number(lec.module_position) === currentModulePos &&
            Number(lec.module_item_position) > currentItemPos,
        )

        if (nextInModule) return nextInModule

        return allLectures.find(
          (lec) => Number(lec.module_position) > currentModulePos,
        )
      }

      const nextLecture = findNextLecture(
        allLectures,
        selectedLecture.module_position,
        selectedLecture.module_item_position,
      )

      const response = await userprogress.updateUserProgress({
        course_id: Number(courseId),
        module_position: Number(nextLecture.module_position),
        module_item_position: Number(nextLecture.module_item_position),
      })

      if (response.status === 1 && response?.data) {
        const updatedData = response.data

        setLectures((prevLectures) => {
          const newLectures = { ...prevLectures }

          Object.keys(newLectures).forEach((week) => {
            const weekLectures = [...newLectures[week]]
            let updated = false

            for (let i = 0; i < weekLectures.length; i++) {
              const lecture = weekLectures[i]

              if (
                parseInt(lecture.module_position) ===
                  parseInt(updatedData.module_position) &&
                parseInt(lecture.module_item_position) ===
                  parseInt(updatedData.module_item_position)
              ) {
                weekLectures[i] = { ...lecture, unlocked: true }
                updated = true
                break
              }
            }

            if (updated) {
              newLectures[week] = weekLectures
            }
          })
          console.log('Updated lectures:', newLectures)

          return newLectures
        })
      }
    } catch (error) {
      console.error('Failed to update progress:', error)
    }
  }, [selectedLecture])

  useEffect(() => {
    if (courseId) {
      checkCourseCompletionStatus()
    }
  }, [courseId, checkCourseCompletionStatus])

  useEffect(() => {
    fetchLectures()
  }, [])

  useEffect(() => {
    if (loading || !allLectures.length) return

    const lecture = selectLecture(moduleId, moduleItemId)

    if (!lecture && allLectures.length > 0) {
      const firstLecture = allLectures[0]
      setSelectedLecture(firstLecture)

      navigate(
        `/course/${courseId}/lectures/${firstLecture.module_id}/${firstLecture.module_item_id}`,
        { replace: true },
      )
    }
  }, [
    moduleId,
    moduleItemId,
    selectLecture,
    allLectures,
    courseId,
    navigate,
    loading,
  ])

  return {
    lectures,
    selectedLecture,
    loading,
    error,
    allLectures,
    isLatestUnlocked,
    isLastLecture,
    courseCompleted,
    latestUnlockedLecture,
    setCourseCompleted,
    handleChooseLecture,
    handleCompleteCourse,
    handleCompleteLecture,
  }
}

export default useLectureData
