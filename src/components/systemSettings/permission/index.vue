<template>
  <div>
    <div class="table-operator" style="margin-bottom:18px">
      <a-button type="primary" icon="plus" @click="$refs.createModal.add()"
        >新增菜单</a-button
      >
    </div>
    <a-table
      ref="table"
      size="default"
      rowKey="mid"
      :columns="columns"
      :dataSource="data"
      :pagination="false"
    >
      <span slot="enableDepartmentPost" slot-scope="text, record">
        <org-tree-select
          v-if="record.editing"
          :value="{
            ids: record.enableDepartmentPost,
            labels: record.enableDepartmentPostTags.split(',')
          }"
          @change="
            ({ ids, labels }) => {
              record.enableDepartmentPost = ids;
              record.enableDepartmentPostTags = labels.join(',');
            }
          "
        ></org-tree-select>
        <div v-else>
          <template
            v-if="
              record.enableDepartmentPostTags.split(',').filter(e => e).length >
                0
            "
          >
            <a-tag
              v-for="(t, index) in record.enableDepartmentPostTags.split(',')"
              :key="index"
            >
              {{ t }}
            </a-tag>
          </template>
          <a-tag v-else color="blue">
            仅管理员
          </a-tag>
        </div>
      </span>
      <span slot="name" slot-scope="text, record">
        <span v-if="record.editing" style="display:flex;align-items:center">
          <icon-selector
            :value="record.icon"
            @change="value => (record.icon = value)"
          ></icon-selector>
          <a-input
            style="flex:1"
            :value="record.name"
            @change="e => (record.name = e.target.value)"
          ></a-input>
        </span>
        <span v-else> <a-icon :type="record.icon" /> {{ text }} </span>
      </span>
      <span slot="showside" slot-scope="text, record">
        {{ text ? "可见" : "不可见" }}
        <!-- <a-input v-if="record.editing" :value="record.path" @change="e=>record.path = e.target.value"></a-input>
                <span v-else>{{text}}</span> -->
      </span>
      <span slot="path" slot-scope="text, record">
        <a-input
          v-if="record.editing"
          :value="record.path"
          @change="e => (record.path = e.target.value)"
        ></a-input>
        <span v-else>{{ text }}</span>
      </span>
      <span slot="redirect" slot-scope="text, record">
        <a-input
          v-if="record.editing"
          :value="record.redirect"
          @change="e => (record.redirect = e.target.value)"
        ></a-input>
        <span v-else>{{ text }}</span>
      </span>
      <span slot="content" slot-scope="text, record">
        <a-input
          v-if="record.editing"
          :value="record.content"
          @change="e => (record.content = e.target.value)"
        ></a-input>
        <span v-else>{{ text }}</span>
      </span>
      <span slot="actions" slot-scope="text, record">
        <template>
          <a v-if="!record.editing" @click="record.editing = true">编辑</a>
          <a v-else @click="updateMenu(record)">保存</a>
          <a-divider type="vertical" />
          <a-popconfirm
            title="确定删除这个菜单及其子菜单吗"
            @confirm="deleteMenu(record)"
            @cancel="() => {}"
            okText="Yes"
            cancelText="No"
          >
            <a>删除</a>
          </a-popconfirm>
        </template>
      </span>
    </a-table>
    <create-form ref="createModal" @ok="handleOk" />
  </div>
</template>

<script>
import CreateForm from "./CreateForm";

import { getMenuTree, deleteMenu, updateMenu } from "@/myapi/menu.js";

export default {
  name: "department",
  components: {  CreateForm },
  methods: {
    handleOk() {
      this.getMenuTreeList();
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
    },
    async getMenuTreeList() {
      try {
        let result = await getMenuTree();
        this.data = this.buildTree(result.tree);
      } catch (error) {}
    },
    async deleteMenu(record) {
      try {
        // let mids = [record.mid, ...record.children.map(r => r.mid)];
        let mids = this.getMenuchildrenId(record);
        console.log(mids);
        let result = await deleteMenu({ mids });
        this.$notification.success({
          $message: "成功",
          description: "菜单删除成功"
        });
        this.getMenuTreeList();
      } catch (error) {
        console.log(error);
      }
    },
    getMenuchildrenId(menu) {
      let pipe = [menu];
      let ids = [];
      while (pipe.length > 0) {
        let pop = pipe.pop();
        ids.push(pop.mid);
        pipe.push(...(pop.children || []));
      }
      return ids;
    },
    async updateMenu(record) {
      try {
        let result = await updateMenu(record);
        result.status == 200 &&
          this.$notification.success({
            message: "菜单更新成功"
          });
        this.getMenuTreeList();
      } catch (error) {
        console.log(error);
      }
    },
    buildTree(treeData) {
      let parentstore = {};
      let childstore = {};
      treeData.forEach(element => {
        element = {
          ...element,
          title: element.name,
          value: element.mid,
          key: element.mid,
          editing: false
        };
        childstore[element.mid] = element;
        if (Array.isArray(parentstore[element.pid])) {
          parentstore[element.pid].push(element);
        } else {
          parentstore[element.pid] = [element];
        }
      });

      for (let key in childstore) {
        childstore[key].children = parentstore[childstore[key].mid];
      }
      return childstore[100000].children;
    }
  },
  created() {
    this.getMenuTreeList();
  },
  data() {
    return {
      pagination: {
        pageSizeOptions: ["10", "20", "30", "40", "50"],
        showQuickJumper: true,
        showTotal: total => `共 ${total} 条数据`
      },
      data: [],
      selectedRowKeys: [],
      selectedRows: [],
      options: {
        alert: {
          show: true,
          clear: () => {
            this.selectedRowKeys = [];
          }
        },
        rowSelection: {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onSelectChange
        }
      },
      columns: [
        {
          title: "菜单名称",
          dataIndex: "name",
          scopedSlots: { customRender: "name" }
        },
        {
          title: "是否可见",
          dataIndex: "showside",
          scopedSlots: { customRender: "showside" }
        },
        {
          title: "菜单路径",
          dataIndex: "path",
          scopedSlots: { customRender: "path" }
        },
        {
          title: "重定向子菜单",
          dataIndex: "redirect",
          scopedSlots: { customRender: "redirect" }
        },
        {
          title: "可见部门及岗位",
          dataIndex: "enableDepartmentPost",
          scopedSlots: { customRender: "enableDepartmentPost" }
        },
        {
          title: "菜单内容",
          dataIndex: "content",
          scopedSlots: { customRender: "content" }
        },
        {
          title: "操作",
          dataIndex: "action",
          width: "150px",
          scopedSlots: { customRender: "actions" }
        }
      ]
    };
  }
};
</script>

<style lang="less" scoped></style>
