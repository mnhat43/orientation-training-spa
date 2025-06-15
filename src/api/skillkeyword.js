import API from './axios.config'

const skillkeyword = {
  list: () => {
    const url = '/skill-keyword/list'
    return API.get(url)
  },
  create: (params) => {
    const url = '/skill-keyword/create'
    return API.post(url, params)
  },
}

export default skillkeyword
