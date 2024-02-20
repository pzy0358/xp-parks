// import axios from 'axios'
// import { Message } from 'element-ui'
// import store from '@/store'
// import router from 'vue-router'
// import { getToken } from '@/utils/auth'

// const service = axios.create({
//   baseURL: 'https://api-hmzs.itheima.net/api',
//   timeout: 5000
// })

// service.interceptors.request.use(
//   config => {
//   // do something before request is sent

//     if (store.getters.token) {
//       config.headers['X-Token'] = getToken()
//       config.headers.Authorization = 'Bearer ' + getToken()
//     }
//     return config
//   },
//   error => {
//     console.log(error)
//     return Promise.reject(error)
//   }
// )

// // response interceptor
// service.interceptors.response.use(
//   (response) => {
//     if (response.data instanceof Blob) return response.data
//     const { success, message, data } = response.data
//     if (success) {
//       return data
//     } else {
//       Message({ type: 'error', message: message })
//     }
//   },
//   async(error) => {
//     if (error.response.status === 401) {
//       Message({ type: 'warning', message: 'token失效，请重新登录' })
//       await store.dispatch('user/logout')
//       router.push('/login')
//       return Promise.reject(error)
//     }
//     Message({ type: 'error', message: error.message || '请求失败' })
//     return Promise.reject(error)
//   }
// )

// export default service

import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
const service = axios.create({
  baseURL: 'https://api-hmzs.itheima.net/api',
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['X-Token'] = getToken()
      config.headers.Authorization = 'Bearer ' + getToken()
    }
    return config
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 10000) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
