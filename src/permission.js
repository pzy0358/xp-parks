import router from './router'
import store from './store'
// import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import { asyncRoutes } from './router/asyncRoutes'
// import { Message } from 'element-ui'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

// 过滤出一级路由所需要的权限点数据
const getFirstRoutePerms = (permiss) => {
  const newArr = permiss.map((item) => {
    return item.split(':')[0]
  })
  return [...new Set(newArr)]
}

// 过滤出二级路由所需要的权限点数据
const getSecondRoutePerms = (permiss) => {
  const newArr = permiss.map((item) => {
    const arr = item.split(':')
    return `${arr[0]}:${arr[1]}`
  })
  return [...new Set(newArr)]
}
// 根据权限点从自定义路由表(动态路由表)匹配出当前用户所拥有的动态路由
const getRoutes = (firstPerms, secondPerms, asyncRoutes) => {
  if (firstPerms.includes('*')) {
    return asyncRoutes
  }
  const routes = asyncRoutes.filter((item) => {
    return firstPerms.includes(item.permission)
  })
  routes.map((item) => {
    return {
      ...item,
      children: item.children.filter((child) => {
        return secondPerms.includes(child.permission)
      })
    }
  })
  return routes
}
// 路由白名单
const whiteList = ['/login', '/404'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      // 获取用户信息
      const hasGetUserInfo = store.getters.id
      if (hasGetUserInfo) {
        // await store.dispatch('user/getUserInfo')
        // console.log('store.getters.userId', store.getters.userId)
        // 有信息 放行
        next()
      } else {
        // 无信息
        try {
          // 1. 先拿到后台返回的权限点数据
          const { permissions } = await store.dispatch('user/userInfo')
          // 拿到一级路由权限点数据
          const firstPerms = getFirstRoutePerms(permissions)
          console.log('permissions', permissions)

          // 拿到二级路由权限点数据
          const secondPerms = getSecondRoutePerms(permissions)
          console.log('secondPerms', secondPerms)

          // 2. 再拿到自定义的路由表

          // 3. 匹配出当前登录的用户所有拥有的自定义的动态路由表
          const newRoutes = getRoutes(firstPerms, secondPerms, asyncRoutes)
          console.log('newRoutes', newRoutes)
          // 4. 动态的添加到路由表
          router.addRoutes([
            ...newRoutes // 404 page must be placed at the end !!!
            // { path: '*', redirect: '/404', hidden: true }
          ])
          // 成功 放行

          // 将动态添加的路由放到menus
          store.commit('menu/setMenus', newRoutes)
          // 成功 放行
          next(to.fullPath)
        } catch (error) {
          // 失败, 清空token 以及 用户信息
          await store.dispatch('user/logout')
          await store.dispatch('menu/resetMenu')
          // 失败, 清空token 以及 用户信息
          // next(`/login?redirect=${to.fullPath}`)
          // Message.error(error || 'Has Error')
          // 跳转到登录页
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      // next('/login')
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
