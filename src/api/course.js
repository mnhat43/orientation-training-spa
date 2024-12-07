import API from './axios.config'

const course = {
  addCourse: (params) => {
    const url = '/course/add-course'
    return API.post(url, params)
  },
  getListCourse: (params) => {
    const url = '/course/get-course-list'
    return API.post(url, params)
  },
  deleteCourse: (id) => {
    const url = '/course/delete-course'
    return API.post(url, id)
  }
}


export default course
