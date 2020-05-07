<template>
    <a-drawer placement="left" :width="800" @close="onClose" :visible="visible" :title="`${order.oid}-${order.mealName}`" :destroyOnClose="true">
        <a-spin :spinning="spinning">
            <a-form-model ref="contractForm" :model="contract" :rules="receiptRules">
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
                        <a-form-model-item label="合同链接" prop="url">
                            <a-input v-model="contract.url" style="width:100%" />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="合同截图" prop="shot">
                            <pay-shot v-model="contract.shot" />
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
import { add } from "@/myapi/contract.js";
import { mapState } from "vuex";
export default {
    data() {
        return {
            visible: false,
            spinning: false,
            order: {},
            contract: {},
            receiptRules: {
                way: [
                    {
                        required: true,
                        message: "请选择签约方式",
                        trigger: "change"
                    }
                ],
                shot: [
                    {
                        required: true,
                        message: "请上传合同截图",
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
            this.contract = {};
            this.$refs.contractForm.resetFields();
            this.spinning = false;
            this.visible = false;
        },
        addReceipt(order) {
            this.$refs.contractForm.validate(async valid => {
                if (!valid) {
                    return;
                }
                try {
                    this.spinning = true;
                    let result = await add({
                        creator: this.userAccount,
                        orderid: this.order.oid,
                        cid: this.order.cid,
                        ...this.contract
                    });
                    this.$notification.success({
                        message: "添加合同成功",
                        description: "您的合同将会通知销售经理审核"
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