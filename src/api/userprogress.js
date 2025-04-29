import API from './axios.config'

const userprogress = {
  updateUserProgress: (progressData) => {
    const url = '/user-progress/update-user-progress'
    return API.post(url, progressData)
  },
  getUserProgress: (progressData) => {
    const url = '/user-progress/get-user-progress'
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
}

export default userprogress
