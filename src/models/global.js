import { FetchUserInfo, FetchResearchCenterInfo } from '../services/global'

const Model = {

  namespace: "global",

  state: {
    research_center_info: []
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload }
    }
  },

  effects: {
    *fetchUserInfo({ payload }, { call, put }) {
      let rsp = yield call(FetchUserInfo)
      window.localStorage.setItem('user_name', rsp.user_name)
    },

    *fetchResearchCenterInfo({ payload }, { call, put }) {
      let rsp = yield call(FetchResearchCenterInfo)
      yield put({
        type: "save",
        payload: {
          research_center_info: rsp
        }
      })
    }
  }

}

export default Model