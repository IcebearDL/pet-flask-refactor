import { FetchCrfInfo, FetchNavInfo } from '../../../services/crfBase'

const Model = {

  namespace: "crfBase",

  state: {
    crf_info: {},
    nav_info: []
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload }
    }
  },

  effects: {
    *fetchCrfInfo({ payload }, { call, put }) {
      let rsp = yield call(FetchCrfInfo, payload)
      yield put({
        type: "save",
        payload: {
          crf_info: rsp
        }
      })
    },

    *fetchNavInfo({ payload }, { call, put }) {
      let rsp = yield call(FetchNavInfo, payload)
      yield put({
        type: "save",
        payload: {
          nav_info: rsp
        }
      })
    }
  }

}

export default Model