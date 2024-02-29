import request from '@/utils/request'

// 运功列表渲染
export function getEmployeeListApi(params) {
  return request({
    url: '/park/sys/user',
    method: 'GET',
    params
  })
}

// 删除员工
export function delEmployeeApi(id) {
  return request({
    url: `/park/sys/user/${id}`,
    method: 'DELETE'
  })
}
// 添加员工
export function addEmployeeApi(data) {
  return request({
    url: '/park/sys/user',
    method: 'POST',
    data
  })
}
// 角色下拉
export function getRoleListApi() {
  return request({
    url: '/park/sys/role',
    method: 'GET'
  })
}
// 编辑员工
export function editEmployeeApi(data) {
  return request({
    url: '/park/sys/user',
    method: 'PUT',
    data
  })
}

// 重置密码
export function resetPasswordApi(data) {
  return request({
    url: '/park/sys/user/resetPwd',
    method: 'PUT',
    data
  })
}
