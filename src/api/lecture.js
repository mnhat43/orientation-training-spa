import API from './axios.config'

const lecture = {
  getListLecture: (courseId) => {
    const url = '/lecture/get-lecture-list'
    return API.post(url, courseId)
  }
}


export default lecture
