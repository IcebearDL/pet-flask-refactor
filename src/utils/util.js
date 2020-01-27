import router from 'umi/router'

export function checkLogin() {
  if (!window.localStorage.getItem('token')) {
    router.replace('/login')
    return false
  }
  return true
}