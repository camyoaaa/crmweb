/**
 * 调用项目自身的接口
 */
import Vue from "vue";
import axios from "axios";
import store from "@/store";
import notification from "ant-design-vue/es/notification";
import {
  ACCESS_TOKEN
} from "@/store/mutation-types";

import {
  ServerIP
} from '@/config'

// 创建 axios 实例
const kaxios = axios.create({
  baseURL: ServerIP, // api base_url
  timeout: 6000 // 请求超时时间
});

const err = error => {
  if (error.response) {
    const data = error.response.data;
    const token = Vue.ls.get(ACCESS_TOKEN);
    if (error.response.status === 403) {
      notification.error({
        message: "Forbidden",
        description: data.message
      });
    }
    if (
      error.response.status === 401 &&
      !(data.result && data.result.isLogin)
    ) {
      notification.error({
        message: "Unauthorized",
        description: "Authorization verification failed"
      });
      if (token) {
        store.dispatch("Logout").then(() => {
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        });
      }
    }
  }
  return Promise.reject(error);
};

// request interceptor
kaxios.interceptors.request.use(config => {
  const token = Vue.ls.get(ACCESS_TOKEN);
  if (token) {
    config.headers["Authorization"] = token; // 让每个请求携带自定义 token 请根据实际情况自行修改
  }
  return config;
}, err);

// response interceptor
kaxios.interceptors.response.use(response => {
  const token = response.headers["authorization"];
  if (token) {
    store.commit("SET_TOKEN", token);
    Vue.ls.set(ACCESS_TOKEN, token, (response.data.user.rememberMe ? 7 : 1) * 24 * 60 * 60 * 1000); //7天免登录
  }
  return response.data;
}, err);

export default kaxios;
