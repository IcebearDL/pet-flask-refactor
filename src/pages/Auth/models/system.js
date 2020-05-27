import { message } from 'antd'
import { FetchSystems, PostSystem, DeleteSystem } from '../../../services/authSystem'

const Model = {
  namespace: 'system',

  state: {
    system_list: []
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload }
    }
  },

  effects: {
    *fetchSystems(_, { call, put }) {
      const data = yield call(FetchSystems)

      if (data) {
        yield put({
          type: 'save',
          payload: {
            system_list: data
          }
        })
      }
    },

    *postSystem({ payload }, { call }) {
      const data = yield call(PostSystem, payload)

      if (data) {
        message.success(payload.system_id ? '修改系统信息成功！' : '添加系统成功！')
      }
    },

    *deleteSystem({ payload }, { call }) {
      const data = yield call(DeleteSystem, payload)

      if (data) {
        message.success('删除系统成功！')
      }
    }
  }
}

export default Model
