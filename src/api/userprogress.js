import API from './axios.config'

const userprogress = {
  updateUserProgress: (progressData) => {
    const url = '/user-progress/update-user-progress'
    return API.post(url, progressData)
  },
  completeCourse: (courseId) => {
    const url = '/user-progress/complete-course'
    return API.post(url, courseId)
  }
}

export default userprogress
