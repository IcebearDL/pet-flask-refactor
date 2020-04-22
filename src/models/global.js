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
        // 向userInfo注入当前用户所属的总中心名称
        const userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
        const { research_center_id } = userInfo

        let research_center_name = ''

        for (const item of data) {
          if (item.research_center_id === research_center_id) {
            research_center_name = item.research_center_ids
            break
          }
        }

        userInfo.research_center_name = research_center_name
        window.localStorage.setItem('userInfo', JSON.stringify(userInfo))

        yield put({
          type: 'save',
          payload: {
            research_center_info: data
          }
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

      if (data && data.file_path) {
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
