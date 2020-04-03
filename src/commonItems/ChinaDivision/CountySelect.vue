<template>
  <a-select @select="onselect" :value="value" style="width:100%" showSearch>
    <a-select-option
      v-for="(county, index) in countyList"
      :key="index"
      :value="county"
      :label="county"
    >
      {{ county }}
    </a-select-option>
  </a-select>
</template>

<script>
import pca from "./pca.json";
export default {
  name: "CountySelect",
  model: {
    prop: "value",
    event: "change"
  },
  props: ["value", "province", "city"],
  computed: {
    countyList() {
      if (this.province && this.city) {
        return pca[this.province][this.city];
      } else {
        return [];
      }
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
