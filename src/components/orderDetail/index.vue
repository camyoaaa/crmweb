<template>
    <a-spin :spinning="spinning" size="large">
        <a-page-header id="components-page-header-demo-responsive" :ghost="false" @back="() => $router.go(-1)" :title="`单号:${orderDetail.oid || ''}`" subTitle="" style="margin:-23px -16px;margin-bottom:0px">
            <template slot="extra">
                <!-- <a-button key="2">Operation</a-button> -->
                <a-button key="1" type="primary" icon="redo" @click="getOrderDetail">
                    刷新
                </a-button>
            </template>
            <div class="content">
                <div class="main" style="margin-left:30px">
                    <a-descriptions :column="3">
                        <a-descriptions-item label="创建人">{{orderDetail.creatorInfo.name}}({{orderDetail.creatorInfo.account}})</a-descriptions-item>
                        <a-descriptions-item label="订购套餐">
                            {{orderDetail.mealInfo.name}}
                        </a-descriptions-item>
                        <a-descriptions-item label="创建时间">{{orderDetail.createTime | dateformat}}</a-descriptions-item>
                        <!-- <a-descriptions-item label="活动赠送"> 2 次</a-descriptions-item> -->
                        <a-descriptions-item label="订单备注">{{orderDetail.remark}}</a-descriptions-item>
                    </a-descriptions>
                </div>
                <div class="extra">
                    <div style="display:flex;width:max-content;justify-content:flex-end">
                        <a-statistic title="订单金额" :value="orderDetail.money" prefix="￥" style="margin-right:40px" />
                        <a-statistic title="已收金额" prefix="￥" :value="orderDetail.payreceiptList.reduce((p1,p2)=>p1.money||0+p2.money||0,0)" />
                    </div>
                </div>
            </div>

        </a-page-header>
        <a-card title="订单进度" style="margin-top:20px">
            <a-steps progressDot :current="currentProcess(orderDetail)">
                <a-step title="创建订单" :description="orderDetail.createTime | dateformat" />
                <a-step title="售后中">
                    <div slot="description">活动进度: {{orderDetail.aftersales.activityStep}} / {{orderDetail.aftersales.totalActivity}}</div>
                </a-step>
                <!-- <a-step title="售后处理" :description="orderDetail.followrecords.length > 0?orderDetail.followrecords[0].comment:''" /> -->
                <a-step title="完成" :description="orderDetail.aftersales.endTime | dateformat" />
            </a-steps>
        </a-card>
        <a-card title="客户信息" style="margin-top:20px">
            <a-descriptions :column="4">
                <a-descriptions-item label="客户名称">{{orderDetail.customInfo.name}}</a-descriptions-item>
                <a-descriptions-item label="客户编号">
                    <router-link :to="{path:'/customDetail',query:{cid:orderDetail.customInfo.cid}}">{{orderDetail.customInfo.cid}}</router-link>
                </a-descriptions-item>
                <a-descriptions-item label="客户来源">{{orderDetail.customInfo.fromZn}}</a-descriptions-item>
                <a-descriptions-item label="身份证号">{{orderDetail.customInfo.idcard}}</a-descriptions-item>
                <a-descriptions-item label="客户手机">{{orderDetail.customInfo.phone}}</a-descriptions-item>
                <a-descriptions-item label="客户微信">{{orderDetail.customInfo.wx}}</a-descriptions-item>
                <a-descriptions-item label="客户Q Q">{{orderDetail.customInfo.qq}}</a-descriptions-item>
                <a-descriptions-item label="省/直辖市/自治区">{{orderDetail.customInfo.province}}</a-descriptions-item>
                <a-descriptions-item label="市/辖区">{{orderDetail.customInfo.city}}</a-descriptions-item>
                <a-descriptions-item label="区/县">{{orderDetail.customInfo.county}}</a-descriptions-item>
                <a-descriptions-item label="详细地址">{{orderDetail.customInfo.address}}</a-descriptions-item>
            </a-descriptions>
        </a-card>
        <a-card title="售后信息" style="margin-top:20px">
            <a-descriptions :column="4">
                <a-descriptions-item label="售后完成">{{orderDetail.aftersales.isEnd == 1 ?'是':'否'}}</a-descriptions-item>
                <a-descriptions-item label="店铺名称">{{orderDetail.aftersales.shopName}}</a-descriptions-item>
                <a-descriptions-item label="是否营业">{{getOpenStatus(orderDetail.aftersales.isOpen)}}</a-descriptions-item>
                <a-descriptions-item label="PC端店铺地址">{{orderDetail.aftersales.pcshopUrl}}</a-descriptions-item>
                <a-descriptions-item label="手机端店铺地址">{{orderDetail.aftersales.mbshopUrl}}</a-descriptions-item>
                <a-descriptions-item label="教学阶段">{{getTeachStep(orderDetail.aftersales.teachStep)}}</a-descriptions-item>
                <a-descriptions-item label="总活动次数">{{orderDetail.aftersales.totalActivity}}</a-descriptions-item>
                <a-descriptions-item label="当前活动次数">{{orderDetail.aftersales.activityStep}}</a-descriptions-item>
                <a-descriptions-item label="活动状态">{{getStatus(orderDetail.aftersales.activityStatus)}}</a-descriptions-item>
            </a-descriptions>
        </a-card>

        <a-row :gutter="24" style="margin-top:20px;margin-bottom:20px">
            <a-col :span="12">
                <a-card title="收款信息">
                    <a-list size="large">
                        <a-list-item :key="index" v-for="(item, index) in orderDetail.payreceiptList">
                            <a-list-item-meta>
                                <image-preview slot="avatar" :src="item.shot" class="shotimg" />
                                <ellipsis slot="description" :length="14" tooltip>{{item.content}}</ellipsis>
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
                                        <a-badge :status="getStatusprocess(item.status)" :text="getStatusZn(item.status)"></a-badge>
                                    </p>
                                </div>
                            </div>
                        </a-list-item>
                    </a-list>
                </a-card>
            </a-col>
            <a-col :span="12">
                <a-card title="合同信息">
                    <a-list size="large">
                        <a-list-item :key="index" v-for="(item, index) in orderDetail.contractList">
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
                                    <span>状态</span>
                                    <p>
                                        <a-badge :status="getStatusprocess(item.status)" :text="getStatusZn(item.status)"></a-badge>
                                        <!-- <a-badge :status="item.status==1?'processing':item.status==2?'success':'error'" :text="item.status==1?'审核中':item.status==2?'通过':'未通过'"></a-badge> -->
                                    </p>

                                </div>
                            </div>
                        </a-list-item>
                    </a-list>
                </a-card>
            </a-col>
            <a-col :span="24" style="margin-top:20px">
                <follow-record :oid="Number($route.query.oid)" :replyable="false"></follow-record>
            </a-col>
        </a-row>
    </a-spin>
</template>

<script>
import { getOrderDetail } from "@/myapi/order.js";
import { mapState } from "vuex";
const OpenStatus = {
    1: "未知",
    2: "营业中",
    3: "未营业"
};
const TeachStep = {
    1: "未开始",
    2: "初级阶段",
    3: "中级阶段",
    4: "高级阶段"
};
const ActivityStatus = {
    1: "未开始",
    2: "审核中",
    3: "已完成"
};
export default {
    computed: {
        ...mapState({
            reviewStatusList: state => state.appconfig.reviewStatusList
        })
    },
    data() {
        return {
            spinning: false,
            orderDetail: {
                creatorInfo: {},
                customInfo: {},
                mealInfo: {},
                aftersales: {},
                payreceiptList: [],
                contractList: [],
                followrecords: []
            }
        };
    },
    created() {
        this.getOrderDetail();
    },
    methods: {
        getStatusZn(status) {
            return this.reviewStatusList.find(s => s.id === status).name;
        },
        getStatusprocess(status) {
            let zn = this.getStatusZn(status);
            if (zn === "等待审核") {
                return "processing";
            } else if (zn === "审核通过") {
                return "success";
            } else {
                return "error";
            }
        },
        async getOrderDetail() {
            try {
                this.spinning = true;
                let result = await getOrderDetail(this.$route.query.oid);
                this.orderDetail = result.data;
                console.log("getOrderDetail", result);
            } catch (error) {
            } finally {
                this.spinning = false;
            }
        },
        getOpenStatus(status) {
            return OpenStatus[status];
        },
        getTeachStep(step) {
            return TeachStep[step];
        },
        getStatus(status) {
            return ActivityStatus[status];
        },
        getOrderStatus(order) {
            let label = "";
            let paid = order.payreceiptList.length > 0;
            let paidChecking = order.payreceiptList.some(
                pay => pay.status == 1
            ); //存在审核中的单据
            let contracted = order.contractList.length > 0;
            let contractedChecking = order.contractList.some(
                pay => pay.status == 1
            ); //存在审核中 的合同
            if (!paid && !contracted) {
                return "创建订单";
            }
            if (paidChecking || contractedChecking) {
                if (paidChecking && contractedChecking) {
                    return "单据,合同审核中";
                }
                if (paidChecking && !contractedChecking) {
                    return "单据审核中";
                }
                if (!paidChecking && contractedChecking) {
                    return "合同审核中";
                }
            }
            if (paid && contracted) {
                return "售后中";
            }
        },
        currentProcess(orderDetail) {
            if (orderDetail.aftersales.isEnd === 1) {
                return 2;
            } else {
                return 1;
            }
        }
    }
};
</script>

<style lang="less" scoped>
#components-page-header-demo-responsive .content {
    display: flex;
}
#components-page-header-demo-responsive .ant-statistic-content {
    font-size: 20px;
    line-height: 28px;
}
@media (max-width: 576px) {
    #components-page-header-demo-responsive .content {
        display: block;
    }

    #components-page-header-demo-responsive .main {
        width: 100%;
        margin-bottom: 12px;
    }

    #components-page-header-demo-responsive .extra {
        width: 100%;
        margin-left: 0;
        text-align: left;
    }
}
.shotimg {
    width: 50px;
    height: 50px;
    border: none !important;
    padding: 0px !important;
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