import request from '@/utils/request'

// 获取角色列表
export function getRoleListApi(params) {
  return request({
    url: '/park/sys/role',
    method: 'GET',
    params
  })
}

// tree内容
export function getTreeListApi(data) {
  return request({
    url: '/park/sys/permision/all/tree',
    method: 'GET',
    data
  })
}
// 当前角色权限
export function getPermissionListApi(roleId) {
  return request({
    url: `/park/sys/role/${roleId}`
  })
}
// 角色关联用户列表
export function getUserListApi(roleId) {
  return request({
    url: `/park/sys/roleUser/${roleId}`
  })
}
