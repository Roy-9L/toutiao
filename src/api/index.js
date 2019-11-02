import axios from 'axios'
import local from '../utils/local'
import router from '../router'
import JSONBIG from 'json-bigint'
// baseURL  作用：设置基准地址（前面一段相同的地址）
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0/'
axios.defaults.transformResponse = [(data) => {
  // data是后台的原始数据 是理想情况下的json字符串
  // 但是后台 可能 没有任何响应内容， 此时data的值是null
  try {
    // const result = JSONBIG.parse(data)
    // return result
    return JSONBIG.parse(data)
  } catch (e) {
    return data
  }
}]
// // 配置请求头
// if (local.getUser()) {
//   axios.defaults.headers.Authorization = `Bearer ${local.getUser().token}`
// }
// 添加请求拦截器  在每次请求前执行
axios.interceptors.request.use(config => {
  // 1.获取token
  const user = local.getUser() || {}
  // 2.头部设置token
  config.headers.Authorization = `Bearer ${user.token}`
  return config
}, err => {
  return Promise.reject(err)
})
// 添加响应拦截器  在每次响应之后立即执行
axios.interceptors.response.use(res => res, err => {
  // 响应失败时，获取响应状态码 res.response.status
  // 当响应状态码是401时，进行页面跳转
  if (err.response.status === 401) {
    // 跳转到登录页面
    // 使用vue-router跳转，push是router实例的函数
    return router.push('/login')
  }
  return Promise.reject(err)
})
export default axios
