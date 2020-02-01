import { message } from "antd"
import { Login } from '../../services/login'
import CookieUtil from '../../utils/cookie'
import router from 'umi/router'

const Model = {

    namespace: "login",

    state: {
    },

    reducers: {
    },

    effects: {
        *login({ payload }, { call, put }) {
            let rsp = yield call(Login, payload)
            if (rsp && rsp.code !== 200) {
                message.error(`登录失败，${rsp.msg}`)
            } else {
                const expires = new Date(new Date().getTime() + 40*60*1000)
                CookieUtil.set('token',rsp.data,expires,'/')
                router.push('/project')
            }
        }
    }

}

export default Model