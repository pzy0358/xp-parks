import Vue from 'vue'
import store from '@/store'

Vue.directive('auth-btn', {
  inserted(el, binding) {
    console.log('el', el)
    console.log('binding', binding)

    // 先获取按钮所绑定的值
    const val = binding.value
    // 获取后台返回的按钮权限数据列表
    const periss = store.state.user.userInfo.permissions
    // 判断按钮所绑定的值是否存在于后端返回按钮权限列表中
    const isValid = periss.includes(val)

    if (!isValid) {
      el.parentNode.removeChild(el)
    }
  }
})
