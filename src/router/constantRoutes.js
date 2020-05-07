//静态路由

const _CONSTANTS_ROUTERS = [{
    path: "/auth",
    name: "Auth",
    component: () => import("@/components/user/auth.vue")
  },
  {
    path: '/',
    name: 'Home',
    redirect: '/workplace',
    component: () => import("@/components/Layout.vue"),
    children: [{
        path: '/workplace',
        name: 'Workplace',
        component: () => import("@/components/commonWorkplace/index.vue"),
        meta: {
          title: '工作台',
          icon: 'desktop',
        }
      },
      {
        path: '/customManage',
        name: 'CustomManage',
        component: () => import("@/components/customManage/index.vue"),
        meta: {
          title: '客户管理',
          icon: 'customer-service',
        }
      },
      {
        path: '/customFollow',
        name: 'CustomFollow',
        hidden: true,
        component: () => import("@/components/customFollow/index.vue"),
        meta: {
          title: '客户跟进',
          icon: 'tool',
        }
      },
      {
        path: '/customDetail',
        name: 'CustomDetail',
        hidden: true,
        component: () => import("@/components/customDetail/index.vue"),
        meta: {
          title: '客户详情',
          icon: 'tool',
        }
      },

      {
        path: '/orderManage',
        name: 'OrderManage',
        component: () => import("@/components/orderManage/index.vue"),
        meta: {
          title: '订单管理',
          icon: 'barcode',
        }
      },
      {
        path: '/orderDetail',
        name: 'OrderDetail',
        hidden: true,
        component: () => import("@/components/orderDetail/index.vue"),
        meta: {
          title: '订单详情',
          icon: 'tool',
        }
      },
      {
        path: '/receiptManage',
        name: 'ReceiptManage',
        component: () => import("@/components/receiptManage/index.vue"),
        meta: {
          title: '收据列表',
          icon: 'picture',
        }
      },
      {
        path: '/contractManage',
        name: 'ContractManage',
        component: () => import("@/components/contractManage/index.vue"),
        meta: {
          title: '合同列表',
          icon: 'read',
        }
      },
      {
        path: '/aftersaleManage',
        name: 'AftersaleManage',
        component: () => import("@/components/aftersaleManage/index.vue"),
        meta: {
          title: '售后管理',
          icon: 'paper-clip',
        }
      },
      {
        path: '/aftersaleFollow',
        name: 'AftersaleFollow',
        hidden: true,
        component: () => import("@/components/orderFollow/index.vue"),
        meta: {
          title: '售后跟进',
          icon: 'paper-clip',
        }
      },
      {
        path: '/mealManage',
        name: 'MealManage',
        component: () => import("@/components/mealManage/index.vue"),
        meta: {
          title: '套餐列表',
          icon: 'table',
        }
      },
      // {
      //   path: '/paywayManage',
      //   name: 'PaywayManage',
      //   component: () => import("@/components/paywayManage/index.vue"),
      //   meta: {
      //     title: '支付方式',
      //     icon: 'pay',
      //   }
      // },
      {
        path: '/staffManage',
        name: 'StaffManage',
        component: () => import("@/components/staffManage/index.vue"),
        meta: {
          title: '员工管理',
          icon: 'usergroup-add',
        }
      },
      // {
      //   path: '/permissionManage',
      //   name: 'PermissionManage',
      //   component: () => import("@/components/permissionManage/index.vue"),
      //   meta: {
      //     title: '权限管理',
      //     icon: 'windows',
      //   }
      // },
      {
        path: '/systemSettings',
        name: 'SystemSettings',
        component: () => import("@/components/systemSettings/index.vue"),
        meta: {
          title: '系统设置',
          icon: 'setting',
        }
      },
      {
        path: '/usercenter',
        name: 'Usercenter',
        redirect: '/usercenter/base',
        meta: {
          title: '个人中心',
          icon: 'profile',
        },
        component: () => import("@/components/usercenter/index.vue"),
        children: [{
            path: '/usercenter/base',
            name: 'Userbase',
            component: () => import("@/components/usercenter/base"),
            meta: {
              title: '基本资料',
              icon: 'tool',
            },
          },
          {
            path: '/usercenter/notify',
            name: 'Notify',
            component: () => import("@/components/usercenter/notify"),
            meta: {
              title: '通知',
              icon: 'notification',
            }
          },
        ]
      },

    ]
  },
  {
    path: '/404',
    component: () => import('@/components/exception/404.vue')
  },
  {
    path: '/403',
    component: () => import('@/components/exception/403.vue')
  },
  {
    path: '/500',
    component: () => import('@/components/exception/500.vue')
  }
]

export default _CONSTANTS_ROUTERS
