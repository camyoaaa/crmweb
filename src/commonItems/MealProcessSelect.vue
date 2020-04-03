<template>
  <a-select :value="value" @change="onchange">
    <a-select-option v-for="p in processList" :key="p.value" :value="p.value">
      {{ p.label }}
    </a-select-option>
  </a-select>
</template>

<script>
export default {
  name:'MealProcessSelect',
  model: {
    prop: "value",
    event: "change"
  },
  props: ["value"],
  data() {
    return {
      processList: [
        { value: 1, label: "定金" },
        { value: 2, label: "中款" },
        { value: 3, label: "尾款" }
      ]
    };
  },
  methods: {
    onchange(select) {
      this.$emit("change", select);
    }
  }
};
</script>