import request from '../utils/request'

// 获取部分CRF展示信息
export async function FetchCrfInfo({ sample_id }) {
  return request(`/CRF_div_info/${sample_id}`, {
    method: 'GET'
  })
}

// 获取CRF的导航信息
export async function FetchNavInfo({ sample_id }) {
  return request(`/nav/${sample_id}`, {
    method: 'GET'
  })
}

// 增加cycle记录
export async function AddCycle({ sample_id }) {
  return request(`/cycle/${sample_id}`, {
    method: 'POST'
  })
}

// 删除cycle记录
export async function DeleteCycle({ sample_id }) {
  return request(`/cycle/${sample_id}`, {
    method: 'DELETE'
  })
}

// 获取生存期随访信息
export async function FetchInterviewTable({ sample_id }) {
  return request(`/interview_table/${sample_id}`, {
    method: 'GET'
  })
}

// 添加或修改生存期随访信息
export function ModifyInterview({ sample_id, body }) {
  return request(`/interview/${sample_id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
}

// 删除生存期随访
export function DeleteInterview({ sample_id, interview_id }) {
  return request(`/interview/${sample_id}/${interview_id}`, {
    method: 'DELETE'
  })
}

// 获取项目总结
export async function FetchSummary({ sample_id }) {
  return request(`/summary/${sample_id}`, {
    method: 'GET'
  })
}

// 提交项目总结
export async function ModifySummary({ sample_id, body }) {
  return request(`/summary/${sample_id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
}

// 获取全部严重不良事件
export function FetchAdverseEventAll({ sample_id }) {
  return request(`/adverse_event_table_all/${sample_id}`, {
    method: 'GET'
  })
}
