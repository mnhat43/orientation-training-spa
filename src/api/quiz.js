import API from './axios.config'

const quiz = {
  submitQuizAnswers(params) {
    return API.post('/quiz/submit-full', params)
  },

  getQuizResult(params) {
    return API.post('/quiz/result', params)
  },
}

export default quiz
