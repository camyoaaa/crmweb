<template>
    <a-drawer placement="left" :width="800" @close="onClose" :title="`${customInfo.name}- 签单`" :visible="visible" :destroyOnClose="true">
        <a-alert type="info">
            <div slot="message">
                签单前请确认已经补充好客户的完整信息
                <router-link :to="{path:'/customFollow',query:{cid:customInfo.cid}}">去补充</router-link>
            </div>
        </a-alert>
        <a-form>
            <a-row :gutter="48">
                <a-col :span="12">
                    <a-form-item label="订购套餐" required>
                        <meal-select v-model="order.mid" @contentchange="meal => (order.amount = meal.price)" />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label="订单金额" required>
                        <a-input-number v-model="order.amount" style="width:100%" />
                    </a-form-item>
                </a-col>
                <a-col :span="24">
                    <a-form-item label="订单备注">
                        <a-textarea v-model="order.remark" placeholder="比如:赠送活动 2 次" />
                    </a-form-item>
                </a-col>
                <a-col :span="24">
                    <a-button type="primary" block icon="highlight" size="large" @click="submitOrder">提交</a-button>
                </a-col>
            </a-row>
        </a-form>
    </a-drawer>
</template>

<script>
import { add, uploadPayshot, getList, addOrder } from "@/myapi/order.js";
import { addContract } from "@/myapi/contract.js";
import { addReceipt } from "@/myapi/payreceipt.js";
import { mapState } from "vuex";
export default {
    name: "SignOrder",
    data() {
        return {
            visible: false,
            customInfo: {}, //客户信息
            order: {}, //订单信息
            contractInfo: {}, //合同信息
            payreceiptInfo: {}, //收据信息
            orderHistoryList: [] //历史订单
        };
    },
    computed: {
        ...mapState({
            userAccount: state => state.user.account
        })
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
        },
        async submitOrder() {
            let { mid, amount, remark } = this.order;
            if (!mid || !amount) {
                this.$notification.warning({
                    message: "缺少必填项",
                    description: "请填写完整的订单信息"
                });
                return;
            }
            try {
                let addOrder = await add({
                    ...this.order,
                    creator: this.userAccount,
                    cid: this.customInfo.cid
                });
                this.$notification.success({
                    message: "签单成功",
                    description: "订单创建成功!"
                });
                this.$emit("success");
                this.visible = false;
            } catch (error) {}
        }
    }
};
</script>
