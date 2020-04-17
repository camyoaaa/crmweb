<template>
    <a-drawer placement="left" :width="1000" @close="onClose" :visible="visible" :destroyOnClose="true">
        <a-spin :spinning="orderListLoading">
            <a-collapse defaultActiveKey="0" accordion v-if="orderList.length!= 0">
                <a-collapse-panel v-for="(order,index) in orderList" :key="index">
                    <span slot="header">
                        {{order.mealInfo.name}} - {{order.createTime | dateformat}}
                    </span>
                    <span slot="extra">订单号:{{order.oid}}</span>
                    <div style="margin-top:-20px">
                        <div class="itemtitle">
                            订单详情
                            <a-tooltip title="升级订单">
                                <a-icon type="rocket" size="small" style="cursor:pointer" @click="upgrading = true" />
                            </a-tooltip>
                            <!-- <a-tooltip title="取消订单" v-if="order.payList.length == 0">
                                <a-icon type="delete" size="small" @click="cancelOrder(order.oid)" />
                            </a-tooltip> -->
                        </div>
                        <a-card v-if="upgrading" style="margin-bottom:10px">
                            <a-form>
                                <a-row :gutter="48">
                                    <a-col :span="12">
                                        <a-form-item label="升级套餐" required>
                                            <meal-select v-model="upgrade.mid" />
                                        </a-form-item>
                                    </a-col>
                                    <a-col :span="12">
                                        <a-form-item label="套餐金额" required>
                                            <a-input-number v-model="upgrade.amount" style="width:100%" />
                                        </a-form-item>
                                    </a-col>
                                    <a-col :span="24">
                                        <a-form-item label="升级备注">
                                            <a-textarea :rows="3" v-model="upgrade.remark" placeholder="请加上升级前的备注,如赠送活动2次"></a-textarea>
                                        </a-form-item>
                                    </a-col>
                                </a-row>
                            </a-form>
                            <div style="text-align:center" :gutter="48">
                                <a-button type="primary" icon="plus" @click="upgradeOrder(order.oid)" :loading="upgradeLoading">确定</a-button>
                                <a-button type="primary" icon="close-circle" @click="upgrading = false">取消</a-button>
                            </div>
                        </a-card>
                        <a-card>
                            <a-descriptions>
                                <a-descriptions-item label="订购套餐">{{order.mealInfo.name}}</a-descriptions-item>
                                <a-descriptions-item label="订单金额">{{order.amount | numformat}}</a-descriptions-item>
                                <a-descriptions-item label="未收金额">{{(order.amount - order.payList.reduce((pay1,pay2)=>pay1.money||0 + pay2.money || 0,0)) | numformat}}</a-descriptions-item>
                                <a-descriptions-item label="创建人">{{order.creatorInfo.name}}</a-descriptions-item>
                                <a-descriptions-item label="创建时间">{{order.createTime |dateformat}}</a-descriptions-item>
                                <a-descriptions-item label="订单备注">{{order.remark}}</a-descriptions-item>
                            </a-descriptions>
                        </a-card>

                        <div class="itemtitle">
                            单据信息
                            <a-tooltip v-if="!addingreceipt" title="新增收款" placement="right">
                                <a-icon type="plus" size="small" @click="addingreceipt = true" />
                            </a-tooltip>
                        </div>
                        <a-card v-if="addingreceipt" style="margin-bottom:10px">
                            <a-form>
                                <a-row :gutter="48">
                                    <a-col :span="12">
                                        <a-form-item label="收款款项" required>
                                            <meal-process-select v-model="receipt.payment" />
                                        </a-form-item>
                                    </a-col>
                                    <a-col :span="12">
                                        <a-form-item label="收款金额" required>
                                            <a-input-number v-model="receipt.money" style="width:100%" />
                                        </a-form-item>
                                    </a-col>
                                    <a-col :span="12">
                                        <a-form-item label="收款方式" required>
                                            <pay-way v-model="receipt.payway" />
                                        </a-form-item>
                                    </a-col>
                                    <a-col :span="12">
                                        <a-form-item label="收款账号" required>
                                            <a-input v-model="receipt.account" />
                                        </a-form-item>
                                    </a-col>
                                    <a-col :span="12">
                                        <a-form-item label="收款截图" required>
                                            <pay-shot v-model="receipt.shot" />
                                        </a-form-item>
                                    </a-col>
                                </a-row>
                            </a-form>
                            <div style="text-align:center" :gutter="48">
                                <a-button type="primary" icon="plus" @click="addReceipt(order)" :loading="addReceiptLoading">确定</a-button>
                                <a-button type="primary" icon="close-circle" @click="addingreceipt = false">取消</a-button>
                            </div>
                        </a-card>
                        <a-card>
                            <a-list size="large">
                                <a-list-item :key="index" v-for="(item, index) in order.payList">
                                    <a-list-item-meta>
                                        <image-preview slot="avatar" :src="item.shot" class="shotimg" />
                                        <span slot="description">{{item.content}}</span>
                                        <a-statistic slot="title" :precision="2" :valueStyle="{fontSize:'16px'}" :value="item.money" />
                                    </a-list-item-meta>
                                    <div class="list-content">
                                        <div class="list-content-item">
                                            <span>收款人</span>
                                            <p>{{ item.creator }}</p>
                                        </div>
                                        <div class="list-content-item">
                                            <span>收款方式</span>
                                            <p>{{ item. way== 1?'支付宝支付':item.way==2?'微信支付':'银行卡' }}</p>
                                        </div>
                                        <div class="list-content-item">
                                            <span>收款账号</span>
                                            <p>{{ item.account }}</p>
                                        </div>
                                        <div class="list-content-item">
                                            <span>收款时间</span>
                                            <p>{{ item.createTime |dateformat }}</p>
                                        </div>
                                        <div class="list-content-item">
                                            <span>状态</span>
                                            <p>
                                                <a-badge :status="item.status==1?'processing':item.status==2?'success':'error'" :text="item.status==1?'审核中':item.status==2?'通过':'未通过'"></a-badge>
                                            </p>

                                        </div>
                                    </div>
                                </a-list-item>
                            </a-list>
                        </a-card>
                        <div class="itemtitle">
                            合同信息
                            <a-tooltip v-if="!addingcontract" title="新增合同" placement="right">
                                <a-icon type="plus" size="small" @click="addingcontract = true" />
                            </a-tooltip>
                        </div>
                        <a-card v-if="addingcontract" style="margin-bottom:10px">
                            <a-form>
                                <a-row :gutter="48">
                                    <a-col :span="12">
                                        <a-form-item label="签约方式" required>
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
                                        <a-form-item label="合同截图" required>
                                            <pay-shot v-model="contract.shot" />
                                        </a-form-item>
                                    </a-col>
                                </a-row>
                            </a-form>
                            <div style="text-align:center">
                                <a-button type="primary" icon="plus" @click="addContract(order.oid)">确定</a-button>
                                <a-button type="primary" icon="close-circle" @click="addingcontract = false">取消</a-button>
                            </div>
                        </a-card>
                        <a-card>
                            <a-list size="large">
                                <a-list-item :key="index" v-for="(item, index) in order.contractList">
                                    <a-list-item-meta>
                                        <image-preview slot="avatar" :src="item.shot" class="shotimg" />
                                        <span slot="description">签约链接:{{item.url}}</span>
                                        <div slot="title">{{item.way ==1?'法大大电子合同':'现场签约'}}</div>
                                    </a-list-item-meta>
                                    <div class="list-content">
                                        <div class="list-content-item">
                                            <span>合同创建人</span>
                                            <p>{{ item.creator }}</p>
                                        </div>
                                        <div class="list-content-item">
                                            <span>合同创建时间</span>
                                            <p>{{ item.createTime |dateformat }}</p>
                                        </div>
                                        <div class="list-content-item">
                                            <span>合同状态</span>
                                            <p>
                                                <a-badge :status="item.status==1?'processing':item.status==2?'success':'error'" :text="item.status==1?'审核中':item.status==2?'通过':'未通过'"></a-badge>
                                            </p>
                                        </div>
                                    </div>
                                </a-list-item>
                            </a-list>
                        </a-card>
                    </div>
                </a-collapse-panel>
            </a-collapse>
        </a-spin>
    </a-drawer>
</template>

<script>
import {
    getList,
    deleteOrder,
    upgradeOrder
} from "@/myapi/order.js";

import {
    add as addReceipt,
    uploadshot as uploadReceiptShot
} from "@/myapi/payreceipt.js";

import {
    add as addContract,
    uploadshot as uploadContractShot
} from "@/myapi/contract.js";
import { mapState } from "vuex";
export default {
    data() {
        return {
            visible: false,
            custom: {},
            upgrade: {},
            receipt: {},
            contract: {},
            orderList: [],
            upgrading: false,
            addingreceipt: false,
            addingcontract: false,
            upgradeLoading: false,
            orderListLoading: false,
            addReceiptLoading: false,
            addContractLoading: false
        };
    },
    computed: {
        ...mapState({
            userAccount: state => state.user.account
        })
    },
    methods: {
        open(custom) {
            this.custom = custom;
            this.getOrderList();
            this.visible = true;
        },
        onClose() {
            this.visible = false;
            this.clear();
        },
        clear() {
            this.custom = {};
            this.upgrade = {};
            this.receipt = {};
            this.contract = {};
            this.upgrading = false;
            this.addingcontract = false;
            this.addingreceipt = false;
            this.upgradeLoading = false;
            this.orderListLoading = false;
            this.addReceiptLoading = false;
            this.addContractLoading = false;
        },
        async upgradeOrder(orderid) {
            let { mid, amount, remark } = this.upgrade;
            if (!mid || !amount) {
                this.$notification.error({
                    message: "缺少必填项",
                    description: "请填写好完整的升级信息"
                });
                return;
            }
            try {
                let upgradeSucess = await upgradeOrder({
                    orderid,
                    mid,
                    amount,
                    remark
                });
                if (upgradeSucess.status == 200) {
                    this.$notification.success({
                        message: "订单升级成功,快去录入"
                    });
                    this.getOrderList();
                    this.$emit("success");
                    this.clear();
                }
            } catch (error) {}
        },
        async cancelOrder(orderid) {
            this.$confirm({
                title: "你确认取消订单吗",
                async onOk() {
                    try {
                        let deleteSuccess = await deleteOrder(orderid);
                        this.$notification.success({
                            message: "取消订单成功"
                        });
                        this.getOrderList();
                        this.$emit("success");
                        this.clear();
                    } catch (error) {}
                },
                onCancel() {}
            });
        },
        async getOrderList() {
            try {
                this.orderListLoading = true;
                let result = await getList({
                    pageSize: 500,
                    pageNo: 1,
                    cid: this.custom.cid
                });
                if (result.status == 200) {
                    this.orderList = result.result.data;
                    this.$nextTick(() => {
                        this.defaultActiveKey = 0;
                    });
                }
            } catch (error) {
            } finally {
                this.orderListLoading = false;
            }
        },
        async addReceipt(order) {
            let { payment, money, payway, account, shot } = this.receipt;
            if (!(payment && money && payway && account && shot)) {
                this.$notification.error({
                    message: "缺少必填项",
                    description: "请填写好完整的单据信息"
                });
                return;
            }
            try {
                this.addReceiptLoading = true;
                let result = await addReceipt({
                    creator: this.userAccount,
                    orderid: order.oid,
                    customid: this.custom.cid,
                    content: `${
                        payment == 1 ? "定金" : payment == 2 ? "中款" : "尾款"
                    }/${order.mealInfo.name}`,
                    way: payway,
                    account,
                    money
                });
                if (result.status == 200 && result.receiptID) {
                    let addShot = await uploadReceiptShot({
                        receiptid: result.receiptID,
                        shot
                    });
                }
                this.$notification.success({
                    message: "添加收款单据成功",
                    description:
                        "您的单据正在审核阶段,审核通过后自动录入业绩,继续加油哦"
                });
                this.getOrderList();
                this.$emit("success");
                this.clear();
            } catch (error) {
            } finally {
                this.addReceiptLoading = false;
            }
        },
        async addContract(orderid) {
            let { url, way, shot } = this.contract;
            if (!way || !(url || shot)) {
                this.$notification.error({
                    message: "缺少必填项",
                    description: "请填写好完整的合同信息"
                });
                return;
            }
            try {
                this.addContractLoading = true;
                let result = await addContract({
                    cid: this.custom.cid,
                    orderid,
                    creator: this.userAccount,
                    url,
                    way
                });
                if (result.status == 200 && result.ctid) {
                    let uploadShot = await uploadContractShot({
                        ctid: result.ctid,
                        shot
                    });
                }
                this.addContractLoading = false;
                this.$notification.success({
                    message: "添加订单合同成功",
                    description: "您的合同增加成功,继续加油哦"
                });
                this.getOrderList();
                this.$emit("success");
                this.clear();
            } catch (error) {
                console.log(error);
            } finally {
                this.addContractLoading = false;
            }
        }
    }
};
</script>

<style lang="less" scoped>
.shotimg {
    width: 50px;
    height: 50px;
    border: none !important;
    padding: 0px !important;
}
.itemtitle {
    margin: 20px 0px;
    color: rgba(0, 0, 0, 0.85);
    font-weight: bold;
    font-size: 16px;
    line-height: 1.5;
}
.list-content-item {
    color: rgba(0, 0, 0, 0.45);
    display: inline-block;
    vertical-align: middle;
    font-size: 14px;
    margin-left: 40px;
    span {
        line-height: 20px;
    }
    p {
        margin-top: 4px;
        margin-bottom: 0;
        line-height: 22px;
    }
}
</style>