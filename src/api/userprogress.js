import API from './axios.config'

const userprogress = {
  updateUserProgress: (progressData) => {
    const url = '/user-progress/update-user-progress'
    return API.post(url, progressData)
  }
}

export default userprogress
