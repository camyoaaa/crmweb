//静态路由

const _CONSTANTS_ROUTERS = [{
    path: "/auth",
    name: "Auth",
    component: () => import("@/components/user/auth.vue")
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
