import {
  getRolePermissions
} from '@/myapi/system'

class PERMISSIONSTATE {
  constructor() {
    this.rolePermissions = [];
  }
}

const rolePermission = {
  state: new PERMISSIONSTATE(),
  mutations: {
    SET_PERMISSIONSTATE: (state, payload) => {
      state.rolePermissions = payload;
    }
  },
  actions: {
    //获取系统配置信息
    GetRolePermissions({
      commit
    }) {
      return new Promise((resolve, reject) => {
        getRolePermissions()
          .then(response => {
            commit("SET_PERMISSIONSTATE", response.data);
            resolve(response.data);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
  }
};

export default rolePermission;
