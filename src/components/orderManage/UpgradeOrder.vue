<template>
    <a-drawer placement="left" :width="800" @close="onClose" :title="`${order.oid}- ${order.mealName}-升级`" :visible="visible" :destroyOnClose="true">
        <a-spin :spinning="spinning">
            <a-form-model ref="uporderForm" :model="uporder" :rules="uporderRules">
                <a-row :gutter="48">
                    <a-col :span="12">
                        <a-form-model-item label="升级套餐" prop="mid">
                            <meal-select v-model="uporder.mid" @contentchange="onMealChange" :disableds="(order.premids || []).concat(order.mid)" />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="订单金额" prop="money">
                            <a-input-number v-model="uporder.money" style="width:100%" />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="已收金额">
                            <a-input :value="hadPaid" disabled></a-input>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="升级金额" prop="money">
                            <a-input :value="upMoney" disabled></a-input>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-model-item label="订单备注">
                            <a-textarea v-model="uporder.remark" :defaultValue="order.remark" placeholder="比如:赠送活动 2 次" />
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
                            <id-input v-model="receipt.account" />
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

    </a-drawer>
</template>

<script>
import { updateOrder } from "@/myapi/order.js";
import { add as addReceipt } from "@/myapi/payreceipt.js";
import { mapState } from "vuex";
export default {
    name: "SignOrder",
    data() {
        return {
            visible: false,
            spinning: false,
            upMoney: 0,
            selectMeal: {}, //选择的套餐
            order: {}, //原订单
            uporder: {}, //升级订单信息
            receipt: {}, //收据信息
            uporderRules: {
                mid: [
                    { required: true, message: "请选择套餐", trigger: "change" }
                ],
                money: [
                    {
                        required: true,
                        message: "请输入订单金额",
                        trigger: "change"
                    }
                ]
            },
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
        hadPaid() {
            console.log(this.order.payList);
            return this.order.payList
                ? this.order.payList.reduce(
                      (p1money, p2) => p1money + p2.money || 0,
                      0
                  )
                : 0;
        }
    },
    methods: {
        open(order) {
            this.order = order;
            this.visible = true;
        },
        onClose() {
            this.visible = false;
            this.uporder = {};
            this.receipt = {};
            this.$refs.uporderForm.resetFields();
            this.$refs.receiptForm.resetFields();
        },
        onMealChange(meal) {
            this.uporder.money = meal.price;
            this.selectMeal = meal;
            this.upMoney = meal.price - this.hadPaid;
        },
        formValidate() {
            let { mid, amount, remark } = this.uporder;
            this.$refs.uporderForm.validate(valid => {
                if (!valid) {
                    return;
                }
                this.$refs.receiptForm.validate(valid1 => {
                    if (!valid1) {
                        return;
                    }
                    this.upgradeOrder();
                });
            });
        },
        async upgradeOrder() {
            try {
                this.spinning = true;

                let [updateResult, addResult] = await Promise.all([
                    updateOrder({
                        //升级订单
                        oids: [this.order.oid],
                        mid: this.uporder.mid,
                        money: this.uporder.money,
                        remark: this.uporder.remark,
                        premids: (this.order.premids || []).concat(
                            this.order.mid
                        ),
                        upgradeTime: Date.now()
                    }),
                    addReceipt({
                        //添加收据
                        ...this.receipt,
                        orderid: this.order.oid,
                        customid: this.order.cid,
                        creator: this.creator,
                        content: `${this.receipt.content}/${this.selectMeal.name}`
                    })
                ]);
                if (updateResult.status === 200 && addResult.status === 200) {
                    this.$notification.success({
                        message: "升级成功",
                        description: "订单升级成功!"
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
