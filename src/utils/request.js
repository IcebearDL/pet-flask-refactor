import request from 'umi-request'
import { notification, message } from 'antd'
import router from 'umi/router'

import CookieUtil from './cookie'
import { removeNull } from './util'

const codeMessage = {
  999: '服务器出错',
  1000: '用户无效',
  1001: '无效参数',
  1002: '资源未找到',
  1003: '用户授权失败',
  1004: '文件查找失败',
  1005: '上传文件失败',
  1006: '样本非该用户所创建',
  1007: '样本已提交,无法修改',
  10021: '该资源已删除',
  10031: 'token无效',
  10032: 'token过期',
  10033: '该用户名不存在',
  10034: '用户名或密码错误'
}

const config = {
  // 预生产预览环境  阿里云的测试服务器
  pre: 'http://39.96.191.139:8080',
  // 生产环境地址
  prod: 'http://rayplus.top'
}

const { NODE_ENV } = process.env
const ENV = 'pre'

export const post_prefix = config[ENV]
const prefix = NODE_ENV === 'development' ? '/api' : config[ENV]

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
      params: removeNull(params),
      data: removeNull(data),
      // 这里的request的header不能加在extend创建实例里
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${CookieUtil.get('token')}`
      }
    }).then(res => {
      if (res && res.code === 200) {
        // 如果post请求没有data，就返回true，以便判断generator下一步执行
        if (res.total) {
          resolve({ data: res.data, total: res.total })
        } else {
          resolve(res.data || true)
        }
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
