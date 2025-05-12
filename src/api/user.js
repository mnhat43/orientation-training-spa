import API from './axios.config'

const user = {
  getUserInfo: () => {
    const url = '/user/profile'
    return API.get(url)
  },
  updateUserInfo: (user_id, params) => {
    const url = `/user/${user_id}`
    return API.put(url, params)
  },
  logout: () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('expiresAt')
    localStorage.removeItem('collapsed')
  },
}

export default user
