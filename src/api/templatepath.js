import API from './axios.config'

const templatepath = {
  getTemplatePathList: () => {
    return API.post('/template-path/get-template-path-list')
  },

  getTemplatePath: (id) => {
    return API.post(`/template-path/get-template-path`, id)
  },

  createTemplatePath: (data) => {
    return API.post('/template-path/create-template-path', data)
  },

  updateTemplatePath: (data) => {
    return API.post(`/template-path/update-template-path`, data)
  },

  deleteTemplatePath: (id) => {
    return API.post(`/template-path/delete-template-path`, id)
  },
}

export default templatepath
