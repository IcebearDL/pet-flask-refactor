import { message } from 'antd'
import {
  FetchUsers,
  FetchSystemUsers,
  FetchProjectUsers,
  PostUser,
  SetRole,
  DeleteUser,
  DeleteSystemUser,
  DeleteProjectUser,
  AssignUserToSystem,
  AssignUserToProject
} from '../../../services/authUser'

const Model = {
  namespace: 'user',

  state: {
    user_list: [],
    system_user_list: [],
    project_user_list: [],
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

    *fetchSystemUsers({ payload }, { call, put }) {
      const { data, total } = yield call(FetchSystemUsers, payload)

      if (data) {
        yield put({
          type: 'save',
          payload: {
            system_user_list: data,
            total
          }
        })
      }
    },

    *fetchProjectUsers({ payload }, { call, put }) {
      const { data, total } = yield call(FetchProjectUsers, payload)

      if (data) {
        yield put({
          type: 'save',
          payload: {
            project_user_list: data,
            total
          }
        })
      }
    },

    *postUser({ payload }, { call }) {
      const data = yield call(PostUser, payload)

      if (data) {
        message.success(payload.user_id ? '修改用户信息成功！' : '添加用户成功！')
      }
    },

    *setRole({ payload }, { call }) {
      const data = yield call(SetRole, payload)

      if (data) {
        message.success('设置用户角色成功！')
      }
    },

    *deleteUser({ payload }, { call }) {
      const data = yield call(DeleteUser, payload)

      if (data) {
        message.success('删除用户成功！')
      }
    },

    *deleteSystemUser({ payload }, { call }) {
      const data = yield call(DeleteSystemUser, payload)

      if (data) {
        message.success('删除用户成功！')
      }
    },

    *deleteProjectUser({ payload }, { call }) {
      const data = yield call(DeleteProjectUser, payload)

      if (data) {
        message.success('删除用户成功！')
      }
    },

    *assignUserToSystem({ payload }, { call }) {
      const data = yield call(AssignUserToSystem, payload)

      if (data) {
        message.success('关联系统成功！')
      }
    },

    *assignUserToProject({ payload }, { call }) {
      const data = yield call(AssignUserToProject, payload)

      if (data) {
        message.success('关联项目成功！')
      }
    }
  }
}

export default Model
