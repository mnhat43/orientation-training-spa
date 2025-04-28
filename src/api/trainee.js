import API from './axios.config'

const trainee = {
  getTraineesByCourse: (courseId) => {
    return API.get(`/trainee/course/${courseId}`)
  },

  addTraineeToCourse: (data) => {
    return API.post('/trainee/add-to-course', data)
  },

  removeTraineeFromCourse: (data) => {
    return API.post('/trainee/remove-from-course', data)
  },

  getTraineeProgress: (traineeId, courseId) => {
    return API.get(`/trainee/progress/${traineeId}/${courseId}`)
  },

  updateTraineeProgress: (data) => {
    return API.post('/trainee/progress/update', data)
  },

  getTraineeEvaluations: (traineeId, courseId) => {
    return API.get(`/trainee/evaluations/${traineeId}/${courseId}`)
  },

  addTraineeEvaluation: (data) => {
    return API.post('/trainee/evaluation/add', data)
  },
}

export default trainee
