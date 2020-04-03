<template>
  <a-drawer
    placement="left"
    :title="customInfo.name"
    :width="800"
    @close="onClose"
    :visible="visible"
    :destroyOnClose="true"
  >
    <a-collapse defaultActiveKey="3">
      <a-collapse-panel header="新建订单" key="3">
        <a-form>
          <a-row :gutter="48">
            <a-col :span="12">
              <a-form-item label="选择套餐" required>
                <meal-select v-model="orderInfo.mid"></meal-select>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="套餐阶段" required>
                <meal-process-select
                  v-model="orderInfo.mealProcess"
                ></meal-process-select>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="付款金额" required>
                <a-input-number
                  style="width:100%"
                  v-model="orderInfo.paymoney"
                ></a-input-number>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="付款方式" required>
                <pay-way v-model="orderInfo.payway" />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="付款截图" required>
                <pay-shot v-model="orderInfo.payshot"></pay-shot>
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="备注">
                <a-input
                  type="textarea"
                  :rows="4"
                  v-model="orderInfo.remark"
                ></a-input>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24">
              <a-button
                type="primary"
                block
                icon="highlight"
                size="large"
                @click="submitOrder"
                >提交</a-button
              >
            </a-col>
          </a-row>
        </a-form>
      </a-collapse-panel>
      <a-collapse-panel v-for="order in orderHistoryList" :key="order.oid">
        <span slot="header">
          {{ order.mealInfo.name }}
          <span style="color:#ccc">{{
            $moment(order.createTime).fromNow()
          }}</span>
        </span>
        <span slot="extra">
          {{ order.createTime | dateformat }}
        </span>

        <a-descriptions size="default" layout="vertical" :column="2">
          <a-descriptions-item label="套餐">{{
            order.mealInfo.name
          }}</a-descriptions-item>
          <a-descriptions-item label="套餐阶段">
            {{
              order.mealProcess == 1
                ? "定金"
                : order.mealProcess == 2
                ? "中款"
                : "尾款"
            }}
          </a-descriptions-item>
          <a-descriptions-item label="付款金额">{{
            order.paymoney
          }}</a-descriptions-item>
          <a-descriptions-item label="付款方式">{{
            order.payway == 1
              ? "支付宝支付"
              : order.payway == 2
              ? "微信支付"
              : "银行卡"
          }}</a-descriptions-item>
          <a-descriptions-item label="付款截图" :span="2">
            <!-- <img :src="order.payshot" alt="" /> -->
            <image-preview :src="order.payshot"></image-preview>
          </a-descriptions-item>
          <a-descriptions-item label="备注" :span="2">
            {{ order.remark }}
          </a-descriptions-item>
        </a-descriptions>
      </a-collapse-panel>
    </a-collapse>
  </a-drawer>
</template>

<script>
import { add, uploadPayshot, getList } from "@/myapi/order.js";

export default {
  name: "EnterYeji",
  data() {
    return {
      visible: false,
      customInfo: {},
      orderInfo: {},
      orderHistoryList: []
    };
  },
  methods: {
    open(custom) {
      this.visible = true;
      this.customInfo = custom;
      this.orderInfo.cid = custom.cid;
      this.getHistoryOrder();
    },
    onClose() {
      this.visible = false;
      this.customInfo = {};
      this.orderInfo = {};
    },
    async submitOrder() {
      let { payshot, mid, mealProcess, paymoney, payway } = this.orderInfo;
      console.log("this.orderInfo", this.orderInfo);
      if (!payshot || !mid || !mealProcess || !paymoney || !payway) {
        this.$notification.warning({
          message: "缺少必填项",
          description: "请填写完整的订单信息"
        });
        return;
      }
      let { payshot: payshotfile, ...otherOrderInfo } = this.orderInfo;
      try {
        let addOrder = await add(otherOrderInfo);
        let uploadPayshotResult = await uploadPayshot(
          addOrder.oid,
          payshotfile
        );
        this.$notification.success({
          message: "签单成功",
          description: "订单审核通过后会自动添加你的业绩,加油哦"
        });
        this.visible = false;
      } catch (error) {}
    },
    async getHistoryOrder() {
      try {
        let result = await getList({
          cid: this.customInfo.cid,
          pageNo: 1,
          pageSize: 500
        });
        console.log("result", result);
        this.orderHistoryList = result.result.data;
      } catch (error) {}
    }
  }
};
</script>

<style lang="less" scoped></style>
