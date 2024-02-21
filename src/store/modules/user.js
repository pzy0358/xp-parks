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
  setUserInfo(state, user) {
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
  // 获取用户信息
  async getUserInfo({ commit }) {
    try {
      // 调用获取用户信息接口
      const { data } = await getInfoApi()
      console.log('Res==>', data)
      // 存储token
      commit('setUserInfo', data)
    } catch (error) {
      console.log(error)
    }
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

