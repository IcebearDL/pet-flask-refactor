import { Login } from '../../services/login'
import CookieUtil from '../../utils/cookie'

const Model = {
  namespace: 'login',

  state: {},

  reducers: {},

  effects: {
    *login({ payload }, { call }) {
      const data = yield call(Login, payload)

      if (data) {
        // token 过期时间45分钟
        const expires = new Date(new Date().getTime() + 45 * 60 * 1000)

        CookieUtil.set('token', data, expires, '/')
        return true
      }
      return false
    }
  }
}

export default Model
