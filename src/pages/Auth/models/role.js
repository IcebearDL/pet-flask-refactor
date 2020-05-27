import { message } from 'antd'
import { FetchRoleList, PostRole, DeleteRole } from '../../../services/authUser'

const Model = {
  namespace: 'role',

  state: {
    role_list: []
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload }
    }
  },

  effects: {
    *fetchRoleList({ payload }, { call, put }) {
      const data = yield call(FetchRoleList, payload)

      if (data) {
        yield put({
          type: 'save',
          payload: {
            role_list: data
          }
        })
      }
    },

    *postRole({ payload }, { call }) {
      const data = yield call(PostRole, payload)

      if (data) {
        message.success(payload.role_id ? '修改角色成功！' : '创建角色成功！')
      }
    },

    *deleteRole({ payload }, { call }) {
      const data = yield call(DeleteRole, payload)

      if (data) {
        message.success('删除角色成功！')
      }
    }
  }
}

export default Model
