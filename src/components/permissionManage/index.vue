<template>
  <a-card :bordered="false" :style="{ height: '100%' }" :loading="loading">
    <a-row :gutter="48">
      <a-col :md="4" :offset="1">
        <a-list itemLayout="vertical" :dataSource="appRoleList">
          <a-list-item slot="renderItem" slot-scope="item, index" :key="index">
            <a-list-item-meta :style="{ marginBottom: '0' }">
              <span
                slot="description"
                style="text-align: center; display: block"
                >{{ item.describe }}</span
              >
              <a
                slot="title"
                style="text-align: center; display: block"
                @click="edit(item)"
                :class="{ current: currentRole === item.en }"
                >{{ item.name }}</a
              >
            </a-list-item-meta>
          </a-list-item>
        </a-list>
      </a-col>
      <a-col :md="18">
        <a-form style="border-left:1px solid #e8e8e8;padding-left:50px">
          <a-row
            :gutter="16"
            v-for="(permission, index) in permissions"
            :key="index"
          >
            <a-form-item :label="permission.name">
              <a-col :xl="20" :lg="24">
                <a-checkbox
                  v-if="permission.actionsOptions.length > 0"
                  :indeterminate="permission.indeterminate"
                  :checked="permission.checkedAll"
                  @change="onChangeCheckAll($event, permission)"
                >
                  全选
                </a-checkbox>
                <a-checkbox-group
                  :key="permission.name"
                  :options="permission.actionsOptions"
                  v-model="permission.selected"
                  @change="onChangeCheck(permission)"
                />
              </a-col>
            </a-form-item>
          </a-row>
          <a-form-item>
            <a-button type="primary" @click="setRolePermissions">保存</a-button>
          </a-form-item>
        </a-form>
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
import { mapState } from "vuex";
import {
  getPermissions,
  getRolePermissions,
  setRolePermissions
} from "@/myapi/system.js";

export default {
  name: "RoleList",
  components: {},
  computed: {
    ...mapState({
      appRoleList: state => state.appconfig.appRoleList,
      role: state => state.user.role,
      rolePermissions: state => state.permission.rolePermissions
    })
  },
  data() {
    return {
      form: this.$form.createForm(this),
      loading: false,
      roles: [],
      currentRole: "",
      permissions: []
    };
  },
  async created() {
    if (this.appRoleList.find(r => r.id === this.role).name === "管理员") {
      await this.initPermissions();
      this.edit(this.appRoleList[0]);
    } else {
      this.$router.push({ path: "/403" });
    }
  },
  // compute
  methods: {
    edit(record) {
      this.currentRole = record.en;
      let rolePermission = this.rolePermissions.find(rp => {
        return rp.roleEn == this.currentRole;
      });
      this.permissions.forEach(p => {
        p.selected = rolePermission[p.belong];
        p.checkedAll = p.selected.length === p.actionsOptions.length;
        p.indeterminate =
          !!p.selected.length && p.selected.length < p.actionsOptions.length;
      });
    },

    onChangeCheck(permission) {
      permission.indeterminate =
        !!permission.selected.length &&
        permission.selected.length < permission.actionsOptions.length;
      permission.checkedAll =
        permission.selected.length === permission.actionsOptions.length;
    },
    onChangeCheckAll(e, permission) {
      Object.assign(permission, {
        selected: e.target.checked
          ? permission.actionsOptions.map(obj => obj.value)
          : [],
        indeterminate: false,
        checkedAll: e.target.checked
      });
    },
    async initPermissions() {
      try {
        this.loading = true;
        // let [permissions, rolePermissions] = await Promise.all([
        //     getPermissions(),
        //     getRolePermissions()
        // ]);
        let permissions = await getPermissions();
        if (
          permissions.status == 200
          //  &&
          // rolePermissions.status == 200
        ) {
          this.permissions = permissions.data.map(permission => {
            permission.name = {
              customManage: "客户管理",
              orderManage: "订单管理",
              receiptManage: "收据列表",
              contractManage: "合同列表",
              aftersaleManage: "售后管理",
              mealManage: "套餐列表",
              staffManage: "员工管理"
            }[permission.belong];
            permission.checkedAll = false;
            permission.selected = [];
            permission.indeterminate = false;
            permission.actionsOptions = permission.children;
            return permission;
          });
          // this.rolePermissions = rolePermissions.data;
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false;
      }
    },
    loadPermissions() {
      getPermissions().then(res => {
        const result = res.data;
      });
    },
    //保存权限配置
    async setRolePermissions() {
      try {
        let ps = {};
        this.permissions.forEach(p => {
          ps[p.belong] = p.selected;
        });
        let result = await setRolePermissions({
          roleEn: this.currentRole,
          ...ps
        });
        this.$notification.success({
          message: "成功",
          description: "权限设置成功"
        });
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.current {
  color: #1890ff;
}
</style>
