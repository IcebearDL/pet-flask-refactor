import request from '../utils/request'

// 获取所有用户
export async function FetchUsers(body) {
  return request('/v1/user/all', {
    method: 'GET',
    params: body
  })
}

// 获取系统下所有用户
export async function FetchSystemUsers(body) {
  return request('/v1/user/system/all', {
    method: 'GET',
    params: body
  })
}

// 获取项目下所有用户
export async function FetchProjectUsers(body) {
  return request('/v1/user/project/all', {
    method: 'GET',
    params: body
  })
}

// 更改用户信息
export async function PostUser(body) {
  return request('/v1/user', {
    method: 'POST',
    data: body
  })
}

// 所有用户视角下删除用户
export async function DeleteUser({ user_id }) {
  return request(`/v1/user/${user_id}`, {
    method: 'DELETE'
  })
}

// 系统视角下删除用户
export async function DeleteSystemUser({ system_id, user_id }) {
  return request(`/v1/user/${system_id}/${user_id}`, {
    method: 'DELETE'
  })
}

// 项目视角下删除用户
export async function DeleteProjectUser({ system_id, project_id, user_id }) {
  return request(`/v1/user/${system_id}/${project_id}/${user_id}`, {
    method: 'DELETE'
  })
}

// 关联用户至系统
export async function AssignUserToSystem(body) {
  return request('/v1/user/assign/system', {
    method: 'POST',
    data: body
  })
}

// 关联用户至系统
export async function AssignUserToProject(body) {
  return request('/v1/user/assign/project', {
    method: 'POST',
    data: body
  })
}

// 设置用户角色
export async function SetRole(body) {
  return request('/v1/role/assign', {
    method: 'POST',
    data: body
  })
}

// 返回当前系统id下的 所有角色列表
export async function FetchRoleList(body) {
  return request('/v1/role', {
    method: 'GET',
    params: body
  })
}

// 更新 或新增 角色信息
export async function PostRole(body) {
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
