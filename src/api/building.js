import request from '@/utils/request'

export function BuildingApi(params) {
  return request({
    url: '/park/building',
    method: 'GET',
    params
  })
}
// 楼宇新增接口
export function AddBuildingApi(data) {
  return request({
    url: '/park/building',
    method: 'POST',
    data
  })
}

// 楼宇删除
export function DeleteBuildingApi(id) {
  return request({
    url: `/park/building/${id}`,
    method: 'DELETE'
  })
}

// 楼宇修改
export function UpdateBuildingApi(data) {
  return request({
    url: '/park/building',
    method: 'PUT',
    data
  })
}

// 楼宇查询
export function SeBuildingApi(params) {
  return request({
    url: '/park/building',
    method: 'GET',
    params
  })
}
