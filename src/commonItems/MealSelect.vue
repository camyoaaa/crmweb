<template>
  <a-select :value="value" @change="onselect" allowClear>
    <a-select-option
      v-for="(meal, index) in mealList"
      :key="index"
      :value="meal.mid"
    >
      {{ meal.name }}
    </a-select-option>
  </a-select>
</template>

<script>
import { getList } from "@/myapi/meal.js";
export default {
  name: "MealSelect",
  model: {
    prop: "value",
    event: "change"
  },
  props: ["value"],
  data() {
    return {
      mealList: []
    };
  },
  created() {
    console.log("created");
    this.getList();
  },
  methods: {
    async getList() {
      try {
        let result = await getList({ pageNo: 1, pageSize: 500 });
        console.log("result", result);
        this.mealList = result.result.data;
      } catch (error) {
        console.log(error);
      }
    },
    onselect(select) {
      this.$emit("change", select);
      this.$emit(
        "contentchange",
        this.mealList.find(m => m.mid == select)
      );
    }
  }
};
</script>
