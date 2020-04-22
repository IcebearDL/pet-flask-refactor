import request from '../utils/request'

// 获取所有用户
export async function FetchUsers(body) {
  return request('/v1/user/all', {
    method: 'GET',
    params: body
  })
}

// 更改用户信息
export async function PostUser({ body }) {
  return request('/v1/user', {
    method: 'POST',
    data: body
  })
}

// 删除用户
export async function DeleteUser({ user_id }) {
  return request(`/v1/user/${user_id}`, {
    method: 'DELETE'
  })
}

// 关联用户至系统
export async function AssignUser(body) {
  return request('/v1/user/assign', {
    method: 'POST',
    data: body
  })
}

// 返回当前系统id下的 所有角色列表
export async function FetchRoleList({ system_id }) {
  return request(`/v1/role/${system_id}`, {
    method: 'GET'
  })
}

// 更新 或新增 角色信息
export async function PostRole({ body }) {
  return request('/v1/role', {
    method: 'POST',
    data: body
  })
}

// 删除角色
export async function DeleteRole({ role_id }) {
  return request(`/v1/role/${role_id}`, {
    method: 'DELETE'
  })
}
