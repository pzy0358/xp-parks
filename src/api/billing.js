import request from '@/utils/request'

export function getRuleApi(params) {
  return request({
    url: '/parking/rule/list',
    method: 'GET',
    params
  })
}

// 删除计费规则
export function deleteRuleApi(id) {
  return request({
    url: `/parking/rule/${id}`,
    method: 'DELETE'
  })
}

// 添加计费规则
export function addRuleApi(data) {
  return request({
    url: '/parking/rule',
    method: 'POST',
    data
  })
}

// 编辑计费规则
export function UpdateRuleApi(id) {
  return request({
    url: `/parking/rule/${id}`,
    method: 'GET'
  })
}
// 编辑计费
export function getUpdateRuleApi(data) {
  return request({
    url: 'parking/rule',
    method: 'PUT',
    data
  })
}
