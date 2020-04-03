<template>
  <div style="display:flex;justify-content: space-between;align-items:center">
    <a-input-number
      :min="0"
      :max="23"
      :value="value[0]"
      style=" flex: 1"
      :size="size"
      @change="onstartChange"
    />
    <span style="width:30px;text-align:center;line-height:">~</span>
    <a-input-number
      :min="0"
      :max="24"
      :value="value[1]"
      style=" flex: 1"
      :size="size"
      @change="onendChange"
    />
  </div>
</template>

<script>
import moment from "moment";
export default {
  name: "WorkIn",
  model: {
    prop: "value",
    event: "change"
  },
  props: {
    value: {
      type: Array,
      default: () => [9, 18]
    },
    size: {
      type: String,
      default: "default"
    }
  },
  methods: {
    onstartChange(start) {
      this.$emit("change", [start, this.value[1]]);
    },
    onendChange(end) {
      this.$emit("change", [this.value[0], end]);
    }
  }
};
</script>
