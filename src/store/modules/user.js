import { loginApi, getInfoApi } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'

const state = {
  token: getToken(),
  userInfo: {}
}
const mutations = {
  // 设置token
  setToken(state, token) {
    state.token = token
    setToken(token)
  },
  // 删除token
  removeToken(state) {
    state.token = null
    removeToken()
  },
  setUser(state, user) {
    state.userInfo = user
  }
}

const actions = {
  // 登录
  async login(context, payload) {
    delete payload.isAgree
    const res = await loginApi(payload)
    console.log('token==>', res)
    context.commit('setToken', res.data.token)
    // context.commit('setToken', token)
  },
  async getUserInfo(context) {
    const res = await getInfoApi()
    console.log('res==>', res)
    context.commit('setUser', res.data[1])
  },
  logout(context) {
    // 清除token
    context.commit('removeToken')
    // 清除用户信息
    context.commit('setUser', {})
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

