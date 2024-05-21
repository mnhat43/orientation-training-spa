import API from './axios.config'
const pet = {
  getPetList: () => {
    const url = '/pets/pet-list'
    return API.get(url)
  },
  
}

export default pet
