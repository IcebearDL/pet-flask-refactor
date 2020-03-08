import router from 'umi/router'
import CookieUtil from './cookie'

export function checkLogin() {
  if (!CookieUtil.get('token')) {
    router.replace('/login')
    return false
  }
  return true
}
