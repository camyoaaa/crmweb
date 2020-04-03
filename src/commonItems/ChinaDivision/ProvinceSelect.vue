<template>
  <a-select @select="onselect" :value="value" style="width:100%" showSearch>
    <a-select-option
      v-for="(province, index) in provinceList"
      :key="index"
      :value="province"
      :label="province"
    >
      {{ province }}
    </a-select-option>
  </a-select>
</template>

<script>
import pca from "./pca.json";
export default {
  name: "ProvinceSelect",
  model: {
    prop: "value",
    event: "change"
  },
  props: ["value"],
  data() {
    return {
      provinceList: Object.keys(pca)
    };
  },
  methods: {
    onselect(select) {
      this.$emit("change", select);
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    }
  }
};
</script>

<style lang="less" scoped></style>
