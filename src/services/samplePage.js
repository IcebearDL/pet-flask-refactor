import request from '../utils/request'

// 获取样本列表
export async function FetchExpsampleList({ project_id, body }) {
  return request(`/sample/${project_id}`, {
    method: 'GET',
    params: body
  })
}

// 获取部分项目的展示信息
export async function FetchSampleInfo({ project_id }) {
  return request(`/expSample_div_info/${project_id}`, {
    method: 'GET'
  })
}

// 提交样本到总中心
export async function SubmitSample(body) {
  return request('/submit_sample', {
    method: 'POST',
    data: body
  })
}

// 总中心解锁样本
export async function UnlockSample({ sample_id }) {
  return request(`/sapmle/unlock/${sample_id}`, {
    method: 'POST'
  })
}

// 删除样本
export async function DeleteSample({ sample_id }) {
  return request(`/sample/${sample_id}`, {
    method: 'DELETE'
  })
}

// 添加样本
export async function CreateSample(body) {
  return request('/sample', {
    method: 'POST',
    data: body
  })
}

// 按excel导出
export async function DownloadSample({ sample_id }) {
  return request(`/sample/data_json/${sample_id}`, {
    method: 'GET'
  })
}
