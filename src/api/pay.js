import request from '@/utils/request'

// 缴费列表
export function getPayListApi(params) {
  return request({
    url: '/parking/payment/list',
    method: 'GET',
    params
  })
}
