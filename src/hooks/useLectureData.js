import { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import lectureApi from '@api/lecture'
import userprogress from '@api/userprogress'
import { useParams } from 'react-router-dom'

const useLectureData = () => {
  const navigate = useNavigate()
  const { moduleId, moduleItemId, courseId } = useParams()

  const [lectures, setLectures] = useState([])
  const [selectedLecture, setSelectedLecture] = useState({})
  const [selectedModule, setSelectedModule] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [courseCompleted, setCourseCompleted] = useState(false)

  const handleSelectLecture = useCallback(
    ({ moduleId, moduleItemId, navigate: shouldNavigate = false }) => {
      if (moduleId === undefined || moduleItemId === undefined) {
        return null
      }

      if (!lectures || !lectures.length) return null

      const targetModule = lectures.find(
        (module) => module.module_id === parseInt(moduleId),
      )

      if (!targetModule) return null

      const targetLecture = targetModule.lecture.find(
        (item) => item.module_item_id === parseInt(moduleItemId),
      )

      if (!targetLecture) return null

      const completeLecture = {
        ...targetLecture,
      }
      setSelectedModule({
        module_id: targetModule.module_id,
        module_position: targetModule.module_position,
      })
      setSelectedLecture(completeLecture)

      if (shouldNavigate) {
        navigate(`/course/${courseId}/lectures/${moduleId}/${moduleItemId}`)
      }

      return completeLecture
    },
    [lectures, courseId, navigate],
  )

  const __handleGetPositionNext = useCallback(
    (modulePosition, moduleItemPosition) => {
      if (!lectures || !lectures.length) return null

      const currentModulePos = Number(modulePosition)
      const currentItemPos = Number(moduleItemPosition)

      const currentModule = lectures.find(
        (module) => Number(module.module_position) === currentModulePos,
      )

      if (currentModule) {
        const nextLectureInModule = currentModule.lecture.find(
          (item) => Number(item.module_item_position) > currentItemPos,
        )

        if (nextLectureInModule) {
          return {
            module_position: currentModule.module_position,
            module_item_position: nextLectureInModule.module_item_position,
          }
        }
      }

      const nextModule = lectures.find(
        (module) => Number(module.module_position) > currentModulePos,
      )

      if (nextModule && nextModule.lecture && nextModule.lecture.length > 0) {
        const firstLecture = nextModule.lecture.reduce((first, current) => {
          return Number(current.module_item_position) <
            Number(first.module_item_position)
            ? current
            : first
        }, nextModule.lecture[0])

        return {
          module_position: nextModule.module_position,
          module_item_position: firstLecture.module_item_position,
        }
      }

      return null
    },
    [lectures],
  )

  const __handleStatusCourses = useCallback(async () => {
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
  }, [courseId])

  const handleCompleteLecture = useCallback(async () => {
    try {
      const nextLecturePosition = __handleGetPositionNext(
        selectedModule.module_position,
        selectedLecture.module_item_position,
      )

      const response = await userprogress.updateUserProgress({
        course_id: Number(courseId),
        module_position: Number(nextLecturePosition.module_position),
        module_item_position: Number(nextLecturePosition.module_item_position),
      })

      if (response.status === 1 && response?.data) {
        const updatedData = response.data

        setLectures((prevLectures) => {
          return prevLectures.map((module) => {
            if (
              parseInt(module.module_position) ===
              parseInt(updatedData.module_position)
            ) {
              return {
                ...module,
                lecture: module.lecture.map((item) => {
                  if (
                    parseInt(item.module_item_position) ===
                    parseInt(updatedData.module_item_position)
                  ) {
                    return { ...item, unlocked: true }
                  }
                  return item
                }),
              }
            }
            return module
          })
        })

        return true
      }

      return false
    } catch (error) {
      console.error('Failed to update progress:', error)
      return false
    }
  }, [selectedLecture, courseId, __handleGetPositionNext])

  const handleGetLastLecture = useCallback(() => {
    if (!lectures || !lectures.length) return null

    let highestModulePosition = -1
    let lastModuleId = null

    lectures.forEach((module) => {
      const modulePosition = parseInt(module.module_position)
      if (modulePosition > highestModulePosition) {
        highestModulePosition = modulePosition
        lastModuleId = module.module_id
      }
    })

    if (lastModuleId === null) return null

    const lastModule = lectures.find((m) => m.module_id === lastModuleId)
    if (!lastModule || !lastModule.lecture) return null

    let highestItemPosition = -1
    let lastItemId = null

    lastModule.lecture.forEach((item) => {
      const itemPosition = parseInt(item.module_item_position)
      if (itemPosition > highestItemPosition) {
        highestItemPosition = itemPosition
        lastItemId = item.module_item_id
      }
    })

    if (lastItemId === null) return null

    const lastLecture = lastModule.lecture.find(
      (item) => item.module_item_id === lastItemId,
    )

    if (!lastLecture) return null

    return {
      ...lastLecture,
    }
  }, [lectures])

  const handleGetLastUnlockedLecture = () => {
    if (!lectures || !lectures.length) return null
    const unlockedLectures = []

    lectures.forEach((module) => {
      module.lecture.forEach((item) => {
        if (item.unlocked === true) {
          unlockedLectures.push({
            ...item,
            module_id: module.module_id,
            module_position: module.module_position,
            module_title: module.module_title,
          })
        }
      })
    })

    if (unlockedLectures.length === 0) return null

    const lastUnlockedLecture = unlockedLectures.reduce((highest, current) => {
      const currentModulePosition = parseInt(current.module_position)
      const highestModulePosition = parseInt(highest.module_position)

      if (currentModulePosition > highestModulePosition) return current
      if (currentModulePosition < highestModulePosition) return highest

      return parseInt(current.module_item_position) >
        parseInt(highest.module_item_position)
        ? current
        : highest
    }, unlockedLectures[0])

    const { module_id, module_position, module_title, ...cleanLecture } =
      lastUnlockedLecture

    return cleanLecture
  }

  useEffect(() => {
    if (courseId) {
      __handleStatusCourses()
    }
  }, [courseId, __handleStatusCourses])

  useEffect(() => {
    const fetchLectures = async () => {
      if (!courseId) return

      try {
        setLoading(true)
        setError(null)
        const response = await lectureApi.getListLecture({
          course_id: parseInt(courseId),
        })

        if (response.status === 1 && response.data) {
          setLectures(response.data)
          await __handleStatusCourses()
        }
      } catch (error) {
        console.error('Failed to fetch lectures:', error.message)
        setError(error.message || 'Failed to fetch lectures')
      } finally {
        setLoading(false)
      }
    }

    fetchLectures()
  }, [courseId, __handleStatusCourses])

  useEffect(() => {
    if (loading || !lectures.length) return

    if (moduleId && moduleItemId) {
      handleSelectLecture({
        moduleId,
        moduleItemId,
      })
    } else if (
      lectures.length > 0 &&
      lectures[0].lecture &&
      lectures[0].lecture.length > 0
    ) {
      const firstModule = lectures[0]
      const firstLecture = firstModule.lecture[0]

      handleSelectLecture({
        moduleId: firstModule.module_id,
        moduleItemId: firstLecture.module_item_id,
        navigate: true,
      })
    }
  }, [lectures, loading, moduleId, moduleItemId, handleSelectLecture])

  return {
    loading,
    error,
    lectures,
    selectedLecture,
    courseCompleted,
    handleSelectLecture,
    handleGetLastLecture,
    handleGetLastUnlockedLecture,
    handleCompleteCourse,
    handleCompleteLecture,
  }
}

export default useLectureData
