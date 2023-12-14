import axios from 'axios'

const baseURL = '/api'

const instance = axios.create({
  baseURL,
  timeout: 1000
})

instance.interceptors.response.use(
  (res) => {
    return res
  },
  (err) => {
    ElMessage({
      message: '服务异常',
      type: 'error'
    })
    return Promise.reject(err)
  }
)

export default instance
export { baseURL }
