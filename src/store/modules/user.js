import { loginApi, getInfoApi } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'

const state = {
  token: getToken() || '',
  userInfo: null
}
const mutations = {
  // 设置token
  setToken(state, token) {
    state.token = token
    setToken(token)
  },
  // 删除token
  removeToken(state) {
    state.token = ''
    state.userInfo = null
    // state.token = null
    removeToken()
  },
  setUserInfo(state, userInfo) {
    state.userInfo = userInfo
  }
}

// const actions = {
//   // 登录
//   async login(context, payload) {
//     delete payload.isAgree
//     const res = await loginApi(payload)
//     console.log('token==>', res)
//     context.commit('setToken', res.data.token)
//     // context.commit('setToken', token)
//   },
//   // 获取用户信息
//   async getUserInfo({ commit }) {
//     try {
//       // 调用获取用户信息接口
//       const { data } = await getInfoApi()
//       console.log('Res==>', data)
//       // 存储token
//       commit('setUserInfo', data)
//     } catch (error) {
//       console.log(error)
//     }
//   },
//   // 退出登录
//   async logout({ commit }) {
//     try {
//       // 移除token
//       commit('removeToken')
//     } catch (error) {
//       console.log(error)
//     }
//   }
// }
const actions = {
  // 登录
  async login({ commit }, { username, password }) {
    try {
      // 调用登录接口
      const { data } = await loginApi({ username, password })

      // 存储token
      commit('setToken', data.token)
    } catch (error) {
      console.log(error)
    }
  },
  // 获取用户信息
  async userInfo({ commit }) {
    try {
      // 调用获取用户信息接口
      const { data } = await getInfoApi()
      // 存储token
      commit('setUserInfo', data)
      // 将数据返回出去了
      return data
    } catch (error) {
      console.log(error)
    }
  },
  // // 退出登录
  // async logout({ commit }) {
  //   try {
  //     // 移除token
  //     commit('removeToken')
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }
  // 退出登录
  async logout({ commit }) {
    try {
      // 移除token
      commit('removeToken')
    } catch (error) {
      console.log(error)
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

