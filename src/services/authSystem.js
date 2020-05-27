import request from '../utils/request'

// 获取所有系统信息
export async function FetchSystems() {
  return request('/v1/system/all', {
    method: 'GET'
  })
}

// 更改系统信息
export async function PostSystem(body) {
  return request('/v1/system', {
    method: 'POST',
    data: body
  })
}

// 删除系统
export async function DeleteSystem({ system_id }) {
  return request(`/v1/system/${system_id}`, {
    method: 'DELETE'
  })
}

// 返回当前系统id下的 所有权限列表
export async function FetchPermissionList({ system_id }) {
  return request(`/v1/permission/all/${system_id}`, {
    method: 'GET'
  })
}

// 更新 或新增 权限信息
export async function PostPermission(body) {
  return request('/v1/permission', {
    method: 'POST',
    data: body
  })
}

// 删除权限
export async function DeletePermission({ permission_id }) {
  return request(`/v1/permission/${permission_id}`, {
    method: 'DELETE'
  })
}
