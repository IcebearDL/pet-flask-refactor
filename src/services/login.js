import request from '../utils/request'

//登陆接口
export async function Login(body) {
  return request('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
}