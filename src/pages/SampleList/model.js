import { message } from 'antd'
import {
  FetchExpsampleList,
  FetchSampleInfo,
  SubmitSample,
  UnlockSample,
  DeleteSample,
  CreateSample
} from '../../services/samplePage'

const Model = {
  namespace: 'sample',

  state: {
    total: 0,
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
      const data = yield call(FetchExpsampleList, payload)

      if (data) {
        yield put({
          type: 'save',
          payload: {
            total: data.total,
            sample_list: data.data
          }
        })
      }
    },

    *fetchSampleInfo({ payload }, { call, put }) {
      const data = yield call(FetchSampleInfo, payload)

      if (data) {
        yield put({
          type: 'save',
          payload: {
            sample_info: data
          }
        })
      }
    },

    *submitSample({ payload }, { call }) {
      const data = yield call(SubmitSample, payload)

      if (data) {
        message.success('提交样本到中心成功！')
      }
    },

    *unlockSample({ payload }, { call }) {
      const data = yield call(UnlockSample, payload)

      if (data) {
        message.success('样本解锁成功！')
      }
    },

    *deleteSample({ payload }, { call }) {
      const data = yield call(DeleteSample, payload)

      if (data) {
        message.success('删除样本成功！')
      }
    },

    *createSample({ payload }, { call }) {
      const data = yield call(CreateSample, payload)

      if (data) {
        if (payload.sample_id) {
          message.success('编辑样本成功！')
        } else {
          message.success('添加样本成功！')
        }
      }
    }

    // *downloadSample({ payload }, { call }) {
    //   const data = yield call(DownloadSample, payload)
    // }
  }
}

export default Model
