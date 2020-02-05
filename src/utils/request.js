import { extend } from 'umi-request'
import { notification } from 'antd'
import router from 'umi/router'
import CookieUtil from './cookie'

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
}

/**
 * 配置request请求时的默认参数
 */
const request = extend({
  // 错误处理
  errorHandler: error => {
    const { response } = error;

    if (response && response.status) {
      const errorText = codeMessage[response.status] || response.statusText;
      const { status, url } = response;
      notification.error({
        message: `请求错误 ${status}: ${url}`,
        description: errorText,
      });
    }
  }
})

//这里的request的header不能加在extend里，实例化会在login拿到token之前，之后的request并不带token
//：重写request，每次请求都带上header
const auth_request = (url, options) => {

  //判断cookie是否失效
  if (url !== '/login' && CookieUtil.get('token') === null) {
    router.replace('/login')
  }

  const { headers } = options
  const auth_header = {
    'Authorization': `Bearer ${CookieUtil.get('token')}`
  }

  const { NODE_ENV } = process.env
  // prefix 阿里云的测试服务器
  const prefix = NODE_ENV === 'development' ? '/api' : 'http://39.96.191.139'
  return request(prefix + url, {
    ...options,
    headers: headers ? { ...headers, ...auth_header } : auth_header
  })
}

// response拦截器, 处理response
// request.interceptors.response.use((response, options) => {
//   response.clone().json().then(
//     res => {
//       if (res.code === 403) {
//         if (/\?jwt=/.test(location.href)) {
//           setAuthority(location.href)
//         } else {
//           resetAuthority(location.href)
//         }
//       } else if (res.code === 401) {
//         notification.error({
//           key: 'auth',
//           message: `权限不足，请联系管理员`,
//           description: res.msg,
//         });
//       }
//     })
//   return response
// });

export default auth_request