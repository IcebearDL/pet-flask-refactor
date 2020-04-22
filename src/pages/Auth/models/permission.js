import { message } from 'antd'
import { FetchPermissionList, PostPermission, DeletePermission } from '../../../services/system'

const Model = {
  namespace: 'permission',

  state: {
    permission_list: []
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload }
    }
  },

  effects: {
    *fetchPermissionList({ payload }, { call, put }) {
      const data = yield call(FetchPermissionList, payload)

      if (data) {
        yield put({
          type: 'save',
          payload: {
            permission_list: data
          }
        })
      }
    },

    *postPermission({ payload }, { call }) {
      const data = yield call(PostPermission, payload)

      if (data) {
        message.success(payload.id ? '修改系统权限成功！' : '添加系统权限成功！')
      }
    },

    *deletePermission({ payload }, { call }) {
      const data = yield call(DeletePermission, payload)

      if (data) {
        message.success('删除系统权限成功！')
      }
    }
  }
}

export default Model
