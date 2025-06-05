import API from './axios.config'

const auth = {
  login: (params) => {
    const url = '/auth/login'
    return API.post(url, params)
  },
  logout: () => {
    localStorage.removeItem('token')
  },
}

export default auth
