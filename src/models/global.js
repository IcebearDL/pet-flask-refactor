import { FetchUserInfo, FetchResearchCenterInfo } from '../services/global'

const Model = {
  namespace: 'global',

  state: {
    research_center_info: []
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload }
    }
  },

  effects: {
    *fetchUserInfo(_, { call }) {
      const rsp = yield call(FetchUserInfo)

      window.localStorage.setItem('user_name', rsp.user_name)
    },

    *fetchResearchCenterInfo(_, { call, put }) {
      const rsp = yield call(FetchResearchCenterInfo)

      yield put({
        type: 'save',
        payload: {
          research_center_info: rsp
        }
      })
      return 123
    }
  }
}

export default Model
