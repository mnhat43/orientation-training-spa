import API from './axios.config'

const quiz = {
  submitQuizAnswers(params) {
    return API.post('/quiz/submit-full', params)
  },
}

export default quiz
