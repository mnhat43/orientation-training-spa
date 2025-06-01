import API from './axios.config'

const quiz = {
  submitQuizAnswers(params) {
    return API.post('/quiz/submit-full', params)
  },
  getQuizResult(params) {
    return API.post('/quiz/result', params)
  },
  getQuizPendingReview() {
    return API.get('/quiz/pending-review')
  },
  reviewSubmission(params) {
    return API.post('/quiz/review-essay', params)
  },
}

export default quiz
