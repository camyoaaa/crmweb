<template>
  <a-select :value="value" @change="onSelectChange" allowClear>
    <a-select-option
      v-for="(status, index) in statusList"
      :key="index"
      :value="status.sid"
    >
      <a-badge :color="status.color" :text="status.name" />
    </a-select-option>
  </a-select>
</template>

<script>
import { getList } from "@/myapi/customstatus.js";
export default {
  name: "CustomStatusSelect",
  model: {
    prop: "value",
    event: "change"
  },
  props: {
    value: Number
  },
  data() {
    return {
      statusList: []
    };
  },
  created() {
    this.getStatus();
  },
  methods: {
    onSelectChange(select, labels) {
      let selected = this.statusList.find(s => s.sid == select) || {};
      this.$emit("change", select);
    },
    async getStatus() {
      try {
        let result = await getList({ pageNo: 1, pageSize: 500 });
        this.statusList = result.result.data;
      } catch (error) {}
    }
  }
};
</script>
