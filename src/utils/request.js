import request from 'umi-request'
import { notification, message } from 'antd'
import router from 'umi/router'

import CookieUtil from './cookie'
import { removeNull } from './util'

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。'
}

// prefix 阿里云的测试服务器
const { NODE_ENV } = process.env
const prefix = NODE_ENV === 'development' ? '/api' : 'http://39.96.191.139'

let COOKIE_CONFIRM = true
const auth_request = (url, { method = 'GET', params = {}, data = {} }) => {
  // 判断cookie是否失效
  if (url !== '/login' && CookieUtil.get('token') === null) {
    if (!COOKIE_CONFIRM) {
      return
    }
    COOKIE_CONFIRM = false
    message.warning('登陆状态失效，请重新登陆！')
    router.replace('/login')
    return
  }

  if (!COOKIE_CONFIRM) COOKIE_CONFIRM = true

  return new Promise(resolve => {
    request(prefix + url, {
      method,
      params,
      data: removeNull(data),
      // 这里的request的header不能加在extend创建实例里
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${CookieUtil.get('token')}`
      }
    }).then(res => {
      if (res && res.code === 200) {
        // 如果post请求没有data，就返回true，以便判断generator下一步执行
        resolve(res.data || true)
      } else {
        notification.error({
          message: codeMessage[res.code || 406],
          description: res.msg || ''
        })
        // 错误不能reject 会导致generator call函数出错
        resolve()
      }
    })
  })
}

export default auth_request
