import { message } from 'antd'
import { FetchUsers, PostUser, DeleteUser, AssignUser } from '../../../services/authUser'

const Model = {
  namespace: 'user',

  state: {
    user_list: [],
    total: null
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload }
    }
  },

  effects: {
    *fetchUsers({ payload }, { call, put }) {
      const { data, total } = yield call(FetchUsers, payload)

      if (data) {
        yield put({
          type: 'save',
          payload: {
            user_list: data,
            total
          }
        })
      }
    },

    *postUser({ payload }, { call }) {
      const data = yield call(PostUser, payload)

      if (data) {
        message.success(payload.id ? '修改用户信息成功！' : '添加用户成功！')
      }
    },

    *deleteUser({ payload }, { call }) {
      const data = yield call(DeleteUser, payload)

      if (data) {
        message.success('删除用户成功！')
      }
    },

    *assignUser({ payload }, { call }) {
      const data = yield call(AssignUser, payload)

      if (data) {
        message.success('关联用户成功！')
      }
    }
  }
}

export default Model
