<template>
  <a-select
    :value="value"
    @change="selectChange"
    buttonStyle="solid"
    style="width:100%"
  >
    <a-select-option
      v-for="(ra, index) in radios"
      :value="ra.oid"
      :key="index"
      >{{ ra.name }}</a-select-option
    >
  </a-select>
</template>

<script>
import { getList } from "@/myapi/customfrom.js";
export default {
  name: "CustomFromSelect",
  model: {
    prop: "value",
    event: "change"
  },
  props: {
    value: Number,
    preselect: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      radios: []
    };
  },
  methods: {
    selectChange(select) {
      this.$emit("change", select);
    },
    async getOriginList() {
      try {
        let res = await getList({ pageNo: 1, pageSize: 500 });
        this.radios = res.result.data;
        if (this.preselect && !this.value) {
          this.$emit("change", this.radios[0].oid);
        }
      } catch (error) {
        console.log(error);
      }
    }
  },
  created() {
    this.getOriginList();
  }
};
</script>
