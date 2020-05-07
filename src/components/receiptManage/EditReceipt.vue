<template>
    <a-drawer placement="left" :width="800" @close="onClose" :visible="visible" :title="`编辑收据-${receipt.payreceiptid}`" :destroyOnClose="true">
        <a-spin :spinning="spinning">
            <a-alert type="info" showIcon>
                <div slot="message">审核备注 : {{receipt.reviewmark || '无'}}</div>
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
                        <a-form-model-item label="收款截图">
                            <image-preview :src="receipt.shot" style="width:102px;height:102px;"></image-preview>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="更新收款截图">
                            <pay-shot v-model="receipt.updateShot" v-if="visible" />
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row>
                    <a-button block type="primary" icon="plus" @click="addReceipt">更新收据</a-button>
                </a-row>
            </a-form-model>
        </a-spin>
    </a-drawer>
</template>

<script>
import { add, updateReceipt, uploadshot } from "@/myapi/payreceipt.js";
import { mapState } from "vuex";
export default {
    data() {
        return {
            visible: false,
            spinning: false,
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
        })
    },
    methods: {
        open(receipt) {
            this.receipt = { ...receipt };
            this.visible = true;
        },
        onClose() {
            this.visible = false;
            this.clear();
        },
        clear() {
            this.receipt = {};
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
                    let {
                        payreceiptid,
                        shot,
                        updateShot,
                        ...payload
                    } = this.receipt;
                    let result = await updateReceipt({
                        payreceiptids: [payreceiptid],
                        ...payload,
                        status: 0,
                        reviewmark: "驳回后更正"
                    });
                    if (updateShot) {
                        let uploadResult = await uploadshot({
                            payreceiptid,
                            shot: updateShot
                        });
                        console.log("uploadResult", uploadResult);
                    }

                    this.$notification.success({
                        message: "收款单据更新成功",
                        description:
                            "您的单据正在审核阶段,审核通过后自动录入业绩,继续加油哦"
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

<style lang="less" scoped>
</style>