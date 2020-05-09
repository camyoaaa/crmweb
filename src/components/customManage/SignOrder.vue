<template>
    <a-drawer placement="left" :width="800" @close="onClose" :title="`${customInfo.name}- 签单`" :visible="visible" :destroyOnClose="true">

        <a-alert type="warning" v-if="!hasDetailData" showIcon>
            <div slot="message">
                客户信息不完整
            </div>
            <div slot="description">
                签单前请确认已经补充好客户的完整信息
                <router-link :to="{path:'/customFollow',query:{cid:customInfo.cid}}">去补充</router-link>
            </div>
        </a-alert>
        <div v-else>
            <a-spin :spinning="spinning">
                <a-form-model ref="orderForm" :model="order" :rules="orderRules">
                    <a-row :gutter="48">
                        <a-col :span="12">
                            <a-form-model-item label="订购套餐" prop="mid">
                                <meal-select v-model="order.mid" @contentchange="onMealChange" />
                            </a-form-model-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-model-item label="订单金额" prop="money">
                                <a-input-number v-model="order.money" style="width:100%" />
                            </a-form-model-item>
                        </a-col>
                        <a-col :span="24">
                            <a-form-model-item label="订单备注">
                                <a-textarea v-model="order.remark" placeholder="比如:赠送活动 2 次" />
                            </a-form-model-item>
                        </a-col>
                    </a-row>
                </a-form-model>
                <a-divider></a-divider>
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
                </a-form-model>
                <a-row>
                    <a-button type="primary" block icon="highlight" size="large" @click="formValidate">提交</a-button>
                </a-row>
            </a-spin>
        </div>

    </a-drawer>
</template>

<script>
import { add as addOrder, uploadPayshot, getList } from "@/myapi/order.js";
import { add as addContract } from "@/myapi/contract.js";
import { add as addReceipt } from "@/myapi/payreceipt.js";
import { mapState } from "vuex";
export default {
    name: "SignOrder",
    data() {
        return {
            visible: false,
            spinning: false,
            selectMeal: {}, //选中的套餐
            customInfo: {}, //客户信息
            order: {}, //订单信息
            receipt: {}, //收据信息
            orderRules: {
                mid: [
                    { required: true, message: "请选择套餐", trigger: "change" }
                ],
                money: [
                    {
                        required: true,
                        message: "请输入订单金额",
                        trigger: "blur"
                    }
                ]
            },
            receiptRules: {
                content: [
                    {
                        required: true,
                        message: "请选择收款款项",
                        trigger: "blur"
                    }
                ],
                money: [
                    {
                        required: true,
                        message: "请输入收款金额",
                        trigger: "blur"
                    }
                ],
                way: [
                    {
                        required: true,
                        message: "请选择收款方式",
                        trigger: "blur"
                    }
                ],
                account: [
                    {
                        required: true,
                        message: "请输入收款账号",
                        trigger: "blur"
                    }
                ],
                shot: [
                    {
                        required: true,
                        message: "请上传收款截图",
                        trigger: "blur"
                    }
                ]
            }
        };
    },
    computed: {
        ...mapState({
            //订单创建人
            creator: state => state.user.account
        }),
        hasDetailData() {
            //客户信息是否完整
            if (this.customInfo.cid) {
                return (
                    this.customInfo.idcard &&
                    this.customInfo.province &&
                    this.customInfo.county &&
                    this.customInfo.county
                );
            } else {
                return false;
            }
        }
    },
    methods: {
        open(custom) {
            this.visible = true;
            this.customInfo = custom;
        },
        onClose() {
            this.visible = false;
            this.customInfo = {};
            this.order = {};
            this.receipt = {};
            this.$refs.orderForm && this.$refs.orderForm.resetFields();
            this.$refs.receiptForm && this.$refs.receiptForm.resetFields();
        },
        onMealChange(meal) {
            this.selectMeal = meal;
            this.order.money = meal.price;
        },
        formValidate() {
            let { mid, amount, remark } = this.order;
            this.$refs.orderForm.validate(valid => {
                if (!valid) {
                    return;
                }
                this.$refs.receiptForm.validate(valid1 => {
                    if (!valid1) {
                        return;
                    }
                    this.signOrder();
                });
            });
        },
        async signOrder() {
            try {
                this.spinning = true;
                let createOrder = await addOrder({
                    ...this.order,
                    creator: this.creator,
                    cid: this.customInfo.cid
                });
                if (createOrder.status == 200 && createOrder.oid) {
                    let createReceipt = await addReceipt({
                        ...this.receipt,
                        orderid: createOrder.oid,
                        customid: this.customInfo.cid,
                        creator: this.creator,
                        content: `${this.receipt.content}/${this.selectMeal.name}`
                    });
                    this.$notification.success({
                        message: "签单成功",
                        description: "订单创建成功!"
                    });
                    this.onClose();
                    this.$emit("ok");
                }
            } catch (error) {
            } finally {
                this.spinning = false;
            }
        }
    }
};
</script>
