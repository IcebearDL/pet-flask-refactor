import { message } from 'antd'
import {
  FetchCrfInfo,
  FetchNavInfo,
  AddCycle,
  DeleteCycle
} from '../../../services/crfBase'

const Model = {
  namespace: 'crfBase',

  state: {
    crf_info: {},
    nav_info: []
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload }
    }
  },

  effects: {
    *fetchCrfInfo({ payload }, { call, put }) {
      const data = yield call(FetchCrfInfo, payload)

      if (data) {
        yield put({
          type: 'save',
          payload: {
            crf_info: data
          }
        })
      }
    },

    *fetchNavInfo({ payload }, { call, put }) {
      const data = yield call(FetchNavInfo, payload)

      if (data) {
        yield put({
          type: 'save',
          payload: {
            nav_info: data
          }
        })
      }
    },

    *addCycle({ payload }, { call }) {
      const data = yield call(AddCycle, payload)

      if (data) {
        message.success('增加访视记录成功！')
      }
    },

    *deleteCycle({ payload }, { call }) {
      const data = yield call(DeleteCycle, payload)

      if (data) {
        message.success('删除访视记录成功！')
      }
    }
  }
}

export default Model
