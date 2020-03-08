import { message } from 'antd'
import {
  FetchInterviewTable,
  ModifyInterview,
  DeleteInterview,
  FetchSummary,
  ModifySummary,
  FetchAdverseEventAll
} from '../../../services/crfBase'

const Model = {
  namespace: 'crf_interview',

  state: {
    interview_table: [],
    summary: {},
    adverse_event_table_all: []
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload }
    }
  },

  effects: {
    *fetchInterviewTable({ payload }, { call, put }) {
      let rsp = yield call(FetchInterviewTable, payload)

      yield put({
        type: 'save',
        payload: {
          interview_table: rsp.data
        }
      })
    },

    *modifyInterview({ payload }, { call }) {
      let rsp = yield call(ModifyInterview, payload)

      if (rsp && rsp.code !== 200) {
        message.error(`保存生存期随访信息失败，${rsp.msg}`)
      } else {
        message.success('保存生存期随访信息成功！')
      }
    },

    *deleteInterview({ payload }, { call }) {
      let rsp = yield call(DeleteInterview, payload)

      if (rsp && rsp.code !== 200) {
        message.error(`删除生存期随访信息失败，${rsp.msg}`)
      } else {
        message.success('删除生存期随访信息成功！')
      }
    },

    *fetchSummary({ payload }, { call, put }) {
      let rsp = yield call(FetchSummary, payload)

      if (rsp) {
        yield put({
          type: 'save',
          payload: {
            summary: rsp
          }
        })
      } else {
        yield put({
          type: 'save',
          payload: {
            summary: {}
          }
        })
      }
    },

    *modifySummary({ payload }, { call }) {
      let rsp = yield call(ModifySummary, payload)

      if (rsp && rsp.code !== 200) {
        message.error(`保存项目总结失败，${rsp.msg}`)
      } else {
        message.success('保存项目总结成功！')
      }
    },

    *fetchAdverseEventAll({ payload }, { call, put }) {
      let rsp = yield call(FetchAdverseEventAll, payload)

      yield put({
        type: 'save',
        payload: {
          adverse_event_table_all: rsp.data
        }
      })
    }
  }
}

export default Model
