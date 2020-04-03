<template>
  <a-card>
    <a-menu
      style="margin-top:10px;max-height:600px;overflow-y:auto;overflow-x:hidden"
      mode="inline"
      :inlineIndent="100"
      :selectedKeys="selectedKeys"
      :openKeys="openKeys"
      @openChange="openChange"
      @click="onMenClick"
      class="my-tree"
    >
      <template v-for="menu1 in menuList">
        <a-menu-item
          v-if="!Array.isArray(menu1.children) || menu1.children.length == 0"
          :key="menu1._id"
        >
          <div style="display:flex;justify-content:space-between">
            <div>
              <a-icon :type="menu1.icon" v-if="menu1.icon" />
              <span>{{ menu1.name }}</span>
              <span style="margin-left:20px;color:#ccc" v-if="menu1.content">{{
                menu1.content
              }}</span>
            </div>
            <div style="text-align:right;margin-right:-10px">
              <a-icon
                type="plus"
                class="action"
                @click="() => openDepartmentModal(menu1)"
              />
              <a-popconfirm
                title="确定删除这个部门吗"
                @confirm="deleteDepartment(menu1)"
                @cancel="() => {}"
                okText="Yes"
                cancelText="No"
              >
                <a-icon type="minus" class="action" />
              </a-popconfirm>
            </div>
          </div>
        </a-menu-item>
        <a-sub-menu v-else :key="menu1._id">
          <span slot="title">
            <div style="display:flex;justify-content:space-between">
              <div>
                <a-icon :type="menu1.icon" v-if="menu1.icon" />
                <span>{{ menu1.name }}</span>
                <span
                  style="margin-left:20px;color:#ccc"
                  v-if="menu1.content"
                  >{{ menu1.content }}</span
                >
              </div>
              <div style="text-align:right;" @click="isActionClick = true">
                <a-icon
                  type="plus"
                  class="action"
                  @click="() => openDepartmentModal(menu1)"
                />
                <a-popconfirm
                  title="确定删除这个部门吗"
                  @confirm="deleteDepartment(menu1)"
                  @cancel="() => {}"
                  okText="Yes"
                  cancelText="No"
                >
                  <a-icon type="minus" class="action" />
                </a-popconfirm>
              </div>
            </div>
          </span>
          <a-menu-item v-for="menu2 in menu1.children" :key="menu2._id">
            <div style="display:flex;justify-content:space-between">
              <div>
                <a-icon :type="menu2.icon || 'team'" />
                <span>{{ menu2.name }}</span>
                <a v-if="menu2.superpid">(上属:{{ menu2.superpname }})</a>
                <span
                  style="margin-left:20px;color:#ccc"
                  v-if="menu2.content"
                  >{{ menu2.content }}</span
                >
              </div>
              <div>
                <a-popconfirm
                  title="确定删除这个岗位吗"
                  @confirm="deletePost(menu2)"
                  @cancel="() => {}"
                  okText="Yes"
                  cancelText="No"
                >
                  <a-icon type="minus" class="action" />
                </a-popconfirm>
              </div>
            </div>
          </a-menu-item>
        </a-sub-menu>
      </template>
    </a-menu>

    <a-button
      style="margin-top:10px"
      type="dashed"
      block
      icon="plus"
      @click="() => this.$refs.deparment.open()"
      @ok="getDepartmentTree"
      >新增部门</a-button
    >

    <department-modal
      ref="deparment"
      @ok="getDepartmentTree"
    ></department-modal>
    <post-modal ref="post" @ok="getDepartmentTree"></post-modal>
  </a-card>
</template>

<script>
import departmentModal from "./departmentModal";
import postModal from "./postModal";

import {
  deleteDepartment,
  deletePost,
  getDepartmentTree
} from "@/myapi/department.js";
export default {
  name: "departmentMenu",
  components: { departmentModal, postModal },
  methods: {
    async getDepartmentTree() {
      try {
        let result = await getDepartmentTree();
        this.menuList = result.tree;
        this.openKeys = [];
        this.menuList.forEach(element => {
          if (element.children.length > 0) {
            this.openKeys.push(element._id);
          }
        });
      } catch (error) {}
    },
    onMenClick(value) {
      this.selectedKeys = [value.key];
    },
    openChange(value) {
      if (this.isActionClick) {
        this.isActionClick = false;
        return;
      } else {
        this.openKeys = value;
      }
    },
    openDepartmentModal(department) {
      this.$refs.post.open({ ...department, id: department.did });
    },
    async deleteDepartment(department) {
      try {
        let result = await deleteDepartment([department.did]);
        let pids = department.children.map(i => i.pid);
        let result1 = await deletePost(pids);
        this.getDepartmentTree();
      } catch (error) {}
    },
    async deletePost(post) {
      console.log("deletePost", post);
      try {
        let result = await deletePost([post.pid]);
        this.getDepartmentTree();
      } catch (error) {
        console.log(error);
      }
    }
  },
  created() {
    this.getDepartmentTree();
  },
  data() {
    return {
      isActionClick: false,
      selectedKeys: [],
      openKeys: [],
      menuList: []
    };
  }
};
</script>

<style lang="less" scoped>
.my-tree {
  /deep/ .ant-menu-item-group-title {
    // position: relative;
    &:hover {
      .action {
        display: inline;
      }
    }
  }

  /deep/ .ant-menu-item,
  .ant-menu-submenu-title {
    &:hover {
      .action {
        display: inline;
      }
    }
  }

  /deep/ .action {
    display: none;
    &:hover {
      transform: scale(1.2);
      transition: 0.5s all;
    }
  }
}
</style>
