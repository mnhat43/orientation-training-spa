import { useState, useEffect } from 'react'
import { Spin, Empty } from 'antd'
import { useNavigate } from 'react-router-dom'
import courseApi from '@api/course'
import { toast } from 'react-toastify'
import { ROLES } from '@constants'
import './learning-path.scss'

import LearningPathSteps from './components/LearningPathSteps'
import ProgressStats from './components/ProgressStats'
import NextAction from './components/NextAction'
import CourseList from './components/CourseList'
import AchievedSkills from './components/AchievedSkills'

const MyLearningPath = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [mySkills, setMySkills] = useState([])
  const [userProgress, setUserProgress] = useState({
    totalCompleted: 0,
    progressPercentage: 0,
    nextCourseIndex: 0,
    allCompleted: false,
  })
  const navigate = useNavigate()
  const userRole = ROLES.EMPLOYEE

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true)
        const response = await courseApi.getListCourse()

        if (response.status === 1) {
          const sortedCourses = [...response.data.courses].sort(
            (a, b) => a.course_position - b.course_position,
          )

          if (response.data.my_skills) {
            setMySkills(response.data.my_skills)
          }

          const completedCount = sortedCourses.filter(
            (course) => course.completed,
          ).length

          const nextCourseIndex = sortedCourses.findIndex(
            (course) => !course.completed,
          )

          const allCompleted =
            nextCourseIndex === -1 || completedCount === sortedCourses.length

          setUserProgress({
            totalCompleted: completedCount,
            progressPercentage: (completedCount / sortedCourses.length) * 100,
            nextCourseIndex: nextCourseIndex !== -1 ? nextCourseIndex : 0,
            allCompleted: allCompleted,
          })

          setCourses(sortedCourses)
        }
      } catch (error) {
        toast.error(
          'Error fetching learning path: ' + (error.message || 'Unknown error'),
        )
      } finally {
        setLoading(false)
      }
    }
    fetchCourses()
  }, [])

  const getCourseStatus = (course, index) => {
    if (course.completed) {
      return {
        status: 'completed',
        locked: false,
        progress: 100,
        completed: true,
      }
    }

    if (index <= userProgress.nextCourseIndex) {
      return {
        status: 'in-progress',
        locked: false,
        progress: 0,
        completed: false,
      }
    }

    return { status: 'locked', locked: true, progress: 0, completed: false }
  }

  const handleCourseClick = (course, courseStatus) => {
    if (courseStatus.locked) {
      toast.warning('Complete the previous courses to unlock this course.')
      return
    }
    navigate(`/course/${course.course_id}/lectures`)
  }

  if (loading) {
    return (
      <div className="learning-path-container">
        <div className="loading-container">
          <Spin size="large" />
          <p>Loading your learning path...</p>
        </div>
      </div>
    )
  }

  if (courses.length === 0) {
    return (
      <div className="learning-path-container">
        <div className="empty-path">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No learning path has been assigned to you yet"
          />
          <p>Your manager will set up your personalized learning path soon.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="learning-path-container">
      <div className="learning-path-content">
        <div className="progress-overview">
          <div className="overview-layout">
            <div className="left-column">
              <LearningPathSteps
                courses={courses}
                userProgress={userProgress}
                navigate={navigate}
                getCourseStatus={getCourseStatus}
              />
            </div>{' '}
            <div className="right-column">
              <div className="stat-card progress-card">
                <ProgressStats
                  userProgress={userProgress}
                  totalCourses={courses.length}
                />
              </div>

              <div className="stat-card achieved-skills-card">
                <AchievedSkills mySkills={mySkills} />
              </div>

              <div className="stat-card next-action-card">
                <NextAction
                  allCompleted={userProgress.allCompleted}
                  nextCourse={courses[userProgress.nextCourseIndex]}
                  navigate={navigate}
                />
              </div>
            </div>
          </div>
        </div>

        <CourseList
          courses={courses}
          userRole={userRole}
          getCourseStatus={getCourseStatus}
          handleCourseClick={handleCourseClick}
        />
      </div>
    </div>
  )
}

export default MyLearningPath
