import API from './axios.config'

const userprogress = {
  addUserProgress: (data) => {
    const url = '/user-progress/add-user-progress'
    return API.post(url, data)
  },
  updateUserProgress: (progressData) => {
    const url = '/user-progress/update-user-progress'
    return API.post(url, progressData)
  },
  getUserProgress: (progressData) => {
    const url = '/user-progress/get-user-progress'
    return API.post(url, progressData)
  },
  getUserProgressSingle: (progressData) => {
    const url = '/user-progress/get-single'
    return API.post(url, progressData)
  },
  getListTraineeByCourse: (courseID) => {
    const url = '/user-progress/list-trainee-by-course'
    return API.post(url, courseID)
  },
  addListTraineeToCourse: (courseID) => {
    const url = '/user-progress/add-list-trainee-to-course'
    return API.post(url, courseID)
  },
  reviewProgress: (progressData) => {
    const url = '/user-progress/review-progress'
    return API.post(url, progressData)
  },
}

export default userprogress
