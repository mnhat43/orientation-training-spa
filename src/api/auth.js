import API from './axios.config'

const auth = {
  login: (params) => {
    const url = '/auth/login'
    return API.post(url, params)
  },
  logout: () => {
    const url = '/auth/logout'
    return API.get(url)
  },
}

export default auth
