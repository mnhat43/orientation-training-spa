import API from './axios.config'

const user = {
  getUserInfo: () => {
    const url = '/user/profile'
    return API.get(url)
  },
  updateProfile: (params) => {
    const url = `/user/update-profile`
    return API.post(url, params)
  },
  changePassword: (params) => {
    const url = '/user/change-password'
    return API.post(url, params)
  },
  getEmployeeOverview: () => {
    const url = '/user/employee-overview'
    return API.get(url)
  },
  register: (credentials) => {
    const url = '/user/register'
    return API.post(url, credentials)
  },
  employeeDetails: (user_id) => {
    const url = `/user/employee-detail`
    return API.post(url, user_id)
  },
  logout: () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('expiresAt')
    localStorage.removeItem('collapsed')
  },
}

export default user
