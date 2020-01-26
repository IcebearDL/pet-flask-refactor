import { FetchUserInfo } from '../services/global'

const Model = {

  namespace: "global",

  state: {
    user_div_info: ''
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload }
    }
  },

  effects: {
    *fetchUserInfo({ payload }, { call, put }) {
      let rsp = yield call(FetchUserInfo)
      yield put({
        type: "save",
        payload: {
          user_div_info: rsp.user_name
        }
      })
    }
  }

}

export default Model