import { message } from 'antd'
import {
  FetchUserInfo,
  FetchResearchCenterInfo,
  FetchPatientGroup,
  FetchSignature,
  PostSignature,
  DeleteFile,
  FetchAuthInfo
} from '../services/global'

const Model = {
  namespace: 'global',

  state: {
    research_center_info: [],
    group_ids_info: []
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
        window.localStorage.setItem('userInfo', JSON.stringify(data))
      }
    },

    *fetchResearchCenterInfo(_, { call, put }) {
      const data = yield call(FetchResearchCenterInfo)

      if (data) {
        const research_center_info = data.map(item => ({
          id: item.research_center_id,
          name: item.research_center_ids
        }))

        // 向userInfo注入当前用户所属的总中心名称
        const userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
        const { research_center_id } = userInfo

        for (const item of research_center_info) {
          if (item.id === research_center_id) {
            userInfo.research_center_name = item.name
            window.localStorage.setItem('userInfo', JSON.stringify(userInfo))
            break
          }
        }

        yield put({
          type: 'save',
          payload: { research_center_info }
        })
      }
    },

    *fetchPatientGroup({ payload }, { call, put }) {
      const data = yield call(FetchPatientGroup, payload)

      if (data) {
        yield put({
          type: 'save',
          payload: {
            group_ids_info: data
          }
        })
      }
    },

    *fetchSignature(_, { call }) {
      const data = yield call(FetchSignature)

      if (data && data.file_path !== undefined) {
        window.localStorage.setItem('user_signature', data.file_path)
      }
    },

    *postSignature({ payload }, { call }) {
      const data = yield call(PostSignature, payload)

      if (data) {
        message.success('保存签名成功！')
      }
    },

    *deleteFile({ payload }, { call }) {
      const data = yield call(DeleteFile, payload)

      if (data) {
        message.success('删除成功！')
      }
    },

    *fetchAuthInfo({ payload }, { call }) {
      const data = yield call(FetchAuthInfo, payload)

      if (data) {
        window.localStorage.setItem('auth_userInfo', JSON.stringify(data))
      }
    }
  }
}

export default Model
