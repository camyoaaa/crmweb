<template>
  <a-select
    :value="value"
    @change="onSelectChange"
    allowClear
    :placeholder="placeholder"
    :disabled="disabled"
    :size="size"
  >
    <a-select-option
      v-for="(status, index) in statusList"
      :key="index"
      :value="status.id"
      :disabled="disabledDeal && status.name === '已成交'"
    >
      <a-badge
        :color="status.color"
        :text="
          disabledDeal && status.name === '已成交'
            ? `${status.name}/签单后自动更新`
            : status.name
        "
      />
    </a-select-option>
  </a-select>
</template>

<script>
import { mapState } from "vuex";
import { getList } from "@/myapi/customstatus.js";
export default {
  name: "CustomStatusSelect",
  model: {
    prop: "value",
    event: "change"
  },
  props: {
    value: Number,
    placeholder: {
      type: String,
      default: "请选择客户状态"
    },
    disabledDeal: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: "default"
    }
  },
  computed: {
    ...mapState({
      statusList: state => state.appconfig.customStatusList
    })
  },
  created() {
    // this.getStatus();
  },
  methods: {
    onSelectChange(select, labels) {
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
