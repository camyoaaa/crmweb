<template>
  <a-select
    :size="size"
    :value="value"
    @change="onSelect"
    optionLabelProp="label"
    style="width:100%"
    :placeholder="placeholder"
    allowClear
  >
    <a-select-option
      v-for="staff in staffList"
      :key="staff.account"
      :value="staff.account"
      :label="staff.name"
    >
      <div style="display:flex;justify-content:space-between">
        <div>
          <a-badge v-if="onduty" :status="getStaffStatus(staff)" />
          <span>{{ staff.name }}</span>
          <span v-if="onduty">
            {{ staff.todayRecepted || 0 }}
          </span>
        </div>
        <span style="font-size:12px" v-if="onduty">
          <a-tooltip placement="right" :title="staff.lastTaskTime | dateformat">
            {{ $moment(staff.lastTaskTime).fromNow() }}
          </a-tooltip>
        </span>
      </div>
    </a-select-option>
  </a-select>
</template>

<script>
import { getFilterStaff, getList } from "@/myapi/staff.js";

export default {
  name: "StaffSelect",
  model: {
    prop: "value",
    event: "change"
  },
  props: {
    value: Number,
    onduty: {
      type: Boolean,
      default: false
    },
    did: Number,
    pid: Number,
    querypchilren: {
      //查询该岗位下的下属岗位
      type: Boolean,
      default: true
    },
    preselect: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: "请选择员工"
    },
    size: {
      type: String,
      default: "default"
    }
  },
  data() {
    return {
      staffList: []
    };
  },
  methods: {
    getStaffStatus(staff) {
      const { todayRecepted, daily } = staff;
      const threePart = Math.ceil(daily / 3);

      if (todayRecepted < threePart) {
        return "success";
      } else if (todayRecepted < threePart * 2) {
        return "warning";
      } else {
        return "error";
      }
    },
    onSelect(selects) {
      this.$emit("change", selects);
    },
    async initOptions() {
      try {
        let result = await getFilterStaff({
          did: this.did,
          pid: this.pid,
          querypchilren: this.querypchilren,
          onduty: this.onduty
        });
        if (
          result.status == 200 &&
          result.result &&
          Array.isArray(result.result.data)
        ) {
          this.staffList = result.result.data;
          if (this.preselect && !this.value) {
            this.$emit("change", this.staffList[0].account);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  },
  created() {
    this.initOptions();
  }
};
</script>

<style lang="less" scoped></style>
