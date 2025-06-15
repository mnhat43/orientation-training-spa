import API from './axios.config'

const trainee = {
  getListTrainee: () => {
    return API.post(`/user/list-trainee`)
  },
}

export default trainee
