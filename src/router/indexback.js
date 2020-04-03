import Vue from "vue";
import Router from "vue-router";
import HelloWorld from "@/components/HelloWorld";

import constantRoutes from './constantRoutes.js'

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [...constantRoutes {
      path: "/auth",
      name: "Auth",
      component: () => import("@/components/user/auth.vue")
    },
    {
      path: "/",
      redirect: "/workplace",
      name: "Home",
      component: () => import("@/components/Layout.vue"),
      children: [{
          path: "/staff",
          name: "Staff",
          component: () => import("@/components/staffalloc/index.vue")
        },
        {
          path: "/receptcustom",
          name: "ReceptCustom",
          component: () => import("@/components/receptcustom/index.vue")
        },
        {
          path: "/meal",
          name: "Meal",
          component: () => import("@/components/meal/index.vue")
        },
        {
          path: "/workplace",
          name: "Workplace",
          component: () => import("@/components/workplace/index1.vue")
        },
        {
          path: "/config",
          name: "Config",
          redirect: '/config/department',
          component: () => import("@/components/config/index.vue"),
          children: [{
              path: '/config/department',
              name: 'Department',
              component: () => import("@/components/config/department/index.vue"),
              meta: {
                title: '部门设置'
              }
            },
            {
              path: '/config/permission',
              name: 'Menupermission',
              component: () => import("@/components/config/permission/index.vue"),
              meta: {
                title: '权限管理'
              }
            },
            {
              path: '/config/mealsetting',
              name: 'Mealsetting',
              component: () => import("@/components/config/mealsetting/index.vue"),
              meta: {
                title: '套餐设置'
              }
            },
            {
              path: '/config/business',
              name: 'Business',
              component: () => import("@/components/config/business/index.vue"),
              meta: {
                title: '业务设置'
              }
            }
          ]
        }
      ]
    }
  ]
});
