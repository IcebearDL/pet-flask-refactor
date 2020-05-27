import { message } from 'antd'
import {
  FetchExpsampleList,
  FetchSampleInfo,
  SubmitSample,
  UnlockSample,
  DeleteSample,
  CreateSample,
  DownloadSample
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
    },

    *downloadSample({ payload }) {
      yield DownloadSample(payload).then(data => {
        // type 为需要导出的文件类型，此处为xls表格类型
        const blob = new Blob([data], { type: 'application/x-xlsx;charset=utf-8' })
        // 创建下载链接
        const downloadHref = window.URL.createObjectURL(blob)

        // 创建a标签并为其添加属性
        let downloadLink = document.createElement('a')

        downloadLink.href = downloadHref
        downloadLink.download = '样本数据.xlsx'
        // 触发点击事件执行下载
        downloadLink.click()
      })
    }
  }
}

export default Model
