<template>
    <a-spin :spinning="spinning" size="large">
        <a-page-header id="components-page-header-demo-responsive" :ghost="false" @back="() => $router.go(-1)" :title="`客户:${customDetail.cid || ''}`" subTitle="" style="margin:-23px -16px;margin-bottom:0px">
            <template slot="extra">
                <a-button key="1" type="primary" icon="redo" @click="initData">
                    刷新
                </a-button>
            </template>
            <div class="content">
                <div class="main" style="margin-left:30px">
                    <a-descriptions :column="3">
                        <a-descriptions-item label="客户名称">{{customDetail.name}}</a-descriptions-item>
                        <a-descriptions-item label="客户编号">{{customDetail.cid}}</a-descriptions-item>
                        <a-descriptions-item label="客户来源">{{customDetail.fromZn}}</a-descriptions-item>
                        <a-descriptions-item label="身份证号">{{customDetail.idcard || '无'}}</a-descriptions-item>
                        <a-descriptions-item label="客户手机">{{customDetail.phone || '无'}}</a-descriptions-item>
                        <a-descriptions-item label="客户微信">{{customDetail.wx || '无'}}</a-descriptions-item>
                        <a-descriptions-item label="客户Q Q">{{customDetail.qq || '无'}}</a-descriptions-item>
                        <a-descriptions-item label="客户Q Q">{{customDetail.qq || '无'}}</a-descriptions-item>
                        <a-descriptions-item label="详细地址">{{customDetail.address || '无'}}</a-descriptions-item>
                        <a-descriptions-item label="省/直辖市/自治区">{{customDetail.province || '无'}}</a-descriptions-item>
                        <a-descriptions-item label="市/辖区">{{customDetail.city || '无'}}</a-descriptions-item>
                        <a-descriptions-item label="区/县">{{customDetail.county || '无'}}</a-descriptions-item>

                    </a-descriptions>
                </div>
                <div class="extra">
                    <div style="display:flex;width:max-content;width:200px;height:100%;align-items:flex-start;justify-content: center;flex-direction:column">
                        <a-progress type="circle" :width="90" :percent="100" :strokeColor="matchStatus.color">
                            <template v-slot:format>
                                <span style="font-weight:bold;font-size:18px" :style="{color:matchStatus.color}">{{matchStatus.name}}</span>
                            </template>
                        </a-progress>
                    </div>
                </div>
            </div>
        </a-page-header>
        <a-row :gutter="20" style="margin-top:20px">
            <a-col :span="24">
                <a-card title="订单列表">
                    <a-table :dataSource="orderList" rowKey="oid" :columns="orderColumns" :pagination="false">
                        <span slot="oid" slot-scope="text">
                            <router-link :to="{path:'/orderDetail',query:{oid:text}}">{{text}}</router-link>
                        </span>
                        <span slot="money" slot-scope="text">
                            {{text |numformat}}
                        </span>
                        <span slot="createTime" slot-scope="text">
                            {{text |dateformat}}
                        </span>
                        <span slot="hadreceipt" slot-scope="text,record">
                            {{getPaidMoney(record) | numformat}}
                        </span>
                        <span slot="contract" slot-scope="text,record">
                            {{record.contract.way === 1 ? '法大大电子合同':record.contract.way === 2?'现场签约':'暂未签约'}}
                        </span>
                        <!-- <span slot="status" slot-scope="text,record">
                            {{getOrderStatus(record)}}
                        </span> -->
                    </a-table>
                </a-card>
            </a-col>
            <a-col :span="24" style="margin-top:20px">
                <follow-record :cid="Number($route.query.cid)" :replyable="false"></follow-record>
            </a-col>
        </a-row>
    </a-spin>
</template>

<script>
import { getList as getCustomDetail } from "@/myapi/custom.js";
import { getList } from "@/myapi/order.js";
import { mapState } from "vuex";
export default {
    computed: {
        ...mapState({
            customStatusList: state => state.appconfig.customStatusList
        }),
        matchStatus() {
            return (
                this.customStatusList.find(
                    s => s.id === this.customDetail.status
                ) || {}
            );
        }
    },
    data() {
        return {
            spinning: false,
            customDetail: {
                status_doc: {},
                from_doc: {}
            },
            orderList: [],
            orderColumns: [
                {
                    title: "订单号",
                    dataIndex: "oid",
                    scopedSlots: { customRender: "oid" }
                },
                {
                    title: "套餐",
                    dataIndex: "mealName"
                },
                {
                    title: "订单金额",
                    dataIndex: "money",
                    scopedSlots: { customRender: "money" }
                },
                {
                    title: "已收金额",
                    dataIndex: "hadreceipt",
                    scopedSlots: { customRender: "hadreceipt" }
                },
                {
                    title: "创建人",
                    dataIndex: "creatorName"
                },
                {
                    title: "创建时间",
                    dataIndex: "createTime",
                    scopedSlots: { customRender: "createTime" }
                },
                {
                    title: "订单备注",
                    dataIndex: "remark"
                },
                {
                    title: "签订合同",
                    dataIndex: "contract",
                    scopedSlots: { customRender: "contract" }
                }
                // {
                //     title: "订单状态",
                //     dataIndex: "status",
                //     scopedSlots: { customRender: "status" }
                // }
            ]
        };
    },
    created() {
        this.initData();
    },
    methods: {
        initData() {
            this.getCustomDetail();
            this.getOrderList();
        },
        getPaidMoney(order) {
            let total = order.payList.reduce((p1, p2) => {
                return p1 + (p2.money || 0);
            }, 0);
            return total;
        },
        async getCustomDetail() {
            try {
                this.spinning = true;
                // let result = await getCustomDetail(this.$route.query.cid);
                let result = await getCustomDetail({
                    cid: this.$route.query.cid
                });
                this.customDetail = result.result.data[0];
                // this.customDetail = result.data;
            } catch (error) {
            } finally {
                this.spinning = false;
            }
        },
        async getOrderList() {
            try {
                let result = await getList({
                    pageSize: 500,
                    pageNo: 1,
                    cid: this.$route.query.cid
                });
                if (result.status == 200) {
                    this.orderList = result.result.data;
                }
            } catch (error) {}
        },
        getOrderStatus(order) {
            let label = "";
            let paid = order.payList.length > 0;
            let paidChecking = order.payList.some(pay => pay.status == 1); //存在审核中的单据
            let contracted = order.contract.ctid;
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