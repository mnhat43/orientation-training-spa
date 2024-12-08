import API from './axios.config'

const module = {
  addModule: (params) => {
    const url = '/module/add-module'
    return API.post(url, params)
  },
  getListModule: (courseId) => {
    const url = '/module/get-module-list'
    return API.post(url, courseId)
  },
  deleteModule: (id) => {
    const url = '/module/delete-module'
    return API.post(url, id)
  },
  getListModuleItem: (moduleId) => {
    const url = '/module/get-module-item-list'
    return API.post(url, moduleId)
  },
  getListModuleDetail: (moduleId) => {
    const url = '/module/get-module-details'
    return API.post(url, moduleId)
  }
}


export default module
