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
      const data = yield call(FetchUserInfo)

      if (data) {
        window.localStorage.setItem('user_name', data.user_name)
      }
    },

    *fetchResearchCenterInfo(_, { call, put }) {
      const data = yield call(FetchResearchCenterInfo)

      if (data) {
        yield put({
          type: 'save',
          payload: {
            research_center_info: data
          }
        })
      }
    }
  }
}

export default Model
