import axios from 'axios'
import {ElMessage} from 'element-plus'

// 创建axios实例
const service = axios.create({
  baseURL: '/api',
  timeout: 200 * 1000
})


// 设置cross跨域 并设置访问权限
service.defaults.withCredentials = false

service.interceptors.request.use(
  config => {
    // console.log(config)
    // 在发送请求之前做些什么
    config.headers['Content-Type'] = 'application/json;charset=UTF-8'
    return config
  }, error => {
    // 对请求错误做些什么
    console.log(error) // for debug
    return Promise.reject(error)
  })

service.interceptors.response.use(
  response => {
    console.log(response)
    const res = response.data
    // 如果不是200，则将其判断为错误。
    if (res.code !== 200) {
      // TODO: 错误处理
      return Promise.reject(new Error(res.message || 'Error'))
    }
    return res
  },
  error => {
    /***** 接收到异常响应的处理开始 *****/
    // console.log('err' + error) // for debug
    ElMessage({
      showClose: true,
      message: error.message,
      type: 'error',
      duration: 3 * 1000
    })
    return Promise.reject(error)
  }
)
export default service
