import request from '../utils/request'

//获取部分CRF展示信息
export async function FetchCrfInfo({ sample_id }) {
  return request(`/CRF_div_info/${sample_id}`, {
    method: 'GET'
  })
}

//获取CRF的导航信息
export async function FetchNavInfo({ sample_id }) {
  return request(`/nav/${sample_id}`, {
    method: 'GET'
  })
}

//增加cycle记录
export async function AddCycle({ sample_id }) {
  return request(`/cycle/${sample_id}`, {
    method: 'POST'
  })
}

//删除cycle记录
export async function DeleteCycle({ sample_id }) {
  return request(`/cycle/${sample_id}`, {
    method: 'DELETE'
  })
}