<template>
  <a-drawer
    placement="left"
    :width="800"
    @close="onClose"
    :title="`${custom.name}- 订单管理`"
    :visible="visible"
    :destroyOnClose="true"
  >
    <div>
      <a-descriptions title="订单详情">
        <a-descriptions-item label="订购套餐">Zhou Maomao</a-descriptions-item>
        <a-descriptions-item label="订单金额">Zhou Maomao</a-descriptions-item>
        <a-descriptions-item label="创建人">1810000000</a-descriptions-item>
        <a-descriptions-item label="创建时间"
          >Hangzhou, Zhejiang</a-descriptions-item
        >
        <a-descriptions-item label="订单备注">empty</a-descriptions-item>
      </a-descriptions>
      <a-button type="dashed" icon="delete" block>删除订单</a-button>
      <a-form v-if="addingreceipt">
        <a-divider></a-divider>
        <a-row :gutter="48">
          <a-col :span="12">
            <a-form-item label="收款款项">
              <meal-process-select v-model="receipt.payment" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="收款金额">
              <a-input-number v-model="receipt.money" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="收款方式">
              <pay-way v-model="receipt.payway" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="收款账号">
              <a-input v-model="receipt.account" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="收款截图">
              <pay-shot v-model="receipt.shot" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <a-button
        type="primary"
        icon="plus"
        block
        style="margin-top:20px"
        @click="addingreceipt = true"
        >{{ addingreceipt ? "确认添加收款" : "添加收款" }}</a-button
      >

      <a-form v-if="addingcontract">
        <a-divider></a-divider>
        <a-row :gutter="48">
          <a-col :span="12">
            <a-form-item label="签约方式">
              <a-select v-model="contract.way">
                <a-select-option :value="1">
                  法大大电子合同
                </a-select-option>
                <a-select-option :value="2">
                  现场签约
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="合同链接">
              <a-input v-model="contract.url" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="合同截图">
              <pay-shot v-model="contract.shot" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>

      <a-button
        type="primary"
        icon="plus"
        block
        style="margin-top:20px"
        @click="addingcontract = true"
        >{{ addingcontract ? "确认添加合同" : "添加合同" }}</a-button
      >
    </div>
  </a-drawer>
</template>

<script>
import { getOrderList, addPayreceipt, addContract } from "@/myapi/order.js";
export default {
  data() {
    return {
      visible: false,
      custom: {},
      addingreceipt: false,
      receipt: {},
      addingcontract: false,
      contract: {}
    };
  },
  methods: {
    open(custom) {
      this.custom = custom;
      this.visible = true;
    },
    onClose() {
      this.visible = false;
    }
  }
};
</script>
