import { message } from 'antd'
import { FetchProjects, PostProject, DeleteProject } from '../../../services/authProject'

const Model = {
  namespace: 'auth_project',

  state: {
    project_list: []
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload }
    }
  },

  effects: {
    *fetchProjects({ payload }, { call, put }) {
      const data = yield call(FetchProjects, payload)

      if (data) {
        yield put({
          type: 'save',
          payload: {
            project_list: data
          }
        })
      }
    },

    *postProject({ payload }, { call }) {
      const data = yield call(PostProject, payload)

      if (data) {
        message.success(payload.project_id ? '修改项目信息成功！' : '添加项目成功！')
      }
    },

    *deleteProject({ payload }, { call }) {
      const data = yield call(DeleteProject, payload)

      if (data) {
        message.success('删除项目成功！')
      }
    }
  }
}

export default Model
