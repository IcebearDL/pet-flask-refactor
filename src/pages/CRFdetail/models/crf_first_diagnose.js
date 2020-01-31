import { message } from "antd"
import {
  FetchPatient, ModifyPatient, FetchPatientHistory,
  ModifyPatientHistory, FetchLabInspection, ModifyLabInspection,
  FetchFirstDiagnose, ModifyFirstDiagnose, FetchCycleTime,
  ModifyCycleTime, FetchPhotoEvaluateTable, ModifyPhotoEvaluateTable,
  DeletePhotoEvaluateTable, FetchDiagnoseHistory, ModifyDiagnoseHistory,
  DeleteDiagnoseHistory, FetchPatientReportTable, ModifyPatientReportTable,
  DeletePatientReportTable
} from '../../../services/crfFirstDiagnose'

const Model = {

  namespace: "crf_first_diagnose",

  state: {
    patient: {},
    patient_report_table: [],
    cycle_time: '',
    first_diagnose: {},
    diagnose_history: [],
    photo_evaluate_table: [],
    patient_history: {},
    lab_inspection: {}
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload }
    }
  },

  effects: {
    *fetchPatient({ payload }, { call, put }) {
      let rsp = yield call(FetchPatient, payload)
      yield put({
        type: "save",
        payload: {
          patient: rsp
        }
      })
    },

    *modifyPatient({ payload }, { call, put }) {
      let rsp = yield call(ModifyPatient, payload)
      if (rsp && rsp.code !== 200) {
        message.error(`保存人口统计学表单失败，${rsp.msg}`)
      } else {
        message.success('保存人口统计学表单成功！')
      }
    },

    *fetchPatientHistory({ payload }, { call, put }) {
      let rsp = yield call(FetchPatientHistory, payload)
      yield put({
        type: "save",
        payload: {
          patient_history: rsp
        }
      })
    },

    *modifyPatientHistory({ payload }, { call, put }) {
      let rsp = yield call(ModifyPatientHistory, payload)
      if (rsp && rsp.code !== 200) {
        message.error(`保存既往史表单失败，${rsp.msg}`)
      } else {
        message.success('保存既往史表单成功！')
      }
    },

    *fetchLabInspection({ payload }, { call, put }) {
      let rsp = yield call(FetchLabInspection, payload)
      yield put({
        type: "save",
        payload: {
          lab_inspection: rsp
        }
      })
    },

    *modifyLabInspection({ payload }, { call, put }) {
      let rsp = yield call(ModifyLabInspection, payload)
      if (rsp && rsp.code !== 200) {
        message.error(`保存实验室检查表单失败，${rsp.msg}`)
      } else {
        message.success('保存实验室检查表单成功！')
      }
    },

    *fetchFirstDiagnose({ payload }, { call, put }) {
      let rsp = yield call(FetchFirstDiagnose, payload)
      yield put({
        type: "save",
        payload: {
          first_diagnose: rsp
        }
      })
    },

    *modifyFirstDiagnose({ payload }, { call, put }) {
      let rsp = yield call(ModifyFirstDiagnose, payload)
      if (rsp && rsp.code !== 200) {
        message.error(`保存初诊过程表单失败，${rsp.msg}`)
      } else {
        message.success('保存初诊过程表单成功！')
      }
    },

    *fetchCycleTime({ payload }, { call, put }) {
      let rsp = yield call(FetchCycleTime, payload)
      yield put({
        type: "save",
        payload: {
          cycle_time: rsp.cycle_time
        }
      })
    },

    *modifyCycleTime({ payload }, { call, put }) {
      let rsp = yield call(ModifyCycleTime, payload)
      if (rsp && rsp.code !== 200) {
        message.error(`保存访视时间失败，${rsp.msg}`)
      } else {
        message.success('保存访视时间成功！')
      }
    },

    *fetchPhotoEvaluateTable({ payload }, { call, put }) {
      let rsp = yield call(FetchPhotoEvaluateTable, payload)
      yield put({
        type: "save",
        payload: {
          photo_evaluate_table: rsp.data
        }
      })
    },

    *modifyPhotoEvaluateTable({ payload }, { call, put }) {
      let rsp = yield call(ModifyPhotoEvaluateTable, payload)
      if (rsp && rsp.code !== 200) {
        message.error(`保存影像学评估表单失败，${rsp.msg}`)
      } else {
        message.success('保存影像学评估表单成功！')
      }
    },

    *deletePhotoEvaluateTable({ payload }, { call, put }) {
      let rsp = yield call(DeletePhotoEvaluateTable, payload)
      if (rsp && rsp.code !== 200) {
        message.error(`删除影像学评估失败，${rsp.msg}`)
      } else {
        message.success('删除影像学评估成功！')
      }
    },

    *fetchDiagnoseHistory({ payload }, { call, put }) {
      let rsp = yield call(FetchDiagnoseHistory, payload)
      yield put({
        type: "save",
        payload: {
          diagnose_history: rsp.data
        }
      })
    },

    *modifyDiagnoseHistory({ payload }, { call, put }) {
      let rsp = yield call(ModifyDiagnoseHistory, payload)
      if (rsp && rsp.code !== 200) {
        message.error(`保存治疗史表单失败，${rsp.msg}`)
      } else {
        message.success('保存治疗史表单成功！')
      }
    },

    *deleteDiagnoseHistory({ payload }, { call, put }) {
      let rsp = yield call(DeleteDiagnoseHistory, payload)
      if (rsp && rsp.code !== 200) {
        message.error(`删除治疗史失败，${rsp.msg}`)
      } else {
        message.success('删除治疗史成功！')
      }
    },

    *fetchPatientReportTable({ payload }, { call, put }) {
      let rsp = yield call(FetchPatientReportTable, payload)
      yield put({
        type: "save",
        payload: {
          patient_report_table: rsp.data
        }
      })
    },

    *modifyPatientReportTable({ payload }, { call, put }) {
      let rsp = yield call(ModifyPatientReportTable, payload)
      if (rsp && rsp.code !== 200) {
        message.error(`保存体格报告表单失败，${rsp.msg}`)
      } else {
        message.success('保存体格报告表单成功！')
      }
    },

    *deletePatientReportTable({ payload }, { call, put }) {
      let rsp = yield call(DeletePatientReportTable, payload)
      if (rsp && rsp.code !== 200) {
        message.error(`删除体格报告失败，${rsp.msg}`)
      } else {
        message.success('删除体格报告成功！')
      }
    }
  }

}

export default Model