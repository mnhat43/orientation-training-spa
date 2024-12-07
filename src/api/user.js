import API from './axios.config'
const user = {
  getProfile: () => {
    const url = '/users/profile'
    return API.get(url)
  },
  updateUserInfo: (user_id, params) => {
    const url = `/users/${user_id}`
    return API.put(url, params)
  },
  logout: () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('expiresAt')
  },
  getAllCustomer: () => {
    const url = '/users/customer-list'
    return API.get(url)
  },
  deleteUser: (user_id) => {
    const url = `/users/${user_id}`
    return API.delete(url)
  }
}

export default user
