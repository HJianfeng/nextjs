import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://cnodejs.org/api/v1',
  timeout: 10000,
})

// 拦截器
instance.interceptors.response.use((response) => {
  return response
}, (error) => {
  return Promise.reject(error)
})
instance.interceptors.request.use((config) => {
  return config
}, (error) => {
  return Promise.reject(error)
})

export default instance
