import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/Workbench',
    children: [{
      path: 'Workbench',
      name: 'Workbench',
      component: () => import('@/views/Workbench/index'),
      meta: { title: '工作台', icon: 'el-icon-eleme' }
    }]
  },

  {
    path: '/park',
    component: Layout,
    redirect: '/park/Building',
    name: 'park',
    meta: { title: '园区管理', icon: 'el-icon-office-building' },
    children: [
      {
        path: 'Building',
        name: 'Building',
        component: () => import('@/views/park/Building/index'),
        meta: { title: '楼宇管理' }
      },
      {
        path: 'Enterprice',
        name: 'Enterprice',
        component: () => import('@/views/park/Enterprice/index'),
        meta: { title: '企业管理' }
      }
    ]
  },

  {
    path: '/Car',
    component: Layout,
    redirect: '/Car/Area',
    name: 'Car',
    meta: { title: '行车管理', icon: 'el-icon-guide' },
    children: [
      {
        path: 'Area',
        name: 'Area',
        component: () => import('@/views/Car/Area/index'),
        meta: { title: '区域管理' }
      },
      {
        path: 'MonthCard',
        name: 'MonthCard',
        component: () => import('@/views/Car/MonthCard/index'),
        meta: { title: '月卡管理' }
      },
      {
        path: 'Pay',
        name: 'Pay',
        component: () => import('@/views/Car/Pay/index'),
        meta: { title: '停车缴费管理' }
      },
      {
        path: 'Billing',
        name: 'Billing',
        component: () => import('@/views/Car/Billing/index'),
        meta: { title: '计费规则管理' }
      }
    ]
  },

  {
    path: '/Propety',
    component: Layout,
    children: [
      {
        path: 'cost',
        name: 'cost',
        component: () => import('@/views/Propety/cost/index'),
        meta: { title: '物业费管理', icon: 'form' }
      }
    ]
  },

  {
    path: '/Rod',
    component: Layout,
    redirect: '/Rod/manage',
    name: 'Rod',
    meta: { title: '一体杆管理', icon: 'el-icon-refrigerator' },
    children: [
      {
        path: 'manage',
        name: 'manage',
        component: () => import('@/views/Rod/manage/index'),
        meta: { title: '一体杆管理' }
      },
      {
        path: 'warnList',
        name: 'warnList',
        component: () => import('@/views/Rod/warnList/index'),
        meta: { title: '告警记录' }
      }
    ]
  },
  {
    path: '/System',
    component: Layout,
    redirect: '/System/Employee',
    name: 'System',
    meta: { title: '系统管理', icon: 'el-icon-setting' },
    children: [
      {
        path: 'Employee',
        name: 'Employee',
        component: () => import('@/views/System/Employee/index'),
        meta: { title: '员工管理' }
      },
      {
        path: 'Permission',
        name: 'Permission',
        component: () => import('@/views/System/Permission/index'),
        meta: { title: '角色管理' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
