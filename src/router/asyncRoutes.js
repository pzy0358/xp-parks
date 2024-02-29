import Layout from '@/layout'

export const asyncRoutes = [
  {
    path: '/park',
    component: Layout,
    redirect: '/park/Building',
    name: 'park',
    alwaysShow: true,
    permission: 'park',
    meta: { title: '园区管理', icon: 'el-icon-office-building' },
    children: [
      {
        path: 'Building',
        name: 'Building',
        permission: 'park:building',
        component: () => import('@/views/park/Building/index'),
        meta: { title: '楼宇管理' }
      },
      {
        path: 'Enterprice',
        name: 'Enterprice',
        permission: 'park:Enterprise',
        component: () => import('@/views/park/Enterprice/index'),
        meta: { title: '企业管理' }
      }
    ]
  },

  {
    path: '/Car',
    component: Layout,
    redirect: '/Car/table',
    // name: 'Car',
    alwaysShow: true,
    permission: 'parking',
    meta: { title: '行车管理', icon: 'el-icon-guide' },
    children: [
      {
        path: 'Area',
        // name: 'Area',
        permission: 'parking:area',
        component: () => import('@/views/Car/Area/index'),
        meta: { title: '区域管理' }
      },
      {
        path: 'MonthCard',
        // name: 'MonthCard',
        permission: 'parking:card',
        component: () => import('@/views/Car/MonthCard/index'),
        meta: { title: '月卡管理' }
      },
      {
        path: 'Pay',
        // name: 'Pay',
        permission: 'parking:payment',
        component: () => import('@/views/Car/Pay/index'),
        meta: { title: '停车缴费管理' }
      },
      {
        path: 'Billing',
        // name: 'Billing',
        permission: 'parking:rule',
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
    permission: 'pole',
    meta: { title: '一体杆管理', icon: 'el-icon-refrigerator' },
    alwaysShow: true,
    children: [
      {
        path: 'manage',
        // name: 'manage',
        permission: 'pole:info',
        component: () => import('@/views/Rod/manage/index'),
        meta: { title: '一体杆管理' }
      },
      {
        path: 'warnList',
        // name: 'warnList',
        permission: 'pole:warning',
        component: () => import('@/views/Rod/warnList/index'),
        meta: { title: '告警记录' }
      }
    ]
  },
  {
    path: '/System',
    component: Layout,
    permission: 'sys',
    alwaysShow: true,
    meta: { title: '系统管理', icon: 'el-icon-setting' },
    children: [
      {
        path: 'Employee',
        // name: 'Employee',
        permission: 'sys:user',
        component: () => import('@/views/System/Employee/index'),
        meta: { title: '员工管理' }
      },
      {
        path: 'Permission',
        // name: 'Permission',
        permission: 'sys:role',
        component: () => import('@/views/System/Permission/index'),
        meta: { title: '角色管理' }
      }
    ]
  }
]
