<template>
  <a-tree-select
    :size="size"
    style="width: 100%"
    placeholder="请选择部门及岗位"
    :treeData="treeData"
    allowClear
    @change="onChange"
    :value="value.ids"
    :treeCheckable="!singleSelect"
    :showCheckedStrategy="SHOW_PARENT"
  />
</template>

<script>
import { getDepartmentTree } from "@/myapi/department.js";
export default {
  name: "OrgTreeSelect",
  model: {
    porp: "value",
    event: "change"
  },
  props: {
    value: {
      type: Object
    },
    size: {
      type: String,
      default: "default"
    },
    singleSelect: {
      //用于选择员工部门及岗位
      type: Boolean,
      default: false
    },
    preselect: {
      type: Boolean,
      default: false
    },
    changeOnSelect: {
      //当此项为 true 时，点选每级菜单选项值都会发生变化
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      SHOW_PARENT: "SHOW_PARENT",
      treeData: []
    };
  },
  created() {
    this.getTree();
  },
  methods: {
    async getTree() {
      try {
        let result = await getDepartmentTree();
        const ROOTKEY = "ROOT";
        let rootChildren = result.tree.map((d, index1) => {
          d.children = d.children.map((p, index2) => ({
            ...p,
            title: `${d.name}-${p.name}`,
            value: `${d.did}-${p.pid}`,
            key: `${ROOTKEY}-${index1}-${index2}`
          }));
          return {
            ...d,
            title: d.name,
            value: `${d.did}-all`,
            key: `${ROOTKEY}-${index1}`,
            selectable: this.changeOnSelect
          };
        });

        if (this.singleSelect) {
          this.treeData = rootChildren;
          if (this.preselect && !this.value.ids) {
            this.$emit("change", {
              ...this.value,
              ids: rootChildren[0].children[0].value,
              labels: rootChildren[0].children[0].title
            });
          }
        } else {
          this.treeData = [
            {
              title: "所有部门",
              value: ROOTKEY,
              key: ROOTKEY,
              children: rootChildren
            }
          ];
          if (this.preselect && this.value.ids.length == 0) {
            this.$emit("change", {
              ...this.value,
              ids: [ROOTKEY],
              labels: ["所有部门"]
            });
          }
        }
      } catch (error) {}
    },
    onChange(value, labels, value3) {
      console.log(value, labels);
      this.$emit("change", {
        ...this.value,
        ids: value,
        labels: this.singleSelect ? labels[0] : labels
      });
    }
  }
};
</script>