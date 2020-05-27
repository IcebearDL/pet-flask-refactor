import request from '../utils/request'

// 获取系统下所有的项目
export async function FetchProjects(body) {
  return request('/v1/project/all', {
    method: 'GET',
    params: body
  })
}

// 更新 或新增 项目
export async function PostProject(body) {
  return request('/v1/project', {
    method: 'POST',
    data: body
  })
}

// 删除项目
export async function DeleteProject({ project_id }) {
  return request(`/v1/project/${project_id}`, {
    method: 'DELETE'
  })
}
