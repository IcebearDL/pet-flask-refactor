import { message } from "antd"
import {
  FetchCrfInfo, FetchNavInfo, AddCycle,
  DeleteCycle
} from '../../../services/crfBase'

const Model = {

  namespace: "crfBase",

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
      let rsp = yield call(FetchCrfInfo, payload)
      yield put({
        type: "save",
        payload: {
          crf_info: rsp
        }
      })
    },

    *fetchNavInfo({ payload }, { call, put }) {
      let rsp = yield call(FetchNavInfo, payload)
      yield put({
        type: "save",
        payload: {
          nav_info: rsp[1].children
        }
      })
    },

    *addCycle({ payload }, { call, put }) {
      let rsp = yield call(AddCycle, payload)
      if (rsp && rsp.code !== 200) {
        message.error(`增加访视记录失败，${rsp.msg}`)
      } else {
        message.success('增加访视记录成功！')
      }
    },

    *deleteCycle({ payload }, { call, put }) {
      let rsp = yield call(DeleteCycle, payload)
      if (rsp && rsp.code !== 200) {
        message.error(`删除访视记录失败，${rsp.msg}`)
      } else {
        message.success('删除访视记录成功！')
      }
    }
  }

}

export default Model