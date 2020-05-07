import {
  getAppConfig
} from '@/myapi/system'

class CONFSTATE {
  constructor() {
    this.gotAppconfig1 = false;
    this.appRoleList = []; //角色列表
    this.customStatusList = []; //客户状态列表
    this.staffStatusList = []; //员工状态
    this.reviewStatusList = []; //审核状态列表
    this.shopStatusList = []; //店铺营业状态
    this.teachStatusList = []; //教学阶段
    this.activeStatusList = []; //活动状态
  }
}

const appconfig = {
  state: new CONFSTATE(),
  mutations: {
    SET_CONFSTATE: (state, payload) => {
      state.gotAppconfig1 = true;
      console.log('state.gotAppconfig1', state.gotAppconfig1);
      for (const key in state) {
        state[key] = payload[key];
      }
    },
    SET_gotAppconfig: (state) => {
      state.gotAppconfig1 = true;
    }
  },
  actions: {
    //获取系统配置信息
    GetAppconfig({
      state,
      commit
    }) {
      return new Promise((resolve, reject) => {
        getAppConfig()
          .then(response => {
            commit('SET_gotAppconfig');
            commit("SET_CONFSTATE", response.data);
            console.log('state', state);
            resolve(response.data);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
  }
};

export default appconfig;
