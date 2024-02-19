import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import router from 'vue-router'

const service = axios.create({
  baseURL: 'https://api-hmzs.itheima.net/api',
  timeout: 5000
})

// request interceptor
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers.Authorization = `Bearer ${store.getters.token}`
    }
    return config
  },
  error => {
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  (response) => {
    if (response.data instanceof Blob) return response.data
    const { success, message, data } = response.data
    if (success) {
      return data
    } else {
      Message({ type: 'error', message: message })
    }
  },
  async error => {
    if (error.response.status === 401) {
      Message({ type: 'warning', message: 'token失效，请重新登录' })
      await store.dispatch('user/logout')
      router.push('/login')
      return Promise.reject(error)
    }
    Message({ type: 'error', message: error.message || '请求失败' })
    return Promise.reject(error)
  }
)

export default service
