import { FetchProjectList } from '../../services/projectPage'

const Model = {

  namespace: "project",

  state: {
    project_list: []
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload }
    }
  },

  effects: {
    *fetchProjectList({ payload }, { call, put }) {
      let rsp = yield call(FetchProjectList, payload)
      yield put({
        type: "save",
        payload: {
          project_list: rsp.data
        }
      })
    }
  }

}

export default Model