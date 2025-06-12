import axiosInstance from './axios.config'

export const submitAppFeedback = (data) => {
  return axiosInstance.post(`/app-feedback/submit`, data)
}

export const listAppFeedback = () => {
  return axiosInstance.get('/app-feedback/list')
}

export const deleteAppFeedback = (id) => {
  return axiosInstance.post('/app-feedback/delete', id)
}

export const topAppFeedback = (data) => {
  return axiosInstance.get('/app-feedback/list-top', data)
}
