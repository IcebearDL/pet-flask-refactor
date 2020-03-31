import { FetchProjectList } from '../../services/projectPage'

const Model = {
  namespace: 'project',

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
      const data = yield call(FetchProjectList, payload)

      if (data) {
        yield put({
          type: 'save',
          payload: {
            project_list: data
          }
        })
      }
    }
  }
}

export default Model
