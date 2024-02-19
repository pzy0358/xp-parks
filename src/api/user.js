import service from '@/utils/request'

export function loginApi(data) {
  return service({
    url: '/park/login',
    method: 'POST',
    data
  })
}

export function getInfoApi() {
  return service({
    url: '/system/user/dropList',
    method: 'GET'
  })
}

// export function logout() {
//   return request({
//     url: '/vue-admin-template/user/logout',
//     method: 'post'
//   })
// }
