<template>
  <a-select @select="onselect" :value="value" style="width:100%" showSearch>
    <a-select-option
      v-for="(city, index) in cityList"
      :key="index"
      :value="city"
      :label="city"
    >
      {{ city }}
    </a-select-option>
  </a-select>
</template>

<script>
import pca from "./pca.json";
export default {
  name: "CitySelect",
  model: {
    prop: "value",
    event: "change"
  },
  props: ["value", "province"],
  computed: {
    cityList() {
      return Object.keys(pca[this.province] || {});
    }
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
