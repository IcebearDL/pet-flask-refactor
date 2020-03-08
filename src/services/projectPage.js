import request from '../utils/request'

// 获取项目列表
export async function FetchProjectList(body) {
  return request('/project', {
    method: 'GET',
    params: { ...body }
  })
}
