import { message } from "antd"
import {
  FetchExpsampleList, FetchSampleInfo, SubmitSample,
  DeleteSample, CreateSample
} from '../../services/samplePage'

const Model = {

  namespace: "sample",

  state: {
    sample_list: [],
    sample_info: {}
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload }
    }
  },

  effects: {
    *fetchExpsampleList({ payload }, { call, put }) {
      let rsp = yield call(FetchExpsampleList, payload)
      yield put({
        type: "save",
        payload: {
          sample_list: rsp.data
        }
      })
    },

    *fetchSampleInfo({ payload }, { call, put }) {
      let rsp = yield call(FetchSampleInfo, payload)
      yield put({
        type: "save",
        payload: {
          sample_info: rsp
        }
      })
    },

    *submitSample({ payload }, { call, put }) {
      let rsp = yield call(SubmitSample, payload)
      if (rsp && rsp.code !== 200) {
        message.error(`提交样本到中心失败，${rsp.msg}`)
      } else {
        message.success(`提交样本到中心成功！`)
      }
    },

    *deleteSample({ payload }, { call, put }) {
      let rsp = yield call(DeleteSample, payload)
      if (rsp && rsp.code !== 200) {
        message.error(`删除样本失败，${rsp.msg}`)
      } else {
        message.success(`删除样本成功！`)
      }
    },

    *createSample({ payload }, { call, put }) {
      let rsp = yield call(CreateSample, payload)
      if (rsp && rsp.code !== 200) {
        if (payload.sample_id) {
          message.error(`编辑样本失败，${rsp.msg}`)
        } else {
          message.error(`添加样本失败，${rsp.msg}`)
        }
      } else {
        if (payload.sample_id) {
          message.success(`编辑样本成功！`)
        } else {
          message.success(`添加样本成功！`)
        }
      }
    }
  }

}

export default Model