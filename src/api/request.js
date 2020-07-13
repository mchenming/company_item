import Vue from 'vue'
import axios from 'axios'

// 创建axios实例
const service = axios.create({
  timeout: 1000 * 300,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  }
})

// request拦截器
service.interceptors.request.use(config => {
  config.headers['token'] = Vue.cookie.get('token')
  // if (Vue.cookie.get('user_token') === null) {
  //   Vue.cookie.set('user_token', 'cWNfNWQ1NjVjNjExMzhiNw==')
  // }
  return config
}, error => {
  return Promise.reject(error)
})

// response拦截器
service.interceptors.response.use(response => {
  if (response.data && response.data.code === 401) { // 401, token失效
    Vue.cookie.delete('token')
    Vue.cookie.delete('user_token')
    window.location.href = window.location.pathname + '#/login'
    window.location.reload()
  }
  if (response.data.result) {
    if (typeof response.data.result === 'string') {
      if (response.data.result.includes('Subject does not have permission')) {
        window.location.href = window.location.pathname + '#/successlogin?norolse="y"'
        return
      }
    }
  }
  return response
}, error => {
  return Promise.reject(error)
})

export default service
