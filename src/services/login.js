import request from '../utils/request'

// 登陆接口
export async function Login(body) {
  return request('/login', {
    method: 'POST',
    data: body
  })
}

// 权限管理登陆接口
export async function AuthorityLogin(body) {
  return request('/v1/token', {
    method: 'POST',
    data: body
  })
}
