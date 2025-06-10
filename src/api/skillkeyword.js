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
  update: (params) => {
    const url = '/skill-keyword/update'
    return API.post(url, params)
  },
  delete: (id) => {
    const url = '/skill-keyword/delete'
    return API.post(url, id)
  },
}

export default skillkeyword
