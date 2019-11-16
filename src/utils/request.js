// 配置一个axios请求函数
import axios from 'axios'
import JSONBIGINT from 'json-bigint'
import store from '@/store'
import router from '@/router'

// 创建一个新的axios实例
// 如果用默认的只能 写一个配置
const instance = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/',
  transformResponse: [(data) => {
    // data是后端给的原始数据格式
    try {
      return JSONBIGINT.parse(data)
    } catch (exception) {
      return data
    }
  }]
})

// 请求拦截器 追加token到请求头
instance.interceptors.request.use(config => {
  // 拦截成功  获取token
  if (store.state.user.token) {
    config.headers.Authorization = `Bearer ${store.state.user.token}`
  }
  return config
}, err => Promise.reject(err))

// 响应拦截器  1. 获取有效数据  2. token的延长有效期 TODO
instance.interceptors.response.use(res => {
  try {
    return res.data.data
  } catch (e) {
    return res
  }
}, async err => {
  // 如果请求失败走这个函数
  // 1. 判断是否是 401 状态码
  // 2. 如果是  判断是不是登录
  // 2.1  如果没登录  拦截到登录页面（登录完了需要回跳）
  // 2.2  已经登录了  token失效
  // 3. 发刷新token的请求
  // 3.1 刷新成功  更新vuex和本地token
  // 3.2 把之前失败的请求继续发送出去
  // 3.3 刷新失败  拦截到登录页面（登录完了需要回跳）
  const loginConfig = { path: '/login', query: { 'redirectUrl': router.currentRoute.path } }
  if (err.response && err.response.status === 401) {
    const user = store.state.user
    if (!user || !user.token || !user.refresh_token) {
      return router.push(loginConfig)
    }
    try {
      // 更新token
      const { data: { data } } = await axios({
        url: '/app/v1_0/authorizations',
        method: 'put',
        headers: {
          Authorization: `Bearer ${user.refresh_token}`
        }
      })
      // 更新vuex和本地token
      store.commit('setUser', {
        token: data.token,
        refresh_token: data.refresh_token
      })
      return instance(err.config)
    } catch (e) {
      store.commit('delUser')
      return router.push(loginConfig)
    }
  }
  return Promise.reject(err)
})

// 调用接口 (接口地址，请求方式，传参)

export default (url, method, data) => {
  // params 选项是 get传参
  // data 选项是 其他请求方式的传参

  return instance({
    url,
    method,
    // js表达式运行的结果必须是字符串（params|data）
    // 严谨处理  get Get GET 都认为是get
    [method.toLowerCase() === 'get' ? 'params' : 'data']: data

  })
}
