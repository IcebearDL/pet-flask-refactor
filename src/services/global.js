import request from '../utils/request'

//获取用户姓名（医生姓名）
export async function FetchUserInfo() {
    return request('/user_div_info', {
        method: 'GET'
    })
}