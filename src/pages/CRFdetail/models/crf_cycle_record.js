import { message } from 'antd'
import {
  FetchMainSymptom,
  ModifyMainSymptom,
  DeleteMainSymptom,
  FetchTreatmentRecord,
  ModifyTreatmentRecord,
  DeleteTreatmentRecord,
  FetchEvaluation,
  ModifyEvaluation,
  FetchAdverseEvent,
  ModifyAdverseEvent,
  DeleteAdverseEvent,
  FetchECOG,
  ModifyECOG,
  FetchTreatmentStatusRecord,
  ModifyTreatmentStatusRecord
} from '../../../services/crfCycleRecord'

const Model = {
  namespace: 'crf_cycle_record',

  state: {
    main_symptom_table: [],
    treatment_record_table: [],
    evaluation: '',
    adverse_event_table: [],
    ECOG: -1,
    treatment_record_adjustment_status: {}
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload }
    }
  },

  effects: {
    *fetchMainSymptom({ payload }, { call, put }) {
      let rsp = yield call(FetchMainSymptom, payload)

      rsp.data.forEach(item => {
        if (item.existence === '存在') {
          item.existence = '0'
        } else if (item.existence === '消失') {
          item.existence = '1'
        }
      })
      yield put({
        type: 'save',
        payload: {
          main_symptom_table: rsp.data
        }
      })
    },

    *modifyMainSymptom({ payload }, { call }) {
      let rsp = yield call(ModifyMainSymptom, payload)

      if (rsp && rsp.code !== 200) {
        message.error(`保存主要症状体征表单失败，${rsp.msg}`)
      } else {
        message.success('保存主要症状体征表单成功！')
      }
    },

    *deleteMainSymptom({ payload }, { call }) {
      let rsp = yield call(DeleteMainSymptom, payload)

      if (rsp && rsp.code !== 200) {
        message.error(`删除主要症状体征失败，${rsp.msg}`)
      } else {
        message.success('删除主要症状体征成功！')
      }
    },

    *fetchTreatmentRecord({ payload }, { call, put }) {
      let rsp = yield call(FetchTreatmentRecord, payload)

      yield put({
        type: 'save',
        payload: {
          treatment_record_table: rsp.data
        }
      })
    },

    *modifyTreatmentRecord({ payload }, { call }) {
      let rsp = yield call(ModifyTreatmentRecord, payload)

      if (rsp && rsp.code !== 200) {
        message.error(`保存治疗记录表单失败，${rsp.msg}`)
      } else {
        message.success('保存治疗记录表单成功！')
      }
    },

    *deleteTreatmentRecord({ payload }, { call }) {
      let rsp = yield call(DeleteTreatmentRecord, payload)

      if (rsp && rsp.code !== 200) {
        message.error(`删除治疗记录失败，${rsp.msg}`)
      } else {
        message.success('删除治疗记录成功！')
      }
    },

    *fetchEvaluation({ payload }, { call, put }) {
      let rsp = yield call(FetchEvaluation, payload)

      yield put({
        type: 'save',
        payload: {
          evaluation: rsp.evaluation
        }
      })
    },

    *modifyEvaluation({ payload }, { call }) {
      let rsp = yield call(ModifyEvaluation, payload)

      if (rsp && rsp.code !== 200) {
        message.error(`保存疗效评价失败，${rsp.msg}`)
      } else {
        message.success('保存疗效评价成功！')
      }
    },

    *fetchAdverseEvent({ payload }, { call, put }) {
      let rsp = yield call(FetchAdverseEvent, payload)

      yield put({
        type: 'save',
        payload: {
          adverse_event_table: rsp.data
        }
      })
    },

    *modifyAdverseEvent({ payload }, { call }) {
      let rsp = yield call(ModifyAdverseEvent, payload)

      if (rsp && rsp.code !== 200) {
        message.error(`保存严重不良事件失败，${rsp.msg}`)
      } else {
        message.success('保存严重不良事件成功！')
      }
    },

    *deleteAdverseEvent({ payload }, { call }) {
      let rsp = yield call(DeleteAdverseEvent, payload)

      if (rsp && rsp.code !== 200) {
        message.error(`删除严重不良事件失败，${rsp.msg}`)
      } else {
        message.success('删除严重不良事件成功！')
      }
    },

    *fetchECOG({ payload }, { call, put }) {
      let rsp = yield call(FetchECOG, payload)

      yield put({
        type: 'save',
        payload: {
          ECOG: rsp.ECOG
        }
      })
    },

    *modifyECOG({ payload }, { call }) {
      let rsp = yield call(ModifyECOG, payload)

      if (rsp && rsp.code !== 200) {
        message.error(`保存ECOG评分失败，${rsp.msg}`)
      } else {
        message.success('保存ECOG评分成功！')
      }
    },

    *fetchTreatmentStatusRecord({ payload }, { call, put }) {
      let rsp = yield call(FetchTreatmentStatusRecord, payload)

      if (rsp.adjustment) {
        yield put({
          type: 'save',
          payload: {
            treatment_record_adjustment_status: rsp
          }
        })
      } else {
        yield put({
          type: 'save',
          payload: {
            treatment_record_adjustment_status: {}
          }
        })
      }
    },

    *modifyTreatmentStatusRecord({ payload }, { call }) {
      let rsp = yield call(ModifyTreatmentStatusRecord, payload)

      if (rsp && rsp.code !== 200) {
        message.error(`保存治疗记录单调整表单失败，${rsp.msg}`)
      } else {
        message.success('保存治疗记录单调整表单成功！')
      }
    }
  }
}

export default Model
