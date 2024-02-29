import request from '@/utils/request'

// 物业费列表
export function getCostListApi(params) {
  return request({
    url: '/park/propertyfee',
    method: 'GET',
    params
  })
}
// 删除账单
export function delCostApi(id) {
  return request({
    url: `/park/propertyfee/${id}`,
    method: 'DELETE'
  })
}
// 查询企业
export function GetSearchApi(params) {
  return request({
    url: '/park/propertyfee',
    method: 'GET',
    params
  })
}
// 添加账单
export function addCostApi(data) {
  return request({
    url: '/park/propertyfee',
    method: 'POST',
    data
  })
}
// 楼宇菜单
export function getBuildingApi(params) {
  return request({
    url: 'park/all/building',
    method: 'GET',
    params
  })
}
// 预算金额
export function getPriceApi(data) {
  return request({
    url: '/park/propertyfee/pre/payment',
    method: 'POST',
    data
  })
}
// 预算金额
export function getViewAllApi() {
  return request({
    url: '/park/all/enterprise',
    method: 'GET'
  })
}
// 查看账单详情
export function LookOrdApi(id) {
  return request({
    url: `/park/propertyfee/${id}`,
    method: 'GET'
  })
}
