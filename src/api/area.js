import request from '@/utils/request'

// 汽车区域管理
export function getAreaListApi(params) {
  return request({
    url: '/parking/area/list',
    method: 'GET',
    params
  })
}

// 删除区域
export function deleteAreaApi(id) {
  return request({
    url: `/parking/area/${id}`,
    method: 'DELETE'
  })
}

// 添加区域
export function addAreaApi(data) {
  return request({
    url: '/parking/area',
    method: 'POST',
    data
  })
}
// 编辑区域
export function UpdateAreaApi(data) {
  return request({
    url: '/parking/area',
    method: 'PUT',
    data
  })
}

// 获取关联区域下拉列表
export function getRuleListApi(params) {
  return request({
    url: '/parking/rule/list',
    method: 'GET',
    params
  })
}
