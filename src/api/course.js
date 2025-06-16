import API from './axios.config'

const course = {
  addCourse: (params) => {
    const url = '/course/add-course'
    return API.post(url, params)
  },
  updateCourse: (params) => {
    const url = '/course/update-course'
    return API.post(url, params)
  },
  getListCourse: (params) => {
    const url = '/course/get-course-list'
    return API.post(url, params)
  },
  getCourseDetail: (id) => {
    const url = '/course/get-course-detail'
    return API.post(url, id)
  },
  deleteCourse: (id) => {
    const url = '/course/delete-course'
    return API.post(url, id)
  },
}

export default course
