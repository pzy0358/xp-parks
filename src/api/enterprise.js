import request from '@/utils/request'

export function EnterApi(params) {
  return request({
    url: '/park/enterprise',
    method: 'GET',
    params
  })
}

// 企业下拉查看企业
export function LookEnterApi(params) {
  return request({
    url: `/park/enterprise/rent/${params.id}`,
    method: 'GET'
  })
}
// 删除企业
export function DelEnterApi(id) {
  return request({
    url: `/park/enterprise/${id}`,
    method: 'DELETE'
  })
}
// 搜索企业
// export function SeEnterApi(params) {
//   return request({
//     url: '/park/enterprise',
//     method: 'GET',
//     params
//   })
// }

