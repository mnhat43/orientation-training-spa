import API from './axios.config'

const moduleItem = {
  addModuleItem: (params) => {
    const url = '/module-item/add-module-item'
    return API.post(url, params)
  },
  addModuleItemVideo: (params) => {
    const url = '/module-item/add-module-item-video'
    return API.post(url, params)
  },
  getModuleItemList: (moduleId) => {
    const url = '/module-item/get-module-item-list'
    return API.post(url, moduleId)
  },
  deleteModuleItem: (id) => {
    const url = '/module-item/delete-module-item'
    return API.post(url, id)
  }
}


export default moduleItem
