import axios from 'axios'
import queryString from 'query-string'

const API = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true,
  paramsSerializer: (params) => queryString.stringify(params)
})

API.interceptors.request.use(
  function (req) {
    const token = JSON.parse(localStorage.getItem('token'))
    if (token) {
      req.headers['Authorization'] = `Bearer ${token}`;
    }
    return req;
  },
  function (error) {
    return Promise.reject(error);
  }
)

// API.interceptors.response.use(
//   function (response) {
//     return response.data;
//   },
//   function (error) {
//     return Promise.reject(error);
//   }
// );

export default API;
