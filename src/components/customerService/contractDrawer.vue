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
      <a-collapse-panel header="新建合同" key="3">
        <a-form>
          <a-row :gutter="48">
            <a-col :span="12">
              <a-form-item label="签约套餐" required>
                <meal-select v-model="contractInfo.mid"></meal-select>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="签约方式" required>
                <a-select v-model="contractInfo.way">
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
              <a-form-item label="签约链接">
                <a-input v-model="contractInfo.url"></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="签约时间" required>
                <a-date-picker
                  style="width:100%"
                  format="YYYY-MM-DD HH:mm:ss"
                  :showTime="{ defaultValue: $moment('00:00:00', 'HH:mm:ss') }"
                  v-model="contractInfo.time"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="成交金额" required>
                <a-input-number style="width:100%" v-model="contractInfo.money">
                </a-input-number>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="已收" required>
                <a-input-number style="width:100%" v-model="contractInfo.got">
                </a-input-number>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="签约截图" required>
                <pay-shot v-model="contractInfo.shot"></pay-shot>
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
                @click="submitContract"
                >提交</a-button
              >
            </a-col>
          </a-row>
        </a-form>
      </a-collapse-panel>
      <a-collapse-panel
        v-for="contract in orderHistoryList"
        :key="contract.oid"
      >
        <span slot="header">
          合同ID: {{ contract.ctid }}
          <span style="margin-left:10px"> {{ contract.mealInfo.name }}</span>

          <span style="color:#ccc">{{
            $moment(contract.createTime).fromNow()
          }}</span>
        </span>
        <span slot="extra">
          {{ contract.createTime | dateformat }}
        </span>

        <a-descriptions size="default" :column="2">
          <a-descriptions-item label="方式">{{
            contract.way == 1 ? "法大大电子合同" : "现场签约"
          }}</a-descriptions-item>
          <a-descriptions-item label="签约时间">{{
            contract.time | dateformat
          }}</a-descriptions-item>
          <a-descriptions-item label="成交金额">
            {{ contract.money }}
          </a-descriptions-item>
          <a-descriptions-item label="已收">{{
            contract.got
          }}</a-descriptions-item>
          <a-descriptions-item label="未收">{{
            Number(contract.money) - Number(contract.got)
          }}</a-descriptions-item>
          <a-descriptions-item label="备注">
            {{ contract.remark }}
          </a-descriptions-item>
          <a-descriptions-item label="付款截图">
            <image-preview :src="contract.shot" />
          </a-descriptions-item>
        </a-descriptions>
      </a-collapse-panel>
    </a-collapse>
  </a-drawer>
</template>

<script>
import { add, uploadShot, getList } from "@/myapi/contract.js";
import { mapState } from "vuex";

export default {
  name: "EnterContract",
  computed: {
    ...mapState({
      account: state => state.user.account
    })
  },
  data() {
    return {
      visible: false,
      customInfo: {},
      contractInfo: {},
      orderHistoryList: []
    };
  },
  methods: {
    open(custom) {
      this.visible = true;
      this.customInfo = custom;
      this.contractInfo.cid = custom.cid;
      this.getHistoryOrder();
    },
    onClose() {
      this.visible = false;
      this.customInfo = {};
      this.contractInfo = {};
    },
    async submitContract() {
      let { shot, mid, url, time, way, money, got } = this.contractInfo;
      console.log(
        "this.contractInfo",

        !(shot || url)
      );
      if (!(shot || url) || !mid || !time || !way || !money || !got) {
        this.$notification.warning({
          message: "缺少必填项",
          description: "请填写完整的订单信息"
        });
        return;
      }
      let { shot: shotfile, ...otherOrderInfo } = this.contractInfo;
      otherOrderInfo.creator = this.account;
      otherOrderInfo.time = this.$moment(otherOrderInfo.time).valueOf();
      try {
        let addcontract = await add(otherOrderInfo);
        let uploadPayshotResult = await uploadShot(addcontract.ctid, shotfile);
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
