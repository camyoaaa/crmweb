import Vue from "vue";

import {
  ACCESS_TOKEN
} from "@/store/mutation-types";

import {
  login,
  getInfo,
  logout
} from "@/myapi/auth.js";

class USERSTATE {
  constructor() {
    this.userid = "";
    this.account = ""; //员工编号
    this.name = ""; //员工名称
    this.token = ""; //token
    this.avatar = ""; //头像
    this.phone = ""; //电话
    this.sex = ""; //性别
    this.qq = ""; //qq
    this.wx = ""; //wx
    this.email = ""; //email
    this.password = ""; //password
    this.phone = ""; //手机
    this.post = ""; //微信
    this.role = ""; //角色
    this.status = ""; //状态
    this.lastLoginTime = ""; //上次登陆时间
    this.lastLoginIP = ""; //上次登录ip
  }
}

const user = {
  state: new USERSTATE(),
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_USERSTATE: (state, payload) => {
      for (const key in state) {
        state[key] = payload[key];
      }
    }
  },

  actions: {
    // 登录
    Login({

      commit
    }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo)
          .then(response => {
            commit("SET_USERSTATE", response.user);
            resolve(response);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    //获取用户信息
    GetInfo({
      state,
      commit
    }) {
      return new Promise((resolve, reject) => {
        getInfo()
          .then(response => {
            commit("SET_USERSTATE", response.user);
            console.log('state', state);
            resolve(response.user);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    // 登出
    Logout({
      commit,
      state
    }) {
      return new Promise(resolve => {
        logout(state.account)
          .then(() => {
            window.location.reload();
            resolve();
          })
          .catch(() => {
            resolve();
          })
          .finally(() => {
            commit("SET_USERSTATE", new USERSTATE());
            Vue.ls.remove(ACCESS_TOKEN);
          });
      });
    }
  }
};

export default user;
