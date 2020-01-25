import { message } from "antd"
import { Login } from '../../services/login'
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
            console.log(rsp)
            if (rsp && rsp.code !== 200) {
                message.error(`登录失败，${rsp.msg}`)
            } else {
                window.localStorage.setItem('token', rsp.data)
                router.push('/project')
            }
        }
    }

}

export default Model