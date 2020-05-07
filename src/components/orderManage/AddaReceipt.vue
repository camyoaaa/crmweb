<template>
    <a-drawer placement="left" :width="800" @close="onClose" :visible="visible" :title="`${order.oid}-${order.mealName}`" :destroyOnClose="true">
        <a-spin :spinning="spinning">
            <a-alert type="info" showIcon>
                <div slot="message">
                    待收金额:{{toPay | numformat}}
                </div>
            </a-alert>
            <a-form-model ref="receiptForm" :model="receipt" :rules="receiptRules">
                <a-row :gutter="48">
                    <a-col :span="12">
                        <a-form-model-item label="收款款项" prop="content">
                            <meal-process-select v-model="receipt.content" />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="收款金额" prop="money">
                            <a-input-number v-model="receipt.money" style="width:100%" />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="收款方式" prop="way">
                            <pay-way v-model="receipt.way" />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="收款账号" prop="account">
                            <a-input v-model="receipt.account" />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="收款截图" prop="shot">
                            <pay-shot v-model="receipt.shot" />
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row>
                    <a-button block type="primary" icon="plus" @click="addReceipt">添加收款</a-button>
                </a-row>
            </a-form-model>
        </a-spin>
    </a-drawer>
</template>

<script>
import { add } from "@/myapi/payreceipt.js";
import { mapState } from "vuex";
export default {
    data() {
        return {
            visible: false,
            spinning: false,
            order: {},
            receipt: {},
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
                        message: "请选择收款方式",
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
        }),
        paidMoney() {
            return this.order.payList
                ? this.order.payList.reduce(
                      (p1monney, p2) => p1monney + p2.money || 0,
                      0
                  )
                : 0;
        },
        toPay() {
            return this.order.money ? this.order.money - this.paidMoney : 0;
        }
    },
    methods: {
        open(order) {
            this.order = order;
            this.visible = true;
        },
        onClose() {
            this.visible = false;
            this.clear();
        },
        clear() {
            this.order = {};
            this.receipt = {};
            this.$refs.receiptForm.resetFields();
            this.spinning = false;
            this.visible = false;
        },
        addReceipt(order) {
            this.$refs.receiptForm.validate(async valid => {
                if (!valid) {
                    return;
                }
                try {
                    this.spinning = true;
                    let result = await add({
                        creator: this.userAccount,
                        orderid: this.order.oid,
                        customid: this.order.cid,
                        ...this.receipt,
                        content: `${this.receipt.content}/${this.order.mealName}`
                    });
                    this.$notification.success({
                        message: "添加收款单据成功",
                        description:
                            "您的单据正在审核阶段,审核通过后自动录入业绩,继续加油哦"
                    });
                    this.$emit("ok");
                    this.clear();
                } catch (error) {
                } finally {
                    this.spinning = false;
                }
            });
        }
    }
};
</script>

<style lang="less" scoped>
</style>