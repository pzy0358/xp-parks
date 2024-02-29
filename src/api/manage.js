import request from '@/utils/request'

// 查看一体杆列表
export function getPoleListApi(params) {
  return request({
    url: '/pole/info/list',
    method: 'GET',
    params
  })
}

// 添加一体杆
export function addPoleApi(data) {
  return request({
    url: '/pole/info',
    method: 'POST',
    data
  })
}

export function getRuleListApi(params) {
  return request({
    url: '/parking/area/dropList',
    method: 'GET',
    params
  })
}

// 编辑一体杆
export function editPoleApi(data) {
  return request({
    url: '/pole/info',
    method: 'PUT',
    data
  })
}

// 删除一体杆
export function deletePoleApi(ids) {
  return request({
    url: `/pole/info/${ids}`,
    method: 'DELETE'
  })
}
