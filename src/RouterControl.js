import Vue from "vue";
import router from "./router";
import store from "./store";

import NProgress from "nprogress"; // progress bar
import 'nprogress/nprogress.css'
import notification from "ant-design-vue/es/notification";
import {
  ACCESS_TOKEN
} from "@/store/mutation-types";

import {
  setDocumentTitle
} from '@/commonFunc'

import {
  ProjectName
} from '@/config'

NProgress.configure({
  showSpinner: true
}); // NProgress Configuration

const whiteList = ["Auth"]; // 不需要权限的白名单

const defaultRoutePath = "/workplace"; //默认路由

//路由权限判断

router.beforeEach(async (to, from, next) => {

  NProgress.start(); // start progress bar

  // 1  设置网页标题
  if (to.meta && typeof to.meta.title !== "undefined") {
    setDocumentTitle(`${to.meta.title} - ${ProjectName}`);
  }
  console.log(to, from, Vue.ls.get(ACCESS_TOKEN));
  if (Vue.ls.get(ACCESS_TOKEN)) { //有用户认证token
    if (to.path === "/auth") { //如果进入的是登录页
      next({
        path: defaultRoutePath
      });
      NProgress.done();
    } else {
      try {
        if (!store.getters.account) { //如果用户没有获取信息
          await store.dispatch('GetInfo')
        }
        if (store.state.appconfig.appRoleList.length === 0) { //如果没有获取系统配置信息

          await store.dispatch('GetAppconfig');
        }
        if (store.state.permission.rolePermissions.length === 0) { //如果没有获取系统配置信息
          console.log('**************************');
          await store.dispatch('GetRolePermissions');
        }

        next();

        const redirect = decodeURIComponent(from.query.redirect || to.path);
        console.log('redirect', to.path, redirect);
        // if (to.path === redirect) {
        //   // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
        //   next({
        //     ...to,
        //     replace: true
        //   });
        // } else {
        //   // 跳转到目的路由
        //   next({
        //     path: redirect
        //   });
        // }
      } catch (error) {
        console.log('***********************', error);
        notification.error({
          message: "错误",
          description: `请求${error.message == 'usererror'?'用户':'菜单'}信息失败，请重试`
        });
        store.dispatch("Logout").then(() => {
          next({
            path: "/auth",
            query: {
              redirect: to.fullPath
            }
          });
        }).catch((error) => {
          console.log(error);
        });
      }
    }
  } else {
    if (whiteList.includes(to.name)) {
      // 在免登录白名单，直接进入
      next();
    } else {
      next({
        path: "/auth",
        query: {
          redirect: to.fullPath
        }
      });
      NProgress.done(); // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
});

router.afterEach(() => {
  NProgress.done(); // finish progress bar
});
