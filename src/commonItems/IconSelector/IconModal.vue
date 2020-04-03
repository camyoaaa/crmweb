<template>
  <span>
    <a-button :icon="value" @click="open">{{
      value ? "" : "选择图标"
    }}</a-button>
    <a-modal
      title="选择图标"
      :footer="null"
      :visible="visible"
      @cancel="handleCancel"
      width="640px"
    >
      <icon-selector :value="value" @change="onIconChange"></icon-selector>
    </a-modal>
  </span>
</template>

<script>
import iconSelector from "./IconSelector";
export default {
  name: "IconSelector",
  components: { iconSelector },
  model: {
    prop: "value",
    event: "change"
  },
  props: {
    value: String
  },
  data() {
    return {
      visible: false,
      selecticon: ""
    };
  },
  methods: {
    open() {
      this.visible = true;
    },
    onIconChange(value) {
      this.selecticon = value;
      this.$emit("change", this.selecticon);
      this.handleCancel();
    },
    handleCancel() {
      this.visible = false;
      this.selecticon = "";
    }
  }
};
</script>
