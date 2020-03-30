import router from 'umi/router'
import CookieUtil from './cookie'

export function checkLogin() {
  if (!CookieUtil.get('token')) {
    router.replace('/login')
    return false
  }
  return true
}

export function removeNull(data) {
  if (Object.prototype.toString.call(data) !== '[object Object]') {
    throw new Error('request data is not a object.')
  }

  // 两层去掉null
  for (let key in data) {
    if (data[key] === null || JSON.stringify(data[key]) === '{}') {
      delete data[key]
    } else if (
      Object.prototype.toString.call(data[key]) === '[object Object]'
    ) {
      for (let _key in data[key]) {
        if (data[key][_key] === null) {
          delete data[key][_key]
        }
      }
    }
  }

  return data
}
