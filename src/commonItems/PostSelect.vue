<template>
  <a-select :value="value.id" @change="onchange">
    <a-select-option v-for="post in postList" :key="post.pid" :value="post.pid">
      <a-icon type="team" /> {{ post.name }}
    </a-select-option>
  </a-select>
</template>

<script>
import { getPostList } from "@/myapi/department.js";
export default {
  name:'PostSelect',
  model: {
    prop: "value",
    event: "change"
  },
  props: {
    value: Object,
    departmentid: Number
  },
  data() {
    return {
      postList: []
    };
  },
  created() {
    this.getPostList();
  },
  methods: {
    async getPostList() {
      try {
        console.log("this.departmentid", this.departmentid);
        let result = await getPostList(this.departmentid);
        this.postList = result.data;
      } catch (error) {}
    },
    onchange(postid) {
      console.log("postid", postid);
      this.$emit("change", {
        id: postid,
        name: (this.postList.find(p => p.pid == postid) || {}).name
      });
    }
  }
};
</script>

<style lang="less" scoped></style>
