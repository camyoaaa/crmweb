<template>
  <a-drawer
    placement="left"
    :width="800"
    @close="onClose"
    :visible="visible"
    :title="`更正合同-${contract.ctid}`"
    :destroyOnClose="true"
  >
    <a-spin :spinning="spinning">
      <a-alert type="info" showIcon>
        <div slot="message">审核备注 : {{ contract.remark || "无" }}</div>
      </a-alert>
      <a-form-model ref="receiptForm" :model="contract" :rules="receiptRules">
        <a-row :gutter="48">
          <a-col :span="12">
            <a-form-model-item label="签约方式" prop="way">
              <a-select v-model="contract.way">
                <a-select-option :value="1">
                  法大大电子合同
                </a-select-option>
                <a-select-option :value="2">
                  现场签约
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="签约链接" prop="url">
              <a-input v-model="contract.url" style="width:100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="原合同截图">
              <image-preview
                :src="contract.shot"
                style="width:102px;height:102px"
              ></image-preview>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="更新合同截图">
              <pay-shot v-model="contract.updateShot" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-button block type="primary" icon="plus" @click="addReceipt"
            >更新收据</a-button
          >
        </a-row>
      </a-form-model>
    </a-spin>
  </a-drawer>
</template>

<script>
import { updateContract, uploadshot } from "@/myapi/contract.js";
import { mapState } from "vuex";
export default {
  data() {
    return {
      visible: false,
      spinning: false,
      contract: {},
      receiptRules: {
        content: [
          {
            required: true,
            message: "请选择收款款项",
            trigger: "change"
          }
        ],
        money: [
          {
            required: true,
            message: "请输入收款金额",
            trigger: "change"
          }
        ],
        way: [
          {
            required: true,
            message: "请选择签约方式",
            trigger: "change"
          }
        ],
        account: [
          {
            required: true,
            message: "请输入收款账号",
            trigger: "change"
          }
        ],
        shot: [
          {
            required: true,
            message: "请上传收款截图",
            trigger: "change"
          }
        ]
      }
    };
  },
  computed: {
    ...mapState({
      userAccount: state => state.user.account
    })
  },
  methods: {
    open(contract) {
      this.contract = { ...contract };
      this.visible = true;
    },
    onClose() {
      this.visible = false;
      this.clear();
    },
    clear() {
      this.contract = {};
      this.$refs.receiptForm.resetFields();
      this.spinning = false;
      this.visible = false;
    },
    addReceipt() {
      this.$refs.receiptForm.validate(async valid => {
        if (!valid) {
          return;
        }
        try {
          this.spinning = true;
          let { ctid, shot, updateShot, ...payload } = this.contract;
          let result = await updateContract({
            ctids: [ctid],
            ...payload,
            status: 0,
            remark: "驳回后更正"
          });
          if (updateShot) {
            let uploadResult = await uploadshot({
              ctid,
              shot: updateShot
            });
            console.log("uploadResult", uploadResult);
          }

          this.$notification.success({
            message: "合同更新成功",
            description:
              "您的合同正在审核阶段,审核通过后自动录入业绩,继续加油哦"
          });
          this.$emit("ok");
          this.clear();
        } catch (error) {
          console.log(error);
        } finally {
          this.spinning = false;
        }
      });
    }
  }
};
</script>

<style lang="less" scoped></style>
