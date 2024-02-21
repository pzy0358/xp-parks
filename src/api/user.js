import request from '@/utils/request'

export function loginApi(data) {
  return request({
    url: '/park/login',
    method: 'POST',
    data
  })
}

export function getInfoApi() {
  return request({
    url: '/park/user/profile',
    method: 'GET'
  })
}

// export function logout() {
//   return request({
//     url: '/vue-admin-template/user/logout',
//     method: 'post'
//   })
// }
