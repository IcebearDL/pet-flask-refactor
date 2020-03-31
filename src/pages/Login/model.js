import { Login } from '../../services/login'
import CookieUtil from '../../utils/cookie'
import router from 'umi/router'

const Model = {
  namespace: 'login',

  state: {},

  reducers: {},

  effects: {
    *login({ payload }, { call }) {
      const data = yield call(Login, payload)

      if (data) {
        // token 过期时间40分钟
        const expires = new Date(new Date().getTime() + 90 * 60 * 1000)

        CookieUtil.set('token', data, expires, '/')
        router.push('/project')
        return true
      }
      return false
    }
  }
}

export default Model
